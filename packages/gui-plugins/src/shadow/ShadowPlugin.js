import ScriptPlugin from '../script/ScriptPlugin';
import { Tick, chained } from '@dataplastique/util';
import { reboot } from '@dataplastique/gui';
import { observe } from './SlotObserver';

/**
 * Shadow DOM scripts and queries.
 */
export default class ShadowPlugin extends ScriptPlugin {
	/**
	 * Returns and potentially creates the `shadowRoot`.
	 * @returns {ShadowRoot}
	 */
	root() {
		return (
			this.element.shadowRoot ||
			reboot(this.element.attachShadow({ mode: 'open' }))
		);
	}

	/**
	 * Add callback or handler for fake slot changes.
	 * TODO: support function callbacks!
	 * @param {Function|ISlotHandler} handler - not used just yet!!!
	 * @returns {this}
	 */
	@chained
	onslot(handler = this.spirit) {
		this._observes = true; // TODO: not supposed to be like this!
	}

	/**
	 * Disconnect potential `slotchange` observer.
	 */
	ondestruct() {
		super.ondestruct();
		this._unobserve && this._unobserve();
	}

	/**
	 * TODO: This thing should implement several query methods known from the
	 * {DOMPlugin} and it should in fact use this plugin to implement them!
	 * @param {string} selector
	 * @returns {Element}
	 */
	q(selector) {
		return this.root().querySelector(selector);
	}

	/**
	 * @param {string} selector
	 * @returns {Array<Element>}
	 */
	qall(selector) {
		return Array.from(this.root().querySelectorAll(selector));
	}

	/**
	 * If initial rendering, run the virtual `slotchange` scenario.
	 * This is done async for parity with real `slotchange` events.
	 * TODO: The tick should somehow confirm plugin not destructed!
	 * TODO: Account for slot elm added later + `onslot` called later
	 * @overrides {ScriptPlugin#one}
	 * @returns {this}
	 */
	one(...args) {
		const init = !this.spirit.life.rendered;
		const that = super.one(...args);
		if (init && this.spirit.life.rendered) {
			Tick.next(() => {
				if (this._observes) {
					this._unobserve = observe(this);
				}
			});
		}
		return that;
	}

	// Private ...................................................................

	/**
	 * @type {boolean}
	 */
	_observes = false;

	/**
	 * @type {Function}
	 */
	_unobserve = null;
}

// Backup ......................................................................

/**
 * To avoid the FOUC, perhaps stay hidden until all stylesheets are loaded?
 * This can of course be avoided with inline `style` tags, but CSP policy
 * makes them non-trivial to use (and would also not be cached by agent).
 * @param {ShadowPlugin} plugin
 */
function perhapsdothis(plugin) {
	const done = () => void 0; // we would then unhide the spirit here
	const list = plugin.qall('link[rel=stylesheet]');
	list.length ? Promise.all(list.map(loaded)).then(done) : done();
}

/**
 * Promise to be resolved whenever that stylesheet is loaded.
 * TODO: Perhaps check if it already could be loaded.
 * @param {HTMLLinkElement} link
 * @returns {Promise}
 */
function loaded(link) {
	return new Promise(resolve => {
		link.addEventListener('load', resolve);
	});
}
