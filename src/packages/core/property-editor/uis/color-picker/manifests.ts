import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.ColorPicker',
	name: 'Color Picker Property Editor UI',
	loader: () => import('./property-editor-ui-color-picker.element.js'),
	meta: {
		label: 'Color Picker',
		propertyEditorSchemaAlias: 'Umbraco.ColorPicker',
		icon: 'umb:colorpicker',
		group: 'pickers',
	},
};
