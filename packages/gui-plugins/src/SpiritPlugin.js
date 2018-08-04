import { Plugin as BasePlugin } from '@dataplastique/edb';
import { plugin as baseplugin } from '@dataplastique/edb';
import { Spirit } from '@dataplastique/gui';

/**
 *
 */
export default class SpiritPlugin extends BasePlugin {
	/**
	 * Identification.
	 * @type {String}
	 */
	get [Symbol.toStringTag]() {
		return `[plugin ${this.constructor.name}]`;
	}

	/**
	 * @type {Spirit}
	 */
	get spirit() {
		return this.host;
	}

	/**
	 * @type {Element}
	 */
	get element() {
		return this.host.element;
	}

	/**
	 * Plugin will accept any Spirit host (at least by default).
	 * TODO: Allow multiple?
	 * @returns {Spirit}
	 */
	static host() {
		return Spirit;
	}
}

/**
 * @returns {Function}
 */
export function plugin() {
	return baseplugin(...arguments);
}
