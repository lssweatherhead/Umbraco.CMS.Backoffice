import { UMB_MEDIA_TYPE_WORKSPACE_CONTEXT } from './media-type-workspace.context.js';
import { UUIInputElement, UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
@customElement('umb-media-type-workspace-editor')
export class UmbMediaTypeWorkspaceEditorElement extends UmbLitElement {
	@state()
	private _mediaTypeName?: string | null = '';
	#workspaceContext?: typeof UMB_MEDIA_TYPE_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_MEDIA_TYPE_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance;
			this.#observeName();
		});
	}

	#observeName() {
		if (!this.#workspaceContext) return;
		this.observe(this.#workspaceContext.name, (name) => {
			this._mediaTypeName = name;
		});
	}

	// TODO. find a way where we don't have to do this for all Workspaces.
	#handleInput(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this.#workspaceContext?.setName(target.value);
			}
		}
	}

	render() {
		return html`<umb-workspace-editor alias="Umb.Workspace.MediaType">
			<uui-input id="header" slot="header" .value=${this._mediaTypeName} @input="${this.#handleInput}"></uui-input>
		</umb-workspace-editor>`;
	}

	static styles = [
		css`
			#header {
				display: flex;
				padding: 0 var(--uui-size-layout-1);
				gap: var(--uui-size-space-4);
				width: 100%;
			}
			uui-input {
				width: 100%;
			}
		`,
	];
}

export default UmbMediaTypeWorkspaceEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-type-workspace-editor': UmbMediaTypeWorkspaceEditorElement;
	}
}
