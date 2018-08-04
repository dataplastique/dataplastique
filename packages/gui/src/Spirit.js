import * as Guide from './Guide';
import * as Store from './Store';
import { Model } from '@dataplastique/edb';
import { isElement, isString, typeOf } from '@dataplastique/util';

/**
 * That's the spirit.
 * TODO: `uniget` and `uniset` should also be documented in here somehow,
 * these static methods are currently only documented in the {CSSPlugin}.
 * @extends {Model}
 */
export default class Spirit extends Model {
	/**
	 * Identification.
	 * @type {boolean}
	 */
	get isSpirit() {
		return true;
	}

	/**
	 * Identification.
	 * @type {String}
	 */
	get [Symbol.toStringTag]() {
		return 'Spirit';
	}

	/**
	 * Identification.
	 * @returns {string}
	 */
	toString() {
		return `[spirit ${this.constructor.name}]`;
	}

	// Lifecycle .................................................................

	/**
	 * Note that the element may not be positioned in the DOM at this point.
	 */
	onconstruct() {}

	/**
	 * `onenter` gets called when the spirit element is first
	 * encounted in the page DOM. This is only called once in
	 * the lifecycle of a spirit (unlike `attach`, see below).
	 */
	onenter() {}

	/**
	 * `onattach` gets called whenever
	 *
	 * 1. The spirit element is already in DOM when the page loads
	 * 2. The spirit element is later on attached to the main DOM
	 */
	onattach() {}

	/**
	 * `onready` gets called (only once) when all descendant spirits
	 * are attached and ready. From a DOM tree perspective, this fires
	 * in reverse order, innermost first.
	 */
	onready() {}

	/**
	 * `ondetach` gets callend whenever the spirit element is about to
	 * be detached from the DOM tree. Unless the element is appended
	 * somewhere else, this will schedule the spirit for destruction.
	 */
	ondetach() {}

	/**
	 * Note that the element may not be positioned in the DOM at this point.
	 */
	ondestruct() {}

	// Runtime ...................................................................

	/**
	 * @deprecated (?)
	 * Handle crawler.
	 * @param {Crawler} crawler
	 * @returns {number}
	 */
	oncrawler(crawler) {
		return 0;
	}

	// Static ....................................................................

	/**
	 * Get spirit for argument.
	 * @param {Element} arg
	 * @param {Function} [cb]
	 * @returns {Spirit}
	 */
	static get(arg, cb) {
		if (isElement(arg)) {
			return Store.get(arg, cb);
		} else {
			throw new TypeError(`Expected Element, got ${typeOf(arg)}`);
		}
	}

	/**
	 * Something has a spirit?
	 * @param {Element|string} arg
	 * @returns {boolean}
	 */
	static has(arg) {
		return !!Spirit.get(arg);
	}

	/**
	 * Official factory method for spirit creation. The spirit subclasses may
	 * overwrite this to support various arguments and configuration options.
	 * @returns {Spirit}
	 */
	static summon() {
		return this.spawn();
	}

	/**
	 * Create a spirit based on the channeling for this class (constructor).
	 * Spawns the appropriate element and return the spirit. If an element is
	 * provided, the channeling will be confirmed to exist. If a string is
	 * provided, an element of that tagname will be created and validated.
	 * TODO: Actually support that last part.
	 * @param {string|Element} [arg]
	 * @returns {Spirit}return spawnInferred(this);
	 */
	static spawn(arg) {
		return arguments.length ? console.error('TODO') : spawnInferred(this);
	}

	/**
	 * Experimental!
	 * @param {Class<HTMLElement>} Elm
	 * @param {Spirit} spirit
	 * @returns {Class<HTMLElement>}
	 */
	static api(Elm, spirit) {
		return class extends Elm {};
	}

	/**
	 * Spirit type interface. Equivalent to `static model` on {Model} classes.
	 * TODO: Implement type system support at least for `Element` so this can work!
	 * @param {IMap} map
	 * @returns {Imap|null}
	 */
	static spirit(map) {
		return null;
	}

	/**
	 * Identification for ducks.
	 * TODO: Rename this somehow
	 * @type {boolean}
	 */
	static get isSpiritConstructor() {
		return true;
	}

	// Privileged ................................................................

	/**
	 * Framework internal.
	 * @param {IMap} map
	 * @returns {IMap|null}
	 */
	static [Symbol.for('@dataplastique/objectpipe')](map) {
		return this.spirit(...arguments);
	}
}

// Scoped ......................................................................

/**
 * Create a spirit based on the channeling for given constructor.
 * @param {Class<Spirit>} SpiritC
 * @returns {Spirit}
 */
function spawnInferred(SpiritC) {
	return Guide.spawn(SpiritC);
}
