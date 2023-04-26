import type { ManifestElement } from '.';

export interface ManifestTreeItem extends ManifestElement {
	type: 'treeItem';
	conditions: ConditionsTreeItem;
}

export interface ConditionsTreeItem {
	entityType: string;
}
