import TrackerPlugin from '../TrackerPlugin';
import Broadcast from './Broadcast';
import { chained, asarray } from '@dataplastique/util';

/**
 * Tracking and dispatching broadcasts.
 */
export default class BroadcastPlugin extends TrackerPlugin {
	/**
	 * Add one or more broadcast handlers.
	 * @param {string|Array<string>} type
	 * @param {BroadcastHandler} [handler]
	 * @returns {BroadcastPlugin}
	 */
	@chained
	on(type, handler = this.spirit) {
		asarray(type, t => {
			if (this._addchecks(t, [handler, this._global])) {
				if (this._global) {
					Broadcast.addGlobal(t, handler);
				} else {
					Broadcast.add(t, handler);
				}
			}
		});
	}

	/**
	 * Remove one or more broadcast handlers.
	 * @param {string|Array<string>} type
	 * @param {BroadcastHandler} [handler]
	 * @returns {BroadcastPlugin}
	 */
	@chained
	off(type, handler = this.spirit) {
		asarray(type, t => {
			if (this._addchecks(t, [handler, this._global])) {
				if (this._global) {
					Broadcast.addGlobal(t, handler);
				} else {
					Broadcast.add(t, handler);
				}
			}
		});
	}

	/**
	 * Dispatch type(s).
	 * @param {string|Array<string>} type
	 * @param {Object} [data]
	 * @returns {BroadcastPlugin}
	 */
	@chained
	dispatch(type, data) {
		let global = this._global;
		this._global = false;
		asarray(type, t => {
			if (global) {
				Broadcast.dispatchGlobal(t, data);
			} else {
				Broadcast.dispatch(t, data);
			}
		});
	}

	/**
	 * Add one or more global broadcast handlers.
	 * @param {string|Array<string>} type
	 * @param {BroadcastHandler} [handler]
	 * @returns {BroadcastPlugin}
	 */
	@chained
	onGlobal(type, handler) {
		this._globalize(() => this.on(type, handler));
	}

	/**
	 * Rempve one or more broadcast handlers.
	 * @param {string|Array<string>} type
	 * @param {BroadcastHandler} [handler]
	 * @returns {BroadcastPlugin}
	 */
	@chained
	offGlobal(type, handler) {
		this._globalize(() => this.off(type, handler));
	} // TODO: confirm truthy instead!

	/**
	 * Shift one or more global broadcast handlers based on truthy first param.
	 * @param {string|Array<string>} type
	 * @param {BroadcastHandler} [handler]
	 * @returns {BroadcastPlugin}
	 */
	@chained
	shiftGlobal(on, type, handler) {
		this._globalize(() => this.shift(on, type, handler));
	}

	/**
	 * Dispatch on or more broadcasts globally.
	 * @param {string|Array<string>} type
	 * @param {Object} [data]
	 * @returns {gui.Broadcast}
	 */
	@chained
	dispatchGlobal(type, data) {
		this._globalize(() => this.dispatch(type, data));
	}

	// Private ...................................................................

	/**
	 * Remove broadcast handlers when the plugin destructs.
	 * @param {string} type
	 * @param {Array<object>} checks
	 */
	_cleanupchecks(type, checks) {
		let handler = checks[0];
		let isglobal = checks[1];
		if (isglobal) {
			Broadcast.removeGlobal(type, handler);
		} else {
			Broadcast.remove(type, handler);
		}
	}
}
