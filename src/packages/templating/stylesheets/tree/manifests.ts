import { STYLESHEET_ENTITY_TYPE, STYLESHEET_REPOSITORY_ALIAS } from '../config.js';
import type { ManifestTree, ManifestTreeItem } from '@umbraco-cms/backoffice/extension-registry';

export const STYLESHEET_TREE_ALIAS = 'Umb.Tree.Stylesheet';

const tree: ManifestTree = {
	type: 'tree',
	alias: STYLESHEET_TREE_ALIAS,
	name: 'Stylesheet Tree',
	weight: 10,
	meta: {
		repositoryAlias: STYLESHEET_REPOSITORY_ALIAS,
	},
};

const treeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'fileSystem',
	alias: 'Umb.TreeItem.Stylesheet',
	name: 'Stylesheet Tree Item',
	meta: {
		entityTypes: ['stylesheet-root', STYLESHEET_ENTITY_TYPE],
	},
};

export const manifests = [tree, treeItem];
