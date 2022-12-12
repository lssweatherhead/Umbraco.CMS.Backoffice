import { map, Observable } from 'rxjs';
import { UmbDataStoreBase } from '../store';
import type { MediaDetails } from '@umbraco-cms/models';
import { ApiError, ContentTreeItem, MediaResource, ProblemDetails } from '@umbraco-cms/backend-api';

/**
 * @export
 * @class UmbMediaStore
 * @extends {UmbMediaStoreBase<MediaDetails | MediaTreeItem>}
 * @description - Data Store for Media
 */
export class UmbMediaStore extends UmbDataStoreBase<MediaDetails | ContentTreeItem> {
	getByKey(key: string): Observable<MediaDetails | null> {
		// fetch from server and update store
		fetch(`/umbraco/management/api/v1/media/details/${key}`)
			.then((res) => res.json())
			.then((data) => {
				this.update(data);
			});
			
		return this.items.pipe(map((media) => media.find((media) => media.key === key) || null));
	}

	// TODO: make sure UI somehow can follow the status of this action.
	save(data: MediaDetails[]): Promise<void> {
		// fetch from server and update store
		// TODO: use Fetcher API.
		let body: string;

		try {
			body = JSON.stringify(data);
		} catch (error) {
			console.error(error);
			return Promise.reject();
		}

		// TODO: Use node type to hit the right API, or have a general Node API?
		return fetch('/umbraco/management/api/v1/media/save', {
			method: 'POST',
			body: body,
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data: Array<MediaDetails>) => {
				this.update(data);
			});
	}

		// TODO: how do we handle trashed items?
		async trash(keys: Array<string>) {
			// fetch from server and update store
			// TODO: Use node type to hit the right API, or have a general Node API?
			const res = await fetch('/umbraco/management/api/v1/media/trash', {
				method: 'POST',
				body: JSON.stringify(keys),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();
			this.update(data);
		}

	getTreeRoot(): Observable<Array<ContentTreeItem>> {
		MediaResource.getTreeMediaRoot({}).then(
			(res) => {
				this.update(res.items);
			},
			(e) => {
				if (e instanceof ApiError) {
					const error = e.body as ProblemDetails;
					if (e.status === 400) {
						console.log(error.detail);
					}
				}
			}
		);
		
		// TODO: how do we handle trashed items?
		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === null && item.isTrashed === false)));
	}

	getTreeItemChildren(key: string): Observable<Array<ContentTreeItem>> {
		MediaResource.getTreeMediaChildren({
			parentKey: key,
		}).then(
			(res) => {
				this.update(res.items);
			},
			(e) => {
				if (e instanceof ApiError) {
					const error = e.body as ProblemDetails;
					if (e.status === 400) {
						console.log(error.detail);
					}
				}
			}
		);
		
		// TODO: how do we handle trashed items?
		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === key && item.isTrashed === false)));
	}
}
