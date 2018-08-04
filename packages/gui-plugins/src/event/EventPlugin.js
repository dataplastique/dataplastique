import TrackerPlugin from '../TrackerPlugin';
import { Spirit } from '@dataplastique/gui';
import { asarray, isWindow, chained } from '@dataplastique/util';

/**
 * Tracking and dispatching DOM events.
 */
export default class EventPlugin extends TrackerPlugin {
	/**
	 * Add one or more event handlers.
	 * TODO: Support config via object
	 * @param {string|Array<string>} type
	 * @param {Element|Spirit} [target]
	 * @param {EventHandler} [handler]
	 * @param {boolean|Object} [capture]
	 * @returns {this}
	 */
	@chained
	on(type, target = this.element, handler = this.spirit, capture = false) {
		let checks = [(target = qualify(target)), handler, capture];
		asarray(type, t => {
			if (this._addchecks(t, checks)) {
				this._shiftEventListener(true, target, t, handler, capture);
			}
		});
	}

	/**
	 * Remove one or more event handlers.
	 * TODO: Support config via object
	 * @param {string|Array<string>} arg
	 * @param {Element|Spirit} [target]
	 * @param {EventHandler} [handler]
	 * @param {boolean} [capture]
	 * @returns {this}
	 */
	@chained
	off(type, target = this.element, handler = this.spirit, capture = false) {
		let checks = [(target = qualify(target)), handler, capture];
		asarray(type, t => {
			if (this._removechecks(t, checks)) {
				this._shiftEventListener(false, target, t, handler, capture);
			}
		});
	}

	// Private .................................................................

	/**
	 * Actual event registration has been isolated so that
	 * one may overwrite or overload this particular part.
	 * @param {boolean} add
	 * @param {Node} target
	 * @param {string} type
	 * @param {Object} handler
	 * @param {boolean} capture
	 */
	_shiftEventListener(add, target, type, handler, capture) {
		const args = [type, handler, capture];
		add
			? target.addEventListener(...args)
			: target.removeEventListener(...args);
	}

	/**
	 * Remove event listeners.
	 * @see {TrackerPlugin}
	 * @param {string} type
	 * @param {Array<object>} checks
	 */
	_cleanupchecks(type, checks) {
		this.off(type, ...checks);
	}
}

// Scoped ......................................................................

/**
 * Qualify target.
 * TODO: XMLHttpRequest can for example also be a target.
 * @param {Spirit|Node|Window} target
 * @returns {Node|Window}
 * @throws {TypeError}
 */
function qualify(target) {
	if (Spirit.is(target)) {
		target = target.element;
	}
	if (target && (target.nodeType || isWindow(target))) {
		return target;
	} else {
		throw new TypeError('Unqualified event target', target);
	}
}
