import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property } from 'lit/decorators.js';
import type { UmbWorkspacePropertyContext } from 'src/backoffice/shared/components/workspace-property/workspace-property.context';
import { UmbLitElement } from '@umbraco-cms/element';
import { UUITextareaElement } from '@umbraco-ui/uui';

@customElement('umb-property-editor-ui-textarea')
export class UmbPropertyEditorUITextareaElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			uui-textarea {
				width: 100%;
			}
		`,
	];

	@property()
	value = '';

	@property({ type: Array, attribute: false })
	config = [];

	private propertyContext?: UmbWorkspacePropertyContext<string>;

	constructor() {
		super();

		this.consumeContext('umbPropertyContext', (instance: UmbWorkspacePropertyContext<string>) => {
			this.propertyContext = instance;
		});
	}

	private onInput(e: InputEvent) {
		this.value = (e.target as UUITextareaElement).value as string;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`
			<uui-textarea .value=${this.value} @input=${this.onInput}></uui-textarea>`;
	}
}

export default UmbPropertyEditorUITextareaElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-textarea': UmbPropertyEditorUITextareaElement;
	}
}