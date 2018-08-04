import SpiritPlugin from '../SpiritPlugin';
import { cast, chained } from '@dataplastique/util';

/**
 * TODO: How to bypass potential type system when assigning this to spirit?
 */
const symbol = Symbol.for('@dataplastique/attributes');

/**
 * Managing the spirits (element) attributes.
 */
export default class AttPlugin extends SpiritPlugin {
	/**
	 * Set attribute value (always as a string).
	 * TODO: Support a hashmap (object) to set multiple attributes.
	 * @param {string} name
	 * @param {*} value - Use `null` to delete the attribute
	 * @returns {this}
	 */
	@chained
	set(name, value) {
		value === null
			? this.delete(name)
			: this.element.setAttribute(name, String(value));
	}

	/**
	 * Get attribute value as an inferred primitive type.
	 * TODO: support an array of names to return a hashmap (object).
	 * TODO: support *no* argument to return all the attributes (object).
	 * @param {string} name
	 * @returns {string|number|boolean|null}
	 */
	get(name) {
		return cast(this.element.getAttribute(name));
	}

	/**
	 * Has attribute(s) name declared?
	 * TODO: Support a list of names to check for multiple attributes.
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		return this.element.hasAttribute(name);
	}

	/**
	 * Delete attribute.
	 * @param {string} name
	 * @returns {this}
	 */
	@chained
	delete(name) {
		this.element.removeAttribute(name);
	}

	/**
	 * Delete attribute (via short method name).
	 * @alias {delete}
	 * @param {string} name
	 * @returns {this}
	 */
	@chained
	del(name) {
		this.delete(name);
	}

	/**
	 * Set or remove attribute depending on the first argument.
	 * @param {truthy} truthy
	 * @param {string} name
	 * @param {*} [value]
	 */
	shift(truthy, name, value = name) {
		!!truthy ? this.set(name, value) : this.delete(name);
	}
}
