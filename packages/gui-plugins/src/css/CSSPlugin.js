import SpiritPlugin from '../SpiritPlugin';
import { Spirit } from '@dataplastique/gui';
import { chained } from '@dataplastique/util';
import { asarray } from '@dataplastique/util';
import { Environment } from '@dataplastique/util';

const COMMA = ',';
const FLOAT = 'float';
const BEFIX = '-beta-';
const AGENT = ['', '-webkit-', '-moz-', '-ms-'];
const DOCEL = Environment.browser ? document.documentElement : null;
const MATCH = Environment.browser ? matchmethod(DOCEL) : null;

/**
 * Until we figure out something better, we'll manually track props that can or
 * must be assigned as simple numbers (without a unit). Props not in this list
 * will be suffixed with `px` when assigned as numbers via `this.css.xxxname`.
 * TODO: Read all the specs and add more properties :/
 * @type {Set<string>}
 */
const numbers = new Set(['fontWeight', 'opacity', 'zIndex']);

/**
 * Working with CSS.
 */
export default class CSSPlugin extends SpiritPlugin {
	/**
	 * Hm. We don't need to "observe" this, we just need the proxy setter...
	 * @returns {boolean}
	 */
	$observable() {
		return true;
	}

	/**
	 * This is the "universal getter" method. Whenever the Proxy cannot
	 * find a looked-up property, and if this method is declared, it
	 * will expose the property value via this methods return value.
	 * @param {string} name
	 * @returns {string|number}
	 */
	uniget(name) {
		if (name in this.element.style) {
			const val = this.get(name);
			const num = parseInt(val, 10);
			return isNaN(num) ? val : num;
		}
	}

	/**
	 * This is the "universal setter" method. When declared, the Proxy
	 * will call this method before (and not after!) it attempts to
	 * set the property. Return `true` to *not* assign the JS property.
	 * TODO: Should most likely return `false` to abort the JS setter :/
	 * @param {string} name
	 * @param {*} value
	 * @returns {truthy} - The property was handled here?
	 */
	uniset(name, value) {
		if (name in this.element.style) {
			this.set(name, value);
			return true;
		}
	}

	/**
	 * Add classname(s).
	 * confirmed('string|array')
	 * @param {string|Array<string>} name
	 * @returns {CSSPlugin}
	 */
	@chained
	add(name) {
		asarray(name, n => CSSPlugin.add(this.element, n));
	}

	/**
	 * Remove classname(s).
	 * confirmed('string|array')
	 * @param {string} name
	 * @returns {CSSPlugin}
	 */
	@chained
	delete(name) {
		asarray(name, n => CSSPlugin.delete(this.element, n));
	}

	/**
	 * Add or remove classname(s) according to truthy first param.
	 * confirmed('*', 'string|array')
	 * @param {truthy|falsy} on
	 * @param {string} name
	 * @returns {CSSPlugin}
	 */
	@chained
	shift(on, name) {
		asarray(name, n => CSSPlugin.shift(this.element, !!on, n));
	}

	/**
	 * Contains classname?
	 * confirmed('string')
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		return CSSPlugin.has(this.element, name);
	}

	/**
	 * Set single element.style.
	 * @param {string} prop
	 * @param {string} val
	 * @returns {CSSPlugin}
	 */
	@chained
	set(prop, val) {
		CSSPlugin.set(this.element, prop, val);
	}

	/**
	 * Set multiple styles via key value map (object).
	 * @param {Object<string,string>} map
	 * @returns {CSSPlugin}
	 */
	@chained
	style(map) {
		CSSPlugin.style(this.element, map);
	}

	/**
	 * Get single element.style (see also `compute` method).
	 * @param {string} prop
	 * @returns {string}
	 */
	get(prop) {
		return CSSPlugin.get(this.element, prop);
	}

	/**
	 * Compute runtime style.
	 * @param {string} prop
	 * @returns {string}
	 */
	compute(prop) {
		return CSSPlugin.compute(this.element, prop);
	}

	/**
	 * Get or set (full) className.
	 * @param {string} [name]
	 * @returns {string|CSSPlugin}
	 */
	@chained
	name(n) {
		if (arguments.length) {
			this.element.className = n;
		} else {
			return this.element.className;
		}
	}

	/**
	 * Spirit element mathes selector?
	 * @TODO: move to DOMPlugin!
	 * @param {string} selector
	 * @returns {boolean}
	 */
	matches(selector) {
		return CSSPlugin.matches(this.element, selector);
	}

	/**
	 * @deprecated
	 */
	remove() {
		throw new Error('Deprecated API is deprecated');
	}

	/**
	 * @deprecated
	 */
	contains() {
		throw new Error('Deprecated API is deprecated');
	}

	// Static ....................................................................

	/**
	 * classList.add()
	 * @param {Element} element
	 * @param {string} names
	 * @returns {constructor}
	 */
	@chained
	static add(element, name = '') {
		asarray(name, n => element.classList.add(n));
	}

	/**
	 * classList.remove()
	 * @param {Element} element
	 * @param {string} name
	 * @returns {constructor}
	 */
	@chained
	static delete(element, name = '') {
		asarray(name, n => element.classList.remove(n));
	}

