import Cycle from './Cycle';
import { Mapping } from 'dataplastique-util';

/**
 * Tracking channeling tags for spirits.
 * TODO: Simplify, if indeed we don't support multiple channelings per spirit?
 * @type {Map<Constructor, Array<string>>}
 */
const channelings = new Mapping();

/**
 * Defining custom elements post parse time.
 * @type {Array<function>}
 */
const definitions = [];

/**
 * Tracking registered tags (to prevent accidental overwrites).
 * TODO: Replace this with `customElements.get(tag)` whenever that works...
 * @type {Map<string, Constructor>}
 */
const tagnames = new Map();

/**
 * WebComponent farm. Observe that all spirits associate to a generic
 * component (or Custom Element) without unique implementation details.
 * TODO: Check out https://github.com/WebReflection/document-register-element
 */
export default class Component {
	/**
	 * Register component definition.
	 * @param {constructor} SpiritC
	 * @param {string} tag
	 * @param {string} supertag
	 */
	static register(SpiritC, tag, supertag) {
		if (!tagnames.has(tag)) {
			tagnames.set(tag, SpiritC);
			channelings.add(SpiritC, tag);
			definitions.push(() => {
				customElements.define(tag, newcomponent(SpiritC, supertag), {
					extends: supertag
				});
			});
		} else {
			SpiritC = tagnames.get(tag);
			throw new Error(`The tag "${tag}" is locked to the ${SpiritC.name}.`);
		}
	}

	/**
	 * Define registered components. This must happen after the initial markup
	 * has been parsed to prevent spirits from reading confusing DOM structures.
	 */
	static defineAll() {
		definitions.forEach(def => def());
	}

	/**
	 * Get tag for given spirit channeling. If the spirit is channeled to
	 * multiple tags, return first one found (note that this may be random).
	 * TODO: We don't support multiple channelings no more, do we? Cleanup!
	 * @param {Constructor} SpiritC
	 * @returns {string}
	 */
	static getTag(SpiritC) {
		let tags = channelings.get(SpiritC);
		return tags ? [...tags][0] : null;
	}
}

// Scoped ......................................................................

/**
 * Build custom element (with element inheritance disabled for now).
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=619062
 * @param {constructor} SpiritC
 * @param {string} [supertag]
 * @returns {Element}
 */
function newcomponent(SpiritC, supertag = 'div') {
	let superelm = document.createElement(supertag);
	let TODOOOOO = superelm.constructor; // TODO: extend from this at some point :/
	return SpiritC.api(
		class extends HTMLElement {
			constructor() {
				super();
				Cycle.onconstruct(this, SpiritC);
			}
			connectedCallback() {
				Cycle.onattach(this);
			}
			disconnectedCallback() {
				Cycle.ondetach(this);
			}
			adoptedCallback() {
				Cycle.ondetach(this);
			}
			attributeChangedCallback() {
				Cycle.onatt(this, ...arguments);
			}
			static get observedAttributes() {
				// TODO: filter parenthesis (for no JS property reflection) ???
				return SpiritC.attributes().map(name => name);
			}
		},
		function spirit(elm) {
			return SpiritC.get(elm);
		}
	);
}
