import RootSpirit from './spirits/docs-root/RootSpirit';
import TreeSpirit from './spirits/docs-tree/TreeSpirit';
import CodeSpirit from './spirits/docs-code/CodeSpirit';
import { channeling, boot as bootstrap } from 'dataplastique';

/**
 * Boot everything.
 */
export function boot() {
	channeling([
		['docs-root', RootSpirit],
		['docs-tree', TreeSpirit],
		['docs-code', CodeSpirit]
	]);
	bootstrap(...arguments);
}