	/**
	 * Add or remove classname according to second truthy param.
	 * @param {Element} element
	 * @param {truthy|falsy} on
	 * @param {string} name
	 * @returns {constructor}
	 */
	@chained
	static shift(element, on, name) {
		if (!!on) {
			this.add(element, name);
		} else {
			this.delete(element, name);
		}
	}

	/**
	 * classList.contains()
	 * @param {Element} element
	 * @param {string} name
	 * @returns {boolean}
	 */
	static has(element, name) {
		return element.classList.contains(name);
	}

	/**
	 * Set single CSS property. Use style() for multiple properties.
	 * TODO: also automate shorthands such as '10px 20px 10px 20px'
	 * @param {Element}
	 * @param {string} prop
	 * @returns {Function}
	 */
	@chained
	static set(element, prop, value) {
		if (!isNaN(value) && !numbers.has(prop)) {
			value += 'px';
		}
		value = String(value);
		if (prop === FLOAT) {
			prop = 'cssFloat';
		} else {
			value = jsvalue(value);
			prop = jsproperty(prop);
		}
		element.style[prop] = value;
	}

	/**
	 * TODO: Get element.style property; if this has been set.
	 * Not to be confused with compute() for computedStyle!!!
	 * @param {Element} element
	 * @param {string} prop
	 * @returns {string}
	 */
	static get(element, prop) {
		prop = jsproperty(prop);
		return jsvalue(element.style[prop]);
	}

	/**
	 * Set multiple element.style properties via hashmap. Note that
	 * this method returns the element (ie. it is not chainable).
	 * @param {Element|Spirit} thing Spirit or element.
	 * @param {Object<string,string>} styles
	 * @returns {Element|Spirit}
	 */
	static style(thing, styles) {
		const elm = Spirit.is(thing) ? thing.element : thing;
		Object.entries(styles).forEach(entry => {
			this.set(elm, entry[0], entry[1]);
		});
		return thing;
	}

	/**
	 * Compute runtime style.
	 * @param {Element|Spirit} thing
	 * @param {string} prop
	 * @returns {string}
	 */
	static compute(thing, prop) {
		const elm = Spirit.is(thing) ? thing.element : thing;
		prop = standardcase(jsproperty(prop));
		return getComputedStyle(elm, null).getPropertyValue(prop);
	}

	/**
	 * Node matches CSS selector?
	 * TODO: Something about try-catch not being JIT compatible?
	 * @param {Node} node
	 * @param {string} selector
	 * @returns {boolean}
	 */
	static matches(node, selector) {
		return node[MATCH](selector);
	}
}

// Scoped ......................................................................

/**
 * CamelCase string.
 * @param {string} string
 * @returns {string}
 */
function camelcase(string) {
	return string.replace(/-([a-z])/gi, function(all, letter) {
		return letter.toUpperCase();
	});
}

/**
 * This will standard-css-notate CamelCased string.
 * @param {string} string
 * @returns {string}
 */
function standardcase(string) {
	return string.replace(/[A-Z]/g, function(all, letter) {
		return '-' + string.charAt(letter).toLowerCase();
	});
}

/**
 * Normalize declaration property for use in element.style scenario.
 * TODO: Should be possible to skip this vendor prefixing nowadays?
 * @param {string} prop
 * @returns {string}
 */
function jsproperty(prop) {
	let test;
	let fixt = prop;
	if ((prop = String(prop)).startsWith(BEFIX)) {
		AGENT.every(vendor => {
			test = camelcase(prop.replace(BEFIX, vendor));
			if (DOCEL.style[test] !== undefined) {
				fixt = test;
				return false;
			}
			return true;
		});
	} else {
		fixt = camelcase(fixt);
	}
	return fixt;
}

/**
 * Normalize declaration value for use in element.style scenario.
 * TODO: clean this up some day.
 * @param {string} value
 * @returns {string}
 */
function jsvalue(value) {
	let test;
	if ((value = String(value)) && value.includes(BEFIX)) {
		let parts = [];
		value.split(COMMA).forEach(part => {
			if ((part = part.trim()).startsWith(BEFIX)) {
				AGENT.every(vendor => {
					test = camelcase(part.replace(BEFIX, vendor));
					if (DOCEL.style[test] !== undefined) {
						parts.push(part.replace(BEFIX, vendor));
						return false;
					}
					return true;
				});
			} else {
				parts.push(part);
			}
		});
		value = parts.join(COMMA);
	}
	return value;
}

/**
 * Determine the vendor-prefixed `matchesSelector` method.
 * @param {HTMLHtmlElement} root
 * @returns {string}
 */
function matchmethod(root) {
	return [
		'matchesSelector',
		'msMatchesSelector',
		'mozMatchesSelector',
		'webkitMatchesSelector'
	].reduce((result, method) => {
		return result || (root[method] ? method : null);
	}, null);
}

// Backup ......................................................................

/**
 * Normalize declaration property for use in CSS text.
 * @param {string} prop
 * @returns {string}
 *
function cssproperty(prop) {
	return standardcase(jsproperty(prop));
}

/**
 * Normalize declaration value for use in CSS text.
 * @param {string} prop
 * @returns {string}
 *
function cssvalue(value) {
	return standardcase(jsvalue(value));
}
*/
