import { getscope } from './scopes';
import { Environment } from '@dataplastique/util';

/**
 * @filedesc
 * Carefully manage all input and output.
 */

/**
 * Key for public scope (the default scope).
 * @type {Symbol}
 */
const pubkey = Symbol('Output');

/**
 * @param {Model} model
 * @param {string|Symbol} [key]
 */
export function output(model, key = pubkey) {
	const C = timestamp(model.constructor);
	const [outscope, handlers] = getscope(key);
	outscope.set(C, model);
	if (handlers.has(C)) {
		handlers.get(C).forEach(handler => {
			handler.oninput(model);
		});
	}
}

/**
 * TODO: This methods needs some work.
 * TODO: Make revoke work with function callbacks.
 * @param {Model} model
 * @param {string|Symbol} [key]
 */
export function revoke(model, key = pubkey) {
	const C = model.constructor;
	const [outscope, handlers] = getscope(key);
	if (outscope.get(C) === model) {
		outscope.delete(C);
		if (handlers.has(C)) {
			handlers
				.get(C)
				.filter(handler => !!handler.onrevoke)
				.forEach(handler => handler.onrevoke(C));
		}
	}
}

/**
 * @param {Constructor} C
 * @param {InputHandler} handler
 * @param {string|Symbol} [key]
 */
export function connect(C, handler, key = pubkey) {
	const [outscope, handlers] = getscope(key);
	if (!handlers.has(C, handler)) {
		handlers.add(C, handler);
		if (outscope.has(C)) {
			handler.oninput(outscope.get(C));
		}
	}
}

/**
 * @param {Constructor} C
 * @param {InputHandler} handler
 * @param {string|Symbol} [key]
 */
export function disconnect(C, handler, key = pubkey) {
	const [outscope, handlers] = getscope(key);
	handlers.del(C, handler);
}

/**
 * Get latest output. Note that the offical API is `MyClass.output()`!
 * @param {Constructor} C
 * @param {string|Symbol} [key]
 * @returns {Model|null}
 */
export function get(C, key = pubkey) {
	const [outscope] = getscope(key);
	return outscope.get(C) || null;
}

// Scoped ......................................................................

/**
 * Workaraoundy setup for finding the latest output (elsewhere in the project).
 * We would like to track the output-chronology via some List or something, but
 * how would this structure be accessed and analyzed (elsewhere in the project)?
 * TODO: https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_timing_api
 * @param {Class<Model>} C
 * @returns {Class<Model>}
 */
function timestamp(C) {
	const now = Environment.isBrowser ? performance.now() : Date.now();
	C[Symbol.for('dataplastique:timestamp')] = now;
	return C;
}
