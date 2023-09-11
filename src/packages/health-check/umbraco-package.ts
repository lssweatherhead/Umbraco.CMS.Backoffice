export const name = 'Umbraco.Core.HealthCheck';
export const extensions = [
	{
		name: 'Health Check Bundle',
		alias: 'Umb.Bundle.HealthCheck',
		type: 'bundle',
		loader: () => import('./manifests.js'),
	},
];
