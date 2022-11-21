import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, query, state } from 'lit/decorators.js';
import { UmbModalLayoutElement } from '../../../../../core/services/modal/layouts/modal-layout.element';
import { UmbUserStore } from '../../../../../core/stores/user/user.store';
import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';
import type { UserDetails } from '@umbraco-cms/models';
import '../../picker-user-group.element';
import UmbPickerUserGroupElement from '../../picker-user-group.element';

export type UsersViewType = 'list' | 'grid';
@customElement('umb-editor-view-users-invite')
export class UmbEditorViewUsersInviteElement extends UmbContextConsumerMixin(UmbModalLayoutElement) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				width: 100%;
			}
			uui-box {
				max-width: 500px;
			}
			uui-form-layout-item {
				display: flex;
				flex-direction: column;
			}
			uui-input {
				width: 100%;
			}
			form {
				display: flex;
				flex-direction: column;
				box-sizing: border-box;
			}
			uui-form-layout-item {
				margin-bottom: 0;
			}
			uui-textarea {
				--uui-textarea-min-height: 100px;
			}
			/* TODO: Style below is to fix a11y contrast issue, find a proper solution */
			[slot='description'] {
				color: black;
			}
		`,
	];

	@query('#form')
	private _form!: HTMLFormElement;

	@state()
	private _invitedUser?: UserDetails;

	protected _userStore?: UmbUserStore;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext('umbUserStore', (usersContext: UmbUserStore) => {
			this._userStore = usersContext;
		});
	}

	private _handleSubmit(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (!form) return;

		const isValid = form.checkValidity();
		if (!isValid) return;

		const formData = new FormData(form);

		console.log('formData', formData);

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		//TODO: How should we handle pickers forms?
		const userGroupPicker = form.querySelector('#userGroups') as UmbPickerUserGroupElement;
		const userGroups = userGroupPicker?.value || [];

		const message = formData.get('message') as string;

		this._userStore?.invite(name, email, message, userGroups).then((user) => {
			if (user) {
				this._invitedUser = user;
			}
		});
	}

	private _submitForm() {
		this._form?.requestSubmit();
	}

	private _closeModal() {
		this.modalHandler?.close();
	}

	private _resetForm() {
		this._invitedUser = undefined;
	}

	private _goToProfile() {
		if (!this._invitedUser) return;

		this._closeModal();
		history.pushState(null, '', '/section/users/view/users/user/' + this._invitedUser?.key); //TODO: URL Should be dynamic
	}

	private _renderForm() {
		return html` <h1>Invite user</h1>
			<p style="margin-top: 0">
				Invite new users to give them access to Umbraco. An invite email will be sent to the user with information on
				how to log in to Umbraco. Invites last for 72 hours.
			</p>
			<uui-form>
				<form id="form" name="form" @submit="${this._handleSubmit}">
					<uui-form-layout-item>
						<uui-label slot="label" for="name" required>Name</uui-label>
						<uui-input id="name" label="name" type="text" name="name" required></uui-input>
					</uui-form-layout-item>
					<uui-form-layout-item>
						<uui-label slot="label" for="email" required>Email</uui-label>
						<uui-input id="email" label="email" type="email" name="email" required></uui-input>
					</uui-form-layout-item>
					<uui-form-layout-item>
						<uui-label slot="label" for="userGroups" required>User group</uui-label>
						<span slot="description">Add groups to assign access and permissions</span>
						<umb-picker-user-group id="userGroups" name="userGroups"></umb-picker-user-group>
					</uui-form-layout-item>
					<uui-form-layout-item>
						<uui-label slot="label" for="message" required>Message</uui-label>
						<uui-textarea id="message" label="message" name="message" required></uui-textarea>
					</uui-form-layout-item>
				</form>
			</uui-form>`;
	}

	private _renderPostInvite() {
		if (!this._invitedUser) return nothing;

		return html`<div>
			<h1><b style="color: var(--uui-color-interactive-emphasis)">${this._invitedUser.name}</b> has been invited</h1>
			<p>An invitation has been sent to the new user with details about how to log in to Umbraco.</p>
		</div>`;
	}

	render() {
		return html`<uui-dialog-layout>
			${this._invitedUser ? this._renderPostInvite() : this._renderForm()}
			${this._invitedUser
				? html`
						<uui-button
							@click=${this._closeModal}
							style="margin-right: auto"
							slot="actions"
							label="Close"
							look="secondary"></uui-button>
						<uui-button
							@click=${this._resetForm}
							slot="actions"
							label="Invite another user"
							look="secondary"></uui-button>
						<uui-button @click=${this._goToProfile} slot="actions" label="Go to profile" look="primary"></uui-button>
				  `
				: html`
						<uui-button
							@click=${this._closeModal}
							style="margin-right: auto"
							slot="actions"
							label="Cancel"
							look="secondary"></uui-button>
						<uui-button
							@click="${this._submitForm}"
							slot="actions"
							type="submit"
							label="Send invite"
							look="primary"></uui-button>
				  `}
		</uui-dialog-layout>`;
	}
}

export default UmbEditorViewUsersInviteElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-view-users-invite': UmbEditorViewUsersInviteElement;
	}
}
