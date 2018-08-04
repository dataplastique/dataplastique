import TrackerPlugin from '../TrackerPlugin';
import { Tick } from '@dataplastique/util';
import { chained } from '@dataplastique/util';
import { asarray } from '@dataplastique/util';

/**
 * Task scheduling and time micro management.
 */
export default class TickPlugin extends TrackerPlugin {
	/**
	 * Add one or more tick handlers.
	 * @param {string|Array<string>} arg
	 * @param {Object} [handler]
	 * @returns {this}
	 */
	@chained
	on(type, handler = this.spirit) {
		asarray(type, t => {
			if (this._addchecks(t, [handler])) {
				Tick.add(t, handler);
			}
		});
	}

	/**
	 * Add one or more tick handlers.
	 * @param {string|Array<string>} arg
	 * @param {Object} [handler]
	 * @returns {this}
	 */
	@chained
	off(type, handler = this.spirit) {
		asarray(type, t => {
			if (this._removechecks(t, [handler])) {
				Tick.remove(t, handler);
			}
		});
	}

	/**
	 * Add one or more self-removing tick handlers.
	 * TODO: Think about this for a while.
	 * @param {string|Array<string>} arg
	 * @param {Object} [handler]
	 * @returns {this}
	 */
	@chained
	one(type, handler = this.spirit) {
		asarray(type, t => {
			this._removechecks(t, [handler]);
			Tick.remove(t, handler).one(t, handler);
		});
	}

	/**
	 * Execute action in next available tick. We don't return anything
	 * because we'd like at one point to make the tick cancellable
	 * and that actually is supported here in the browser (not in Node).
	 * UPDATE: This is actually supported now in Node via `setImmediate`
	 * @param {Function} action
	 */
	next(action) {
		Tick.next(action);
	}

	/**
	 * Execute action in next animation frame.
	 * @param {Function} action
	 * @returns {number}
	 */
	nextFrame(action) {
		return Tick.nextFrame(action);
	}

	/**
	 * Cancel scheduled animation frame.
	 * @param {number} n
	 * @returns {this}
	 */
	@chained
	cancelFrame(n) {
		Tick.cancelFrame(n);
	}

	/**
	 * Schedule timeout.
	 * @param {Function} action
	 * @param {number} time in milliseconds
	 * @returns {number}
	 */
	time(action, time) {
		return Tick.time(action, time);
	}

	/**
	 * Cancel scheduled timeout.
	 * @param {number} n
	 */
	@chained
	cancelTime(n) {
		Tick.cancelTime(n);
	}

	/**
	 * Start tick of type (if not already started).
	 * @param {string} type
	 */
	@chained
	start(type) {
		Tick.start(type);
	}

	/**
	 * Stop tick of type. This will stop the tick for all
	 * listeners, so perhaps you're looking for `remove`?
	 * @param {string} type
	 */
	@chained
	stop(type) {
		Tick.stop(type);
	}

	/**
	 * Dispatch tick after given time.
	 * @param {string} type
	 * @param {number} time Milliseconds (omit for nextTick)
	 * @returns {this}
	 */
	@chained
	dispatch(type, time) {
		Tick.dispatch(type, time);
	}

	// Private ...................................................................

	/**
	 * Abort ticks when plugin disposes.
	 * @param {string} type
	 * @param {Array<object>} checks
	 */
	_cleanupchecks(type, checks) {
		Tick.remove(type, checks[0]);
	}
}

/**
 * TODO: This will not work now because arrow functions hide the `thisp` :/
 * Let's not attempt to invoke any method that applies the `this` keyword
 * to spirits (or plugins or models) that have been marked as disposed.
 * @param {Object} thisp
 * @returns {boolean}
 */
function safeapply(thisp) {
	if ('disposed' in thisp) {
		return !thisp.disposed;
	} else {
		return true;
	}
}
