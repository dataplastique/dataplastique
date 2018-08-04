import { immutable, IMap, ISet, IList } from '../Immutable';
import { chained } from '../decorators';

/**
 *
 */
export default class IMapping {
	/**
	 * Mapping patterns to set of function callbacks and/or object handlers.
	 * @type {IMap<IList<*>, ISet<Function|Object>>}
	 */
	map = new IMap();

	/**
	 * Add handler for pattern.
	 * @param {*} pattern
	 * @param {Function|Object} handler
	 * @returns {this}
	 */
	@chained
	add(pattern, handler) {
		this.map = addhandler(this.map, immutable(pattern), handler);
	}

	/**
	 * Remove handler for pattern.
	 * @param {*} pattern
	 * @param {Function|Object} handler
	 * @returns {this}
	 */
	@chained
	del(pattern, handler) {
		this.map = delhandler(this.map, immutable(pattern), handler);
	}

	/**
	 * Has any handlers for pattern (or one specific handler for pattern)?
	 * @param {Array|IList} pattern
	 * @param {Function|Object} [handler] - Omit to confirm "any handlers"
	 * @returns {boolean}
	 */
	has(pattern, handler) {
		return hashandler(this.map, immutable(pattern), handler);
	}

	/**
	 * Get handlers for pattern.
	 * @param {Array|IList} pattern
	 * @returns {ISet<Function|Object>}
	 */
	get(pattern) {
		return this.map.get(immutable(pattern));
	}

	/**
	 * Clear the map.
	 */
	@chained
	clear() {
		this.map.clear();
	}

	/**
	 * Get the map.
	 * @parity {Mapping}
	 * @returns {IMap<IList<*>, ISet<Function|Object>>}
	 */
	toMap() {
		return this.map;
	}

	/**
	 * Get set indexed by key. Always returns an ISet.
	 * @param {Array|IList} pattern
	 * @returns {ISet<Function|Object>}
	 */
	toSet(pattern) {
		return this.has(pattern) ? this.get(pattern) : new ISet();
	}

	/**
	 * Get set indexed by key as array. Always returns an array.
	 * @param {Array|IList} pattern
	 * @returns {Array<Function|Object>}
	 */
	toArray(pattern) {
		return this.toSet((pattern = immutable(pattern))).toArray();
	}
}

// Scoped ......................................................................

/**
 * Add handler for pattern.
 * @param {IMap} map
 * @param {IList} pattern
 * @param {Function|Object} handler
 * @returns {IMap}
 */
function addhandler(map, pattern, handler) {
	return map.set(pattern, gethandler(map, pattern).add(handler));
}

/**
 * Remove handler for pattern.
 * @param {IMap} map
 * @param {IList} pattern
 * @param {Function|Object} handler
 * @returns {IMap}
 */
function delhandler(map, pattern, handler) {
	const set = gethandler(map, pattern).delete(handler);
	return set.size ? map.set(pattern, set) : map.delete(pattern);
}

/**
 * Get handlers for pattern (or create a new set to store them).
 * @param {IMap} map
 * @param {IList} pattern
 * @returns {ISet<Function|Object>}
 */
function gethandler(map, pattern) {
	return map.has(pattern) ? map.get(pattern) : new ISet();
}

/**
 * Has any handlers for pattern (or one specific handler for pattern)?
 * @param {IMap} map
 * @param {IList} pattern
 * @param {Function|Object} [handler]
 * @returns {boolean}
 */
function hashandler(map, pattern, handler) {
	return map.has(pattern) && (handler ? map.get(pattern).has(handler) : true);
}
