import { Spirit } from './Spirit';

export { Spirit, channeling } from './Spirit';
export { boot, attribute } from '@dataplastique/gui';
export { SpiritPlugin, plugin } from '@dataplastique/gui-plugins';
export { Model, Collection, Plugin, Tree } from '@dataplastique/edb';
export { output } from '@dataplastique/edbml-runtime';
export { Key, chained } from '@dataplastique/util'; // TODO: Should?
export { Environment } from '@dataplastique/util'; // TODO: Don't!

/**
 * Get spirit for element.
 * TODO: Get spirit for CSS selector implicitly scoped from the document root.
 * @param {Element|string} arg
 * @param {Function} [cb]
 * @returns {Spirit}
 */
export function get(arg, cb) {
	return Spirit.get(arg, cb);
}
