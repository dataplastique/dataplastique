import { safeattr } from './safe';

/**
 * @param {string} value
 * @param {Array<string>} unsafe
 * @param {Array<sSpirit|Node|NodeList>} nodes
 * @returns {string}
 */
export function fixvalue(value, unsafe, nodes) {
	const attribute = /^\S+=".*"$/g;
	if (value) {
		if (isnode(value)) {
			const marker = `{node:${nodes.length}}`;
			nodes.push(value);
			return marker;
		} else {
			const marker = `{unsafe:${unsafe.length}}`;
			unsafe.push(value);
			return marker;
		}
	}
	return '';
}

/**
 * Note that this simply returns the unsafe value.
 * It only becomes safe with further manhandling!
 * @param {string} data
 * @param {Array<string>} unsafe
 * @returns {string}
 */
export function fixtext(data, unsafe) {
	return fix(data, unsafe);
}

/**
 * @param {string} name
 * @param {string} value
 * @param {Array<string>} unsafe
 * @returns {string}
 */
export function fixattr(name, value, unsafe) {
	return safeattr(name, fix(value, unsafe));
}

// Scoped ......................................................................

/**
 * TODO: Test for non-primitive might be faster.
 * @param {*} value
 * @returns {boolean}
 */
function isnode(value) {
	return !!value.nodeType || value.isModel || value.isSpirit;
}

/**
 * @param {string} data
 * @param {Array<string>} unsafe
 * @param {Function} pipe
 * @returns {string}
 */
function fix(data, unsafe) {
	return data
		.split(/{unsafe:(\d+)}/)
		.map((string, index) => {
			return index % 2 === 0 ? string : unsafe[parseInt(string, 10)];
		})
		.join('');
}
