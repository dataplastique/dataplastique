import Mapping from './data/Mapping';
import Environment from './Environment';
import { isString } from './Type';
import { chained } from './decorators';
import { asarray } from './func/arrayutils';

/**
 * Handler implements `onclick`.
 * @typedef {Object} TickHandler
 * @property {Function} ontick
 */

/**
 * Create each type only once.
 * @type {Map<string, Tick>}
 */
const pool = new Map();

/**
 * Mapping `setInterval` coroutines.
 * @type {Map<string, number>}
 */
const intervals = new Map();

/**
 * Tracking ticks types ready to fire.
 * @type {Set<string>}
 */
const scheduled = new Set();

/**
 * Mapping tick types to handlers for tick.
 * @type {Mapping} <string, Set<TickHandler>>
 */
const allhandlers = new Mapping();

/**
 * Mapping handlers that should auto-unregister upon tick.
 * @type {Mapping} <string, Set<TickHandler>>
 */
const onehandlers = new Mapping();

/**
 * Create function to execute something
 * async with low latency (in browsers).
 * TODO: Make this cancellable!
 * @type {Function}
 */
const fixImmediate = (() => {
	let index = -1;
	if (Environment.browser) {
		let runs = false;
		const list = [];
		const node = document.createElement('div');
		new MutationObserver(() => {
			runs = false;
			while (list.length) {
				list.shift()();
			}
		}).observe(node, {
			attributes: true
		});
		return action => {
			const id = ++index;
			list.push(action);
			if (!runs) {
				node.classList.toggle('trigger');
			}
			return id;
		};
	}
})();

/**
 * Scheduling and timing of things.
 */
export default class Tick {
	/**
	 * Tick identifier.
	 * @type {string}
	 */
	type;
	/**
	 * @param {string} type
	 */
	constructor(type) {
		if (isString(type)) {
			this.type = type;
			Object.seal(this);
		} else {
			throw new TypeError('Tick needs a type');
		}
	}

	// Static ....................................................................

	/**
	 * Add handler for tick.
	 * @param {string|Array<string>} type - String or array of strings
	 * @param {TickHandler} handler
	 * @returns {this}
	 */
	@chained
	static add(type, handler) {
		addhandler(type, handler);
	}

	/**
	 * Remove handler for tick.
	 * @param {string|Array<string>} type - String or array of strings
	 * @param {TickHandler} handler
	 * @returns {Constructor}
	 */
	@chained
	static remove(type, handler) {
		delhandler(type, handler);
	}

	/**
	 * Add auto-removing handler for tick.
	 * @param {Object} type String or array of strings
	 * @param {Object} handler
	 * @returns {Constructor}
	 */
	@chained
	static one(type, handler) {
		addhandler(type, handler, true);
	}

	/**
	 * @param {Function} action
	 * @returns {number}
	 */
	@chained
	static next(action) {
		return nexttick(action);
	}

	/**
	 * TODO!
	 * @param {number} n
	 */
	static cancelNext(n) {
		console.error('TODO!');
		//cancelnext(n);
	}

	/**
	 * Schedule action for next animation frame.
	 * @param {Function} action Called back with a timestamp
	 * returns {number}
	 */
	@chained
	static nextFrame(action) {
		return requestAnimationFrame(action);
	}

	/**
	 * Cancel animation frame by index.
	 * @param {number} n
	 */
	@chained
	static cancelFrame(n) {
		cancelAnimationFrame(n);
	}

	/**
	 * Set a timeout.
	 * @param {Function} action
	 * @param {number} [time] Default to something like 4ms
	 * @param {Object} [thisp]
	 * returns {number}
	 */
	@chained
	static time(action, time) {
		return setTimeout(action, time || 0);
	}

	/**
	 * Cancel timeout by index.
	 * @param {number} n
	 */
	@chained
	static cancelTime(n) {
		clearTimeout(n);
	}

	/**
	 * Start repeated tick of given type. Once a tick
	 * is started, subsequent calls will be ignored.
	 * @param {string} type Tick type
	 * @param {number} time In milliseconds
	 * @returns {Function}
	 */
	@chained
	static start(type, time) {
		if (!intervals.has(type)) {
			intervals.set(
				type,
				setInterval(() => {
					dispatch(type);
				}, time)
			);
		}
	}

	/**
	 * Schedule callback async via `requestAnimationFrame`
	 * (in the browser) or via `setTimeout` (in the Node
	 * where process.next cannot be cancelled, or can it?)
	 * @param {Function} cb
	 * @returns {number}
	 */
	static schedule(cb) {
		return Environment.browser ? this.nextFrame(cb) : this.time(cb);
	}

	/**
	 * Cancel scheduled callback.
	 * @param {number} id
	 */
	@chained
	static cancelSchedule(id) {
		Environment.browser ? this.cancelFrame(id) : this.cancelTime(id);
	}

	/**
	 * Stop repeated tick of given type.
	 * @param {string} type Tick type
	 * @returns {Function}
	 */
	@chained
	static stop(type) {
		if (intervals.has(type)) {
			clearTimeout(intervals.get(type));
		}
	}

	/**
	 * Dispatch tick now or in specified time. No return value
	 * because `process.nextTick` can't be cancelled anyways.
	 * @param {string} type
	 * @param {number} [time]
	 */
	@chained
	static dispatch(type, time) {
		dispatch(type, time);
	}
}

// Scoped ......................................................................

/**
 * Get tick for type.
 * @param {string} type
 * @returns {Tick}
 */
function get(type) {
	if (!pool.has(type)) {
		pool.set(type, new Tick(type));
	}
	return pool.get(type);
}

/**
 * @param {string|Array<string>} type
 * @param {TickHandler} handler
 * @param {boolean} [one]
 */
function addhandler(type, handler, one) {
	asarray(type, t => {
		allhandlers.add(t, handler);
		if (one) {
			onehandlers.add(t, handler);
		}
	});
}

/**
 * @param {string|Array<string>} type
 * @param {TickHandler} handler
 */
function delhandler(type, handler) {
	asarray(type, t => {
		allhandlers.del(type, handler);
		onehandlers.del(type, handler);
	});
}

/**
 * Dispatch tick sooner or later.
 * @param {string} type
 * @param {number} [time]
 * @returns {number}
 */
function dispatch(type, time) {
	const now = arguments.length === 1;
	const set = scheduled;
	if (!set.has(type)) {
		set.add(type);
		const doit = () => {
			set.delete(type);
			handlers(get(type));
		};
		return now ? nexttick(doit) : setTimeout(doit, time);
	}
}

/**
 * @param {Tick} tick
 */
function handlers(tick) {
	const type = tick.type;
	const all = allhandlers;
	const one = onehandlers;
	all
		.toArray(type)
		.filter(handler => {
			handler.ontick(tick);
			return one.has(type, handler);
		})
		.forEach(handler => {
			all.del(type, handler);
			one.del(type, handler);
		});
}

/**
 * @param {Function} action
 * @returns {number}
 */
function nexttick(action) {
	return Environment.browser
		? fixImmediate(action)
		: Environment.node
			? setImmediate(action)
			: todo('WebWorkers unite');
}

/**
 * A gentle reminder.
 * @param {string} [message]
 * @throws {Error}
 */
function todo(message = 'fix') {
	throw new Error('TODO: ' + message);
}

/**
 * TODO!
 * @param {number} n
 */
function cancelnex(n) {
	// TODO
}
