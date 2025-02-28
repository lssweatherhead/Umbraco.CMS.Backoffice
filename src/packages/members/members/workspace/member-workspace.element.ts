import { UmbMemberWorkspaceEditorElement } from './member-workspace-editor.element.js';
import { UmbMemberWorkspaceContext } from './member-workspace.context.js';
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-member-workspace')
export class UmbMemberWorkspaceElement extends UmbLitElement {
	#workspaceContext = new UmbMemberWorkspaceContext(this);
	#element = new UmbMemberWorkspaceEditorElement();

	@state()
	_routes: UmbRoute[] = [
		{
			path: 'edit/:id',
			component: () => this.#element,
			setup: (_component, info) => {
				const id = info.match.params.id;
				this.#workspaceContext.load(id);
			},
		},
	];

	render() {
		return html` <umb-router-slot .routes=${this._routes}></umb-router-slot> `;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	];
}

export default UmbMemberWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-member-workspace': UmbMemberWorkspaceElement;
	}
}
