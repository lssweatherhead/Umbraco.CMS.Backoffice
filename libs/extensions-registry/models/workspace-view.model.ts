import type { ManifestWithView } from '.';

export interface ManifestWorkspaceView extends ManifestWithView {
	type: 'workspaceView';
	meta: MetaWorkspaceView;
	conditions: ConditionsWorkspaceView;
}

export interface MetaWorkspaceView {
	pathname: string;
	label: string;
	icon: string;
}

export interface ConditionsWorkspaceView {
	workspaces: string[];
}
