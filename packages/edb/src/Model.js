import Proto from './Proto';
import { install } from './devtools/';
import { approximate } from './proxy/ProxyFactory';

/**
 *
 */
export default class Model extends Proto() {
	/**
	 * @param {Object} [object]
	 * @returns {Proxy}
	 */
	constructor(object = Object.create(null)) {
		return approximate(super(), object);
	}

	/**
	 * Identification.
	 * @type {String}
	 */
	get [Symbol.toStringTag]() {
		return 'Model';
	}

	/**
	 * More identification.
	 * @returns {string}
	 */
	toString() {
		return `[model ${this.constructor.name}]`;
	}

	// Static ....................................................................

	/**
	 * Model type interface.
	 * TODO: Perhaps look at [Vue](https://vuejs.org/v2/guide/components.html#Prop-Validation)
	 * to finalize the syntax for required status and default value.
	 * @param {IMap} map
	 * @returns {Imap|null}
	 */
	static model(map) {
		return null;
	}

	/**
	 * Framework internal.
	 * @param {IMap} map
	 * @returns {IMap|null}
	 */
	static [Symbol.for('@dataplastique/objectpipe')](map) {
		return this.model(...arguments);
	}

	/**
	 * Identification for ducks.
	 * @type {boolean}
	 */
	static get isModelConstructor() {
		return true;
	}

	/**
	 * TODO: Is this used???
	 * @param {*} thing
	 * @returns {*}
	 */
	static cast(thing) {
		return thing;
	}
}
