import Proto from './Proto';
import { approximate } from './proxy/ProxyFactory';

/**
 *
 */
export default class Collection extends Proto(class extends Array {}) {
	/**
	 * @param {...*} args
	 * @returns {Proxy}
	 */
	constructor(...args) {
		return approximate(super(), Object.create(null), args);
	}

	/**
	 * Identification.
	 * @type {string}
	 */
	get [Symbol.toStringTag]() {
		return 'Collection';
	}

	/**
	 * More identification.
	 * @returns {string}
	 */
	toString() {
		return `[collection ${this.constructor.name}]`;
	}

	// Static ....................................................................

	/**
	 * Create anonymous collection of given type.
	 * TODO: Via symbol so that `import { Collection, of } from 'dataplastique'`
	 * @param {Proto|Function|null} cons
	 * @returns {Class<Collection>}
	 */
	static $of(cons) {
		return class extends this {
			static collection() {
				return cons;
			}
		};
	}

	/**
	 * Model type interface.
	 * @param {IMap} map
	 * @returns {Imap|null}
	 */
	static model(map) {
		return null;
	}

	/**
	 * Collection type interface.
	 * @returns {Proto|Function|null}
	 */
	static collection() {
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
	 * Framework internal.
	 * @returns {Proto|Function|null}
	 */
	static [Symbol.for('@dataplastique/arraypipe')]() {
		return this.collection();
	}

	/**
	 * Should `map` and `reduce` to simple array (and not Collection).
	 * @type {Array}
	 */
	static get [Symbol.species]() {
		return Array;
	}

	/**
	 * Identification for ducks: Identify as Model.
	 * @type {boolean}
	 */
	static get isModelConstructor() {
		return true;
	}

	/**
	 * Identification for ducks: Identify as Collection.
	 * @type {boolean}
	 */
	static get isCollectionConstructor() {
		return true;
	}
}
