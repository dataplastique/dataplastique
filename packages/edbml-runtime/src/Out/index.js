import { mapguids } from '@dataplastique/util';
import { runnable } from './runnable';
import { htmlattribute } from './attributes';
import { normalize, canonize } from './normalize';
import { mapdefer } from './deferred';

/**
 * Tracking properties to generate HTML attributes.
 * @type {Map<string, *>}
 */
const props = new Map();

/**
 * Keeping dependency injections private.
 * @type {Symbol}
 */
const state = Symbol('state');

/**
 *
 */
export default class Out {
	/**
	 * Tracking things that might be injected via constructor or methods calls.
	 * @type {Object}
	 */
	[state] = null;

	/**
	 * @param {string} [markup]
	 * @param {Array} [unsafe]
	 * @param {Array} [others]
	 * @param {Map<string, Function>} [defers]
	 */
	constructor(markup = '', unsafe = [], others = [], defers = []) {
		this[state] = { markup, unsafe, others, defers };
		props.clear();
	}

	/**
	 * @param {string} guid
	 * @returns {string}
	 */
	toString(guid) {
		return resolve(this, guid).innerHTML;
	}

	/**
	 * TODO: Apply event listeners and such!
	 * @param {string} guid
	 * @returns {DocumentFragment}
	 */
	toFragment(guid) {
		return resolve(this, guid).content;
	}

	/**
	 * Returns a list of aspects that can used to compare two instances of {Out}
	 * in order to support incremental DOM updates (the "virtual DOM" use case).
	 * @param {string} guid
	 * @returns {Array}
	 */
	toAspects(guid) {
		const cloned = resolve(this, guid, true);
		const defers = this[state].defers;
		return aspects(cloned, guid, defers);
	}

	/**
	 * @returns {Map<string, Function>}
	 */
	deferred() {
		return this[state].defers;
	}

	/**
	 * @deprecated
	 * That {Out} is structurally identical (given unresolved values)?
	 * In that case, it it safe to call method `update` with that {Out}.
	 * TODO: Whenever this returns `true`, we can attempt to candidate
	 * the local `_ownmap` as reusable by all other instances of {Out}.
	 * This might however require an extra argument? Remember to mark
	 * this as a failure in case the template changes DOM structure.
	 * @param {Out} out
	 * @returns {boolean}
	 */
	similar(out) {
		return out[state].markup === this[state].markup;
	}

	/**
	 * @deprecated
	 * That {Out} would produce that exact same output as this {Out}?
	 * This implies that both structure and state are identical
	 * except for all the deferred callbacks which are always unique.
	 * @param {Out} out
	 * @returns {boolean}
	 */
	identical(out) {
		const mine = this[state];
		const other = out[state];
		return (
			this.similar(out) &&
			equals(mine.unsafe, other.unsafe) &&
			equals(mine.others, other.others)
		);
	}

	/**
	 * Assimilate state from another {Out}, making them identical.
	 * @param {Out} out
	 * @returns {this}
	 */
	update(out) {
		if (this.similar(out)) {
			Object.assign(this[state], out[state]);
		} else {
			throw new Error('Output must be structurally similar.');
		}
		return this;
	}

	// Private ...................................................................

	/**
	 * Temporarily store the template resolver here to avoid creating new ones.
	 * TODO: Global pool of runnables that can be shared between instances of `Out`.
	 * @type {Function}
	 */
	_run = null;

	// Proxy traps ...............................................................

	/**
	 * The getter trap will expose all assigned properties in the form of
	 * HTML attribute declarations. For example, when you set the property
	 * `proxy.title = 'john' you will see the string `title="john"` whenever
	 * you attempt to `alert(proxy.title)`. This allows for a syntax that will
	 * make it easy to maintain the generated script by hand in case the devs
	 * decide to abandon EDBML at some point, note however that this implies
	 * that it's not safe in EDBML to concatenate properties via the syntax
	 * `@class += ' newclass' (since this operation will read the property).
	 * @param {Function} out
	 * @param {String} name
	 * @returns {string}
	 */
	static get(out, name) {
		switch (name) {
			case 'guargh':
			case 'blargh':
			case 'arrghs':
				return out[name];
				break;
			default:
				return out.blargh(htmlattribute(out, name, props.get(name)));
				break;
		}
	}

	/**
	 * Setter trap.
	 * @param {Function} out
	 * @param {String} name
	 * @param {*} value
	 * @returns {boolean}
	 */
	static set(out, name, value) {
		props.set(name, value);
		return true;
	}

	/**
	 * Apply trap.
	 * @param {Function} out
	 * @param {Object} that
	 * @param {Array<*>} args
	 * @returns {*}
	 */
	static apply(out, that, args) {
		return out.apply(that, args);
	}
}

// Scoped ......................................................................

/**
 * Creates a normalized and potentially canonical template with resolved values.
 * @param {Out} out
 * @param {String} guid
 * @param {boolean} [canon]
 * @returns {HTMLTemplateElement}
 */
function resolve(out, guid, canon = false) {
	const clone = collapse(out, out[state]);
	return canon ? canonize(clone, guid) : normalize(clone, guid);
}

/**
 * Clone template and resolve with current state.
 * @param {Out} out
 * @param {Object} state
 * @returns {HTMLTemplateElement}
 */
function collapse(out, state) {
	return (out._run || (out._run = runnable(state)))(state);
}

/**
 * TODO: We'll need less aspects (and only keys in some maps) when diffing old!
 * @param {HTMLTemplateElement} canonical
 * @param {string} guid
 * @param {Map<string, function>} defers
 * @returns {Array}
 */
function aspects(canonical, guid, defers) {
	const fragment = canonical.content;
	const rootelem = fragment.firstElementChild;
	const elements = mapguids(rootelem, guid);
	const deferred = mapdefer(elements, defers);
	return [fragment, elements, ...deferred];
}

// TODO: Deprecate this? .......................................................

/**
 * Array members are identical?
 * @param {Array} a1
 * @param {Array} a2
 * @returns {boolean}
 */
function equals(a1, a2) {
	const same = (value, idx) => a2[idx] === value;
	return a1.length === a2.length && a1.every(same);
}
