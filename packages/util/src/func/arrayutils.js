import { typeOf, isArrayLike } from '../Type';

/**
 * Flatten that array.
 * @param {Array} array
 * @returns {Array}
 */
export function flatten(array) {
	return array.reduce((result, next) => {
		return result.concat(Array.isArray(next) ? flatten(next) : next);
	}, []);
}

/**
 * Resolve single argument into an array with one or more
 * entries with special handling of single string argument:
 *
 * 1. Strings to be split at spaces into an array
 * 3. Arrays are converted to a similar but fresh array
 * 2. Array-like objects transformed into real arrays.
 * 3. Other objects are pushed into a one entry array.
 *
 * @param {Object} arg
 * @param {Function} [action]
 * @returns {Array|void}
 */
export function asarray(arg, action) {
	const list = makearray(arg);
	if (action) {
		list.forEach(action);
	} else {
		return list;
	}
}

// Scoped ......................................................................

/**
 * Resolve argument into array.
 * @param {*} arg
 * @returns {Array}
 */
function makearray(arg) {
	switch (typeOf(arg)) {
		case 'string':
			return arg.split(' ');
		case 'array':
			return Array.from(arg);
		default:
			if (isArrayLike(arg)) {
				return Array.from(arg);
			} else {
				return [arg];
			}
	}
}
