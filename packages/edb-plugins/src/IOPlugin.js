import Tracker from './Tracker';
import { Model } from '@dataplastique/edb';
import { IMap } from '@dataplastique/util';

/**
 * Workaroundy timestamp thing.
 * @type {Symbol}
 */
const timestamp = Symbol.for('dataplastique:timestamp');

/**
 *
 */
export default class IOPlugin extends Tracker() {
	/**
	 * @param {IList<Function|IMap<Function, Function>>} pattern
	 * @param {Function} handler
	 * @param {boolean} [one]
	 */
	$on(pattern, handler, one) {
		connect(pattern);
	}

	/**
	 * @param {IList<Function|IMap<Function, Function>>} pattern
	 * @param {Function} handler
	 */
	$off(pattern, handler) {
		disconnect(pattern);
	}

	/**
	 * @param {Model} model
	 */
	static oninput(model) {
		const target = model.constructor;
		this.map()
			.filter((handlers, pattern) => matches(pattern, target))
			.forEach((handlers, pattern) => {
				trigger(handlers, collect(pattern, target));
			});
	}
}

// Scoped ......................................................................

const notnull = input => input !== null;
const isclass = input => typeof input === 'function';
const tomodel = input => (isclass(input) ? input : input.toList());
const outside = klass => !!klass.output();
const gettime = klass => klass[timestamp];

/**
 * Connect plugin to models.
 * @param {IList<Function|IMap<Function, Function>>} types
 */
function connect(types) {
	const models = types.map(tomodel).flatten();
	models.forEach(model => model.connect(IOPlugin));
}

/**
 * TODO: Compare with flattened map and only disconnect if model is one entry
 * @param {Array<Function|Object<Function, Function>>} types
 */
function disconnect(types) {
	console.error('TODO!');
}

/**
 * @param {IList} pattern
 * @param {Class<Model>} target
 * @returns {boolean}
 */
function matches(pattern, target) {
	return pattern.reduce((does, next) => {
		return does || (IMap.isMap(next) ? next.includes(target) : next === target);
	}, false);
}

/**
 * If all expected output has been collected, poke the associated handlers.
 * @param {Set<Function>} set
 * @param {Array<Class<Model>>} args
 */
function trigger(set, args) {
	if (args.every(notnull)) {
		set.forEach(handler => handler(...args));
	}
}

/**
 * Collect output.
 * @param {IList} pattern
 * @param {Class<Model>} target
 * @returns {Array<Class<Model>>}
 */
function collect(pattern, target) {
	return pattern.reduce((args, next) => {
		return args.concat(output(IMap.isMap(next) ? latest(next) : next));
	}, []);
}

/**
 * From types in map, get the one that was output most recently (if any).
 * @param {IMap<Class<Model>, Class<Model>>} map
 * @returns {Class<Model>|null}
 */
function latest(map) {
	return map
		.toList()
		.filter(outside)
		.maxBy(gettime);
}

/**
 * Get output of given type (or `null` if not).
 * @param {Class<Model>|undefined} C
 * @returns {Model|null}
 */
function output(C) {
	return C ? C.output() : null;
}
