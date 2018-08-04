const TYPE = /\s([a-zA-Z]+)/; // match 'Array' in '[object Array]' and so on.

/**
 * Make sure not to use any strange `toString` method.
 * @type {Function}
 */
const stringify = Object.prototype.toString;
const something = any => typeof any === 'object';

/**
 * Regexp `class.toString` according to the specification,
 * according to how it transpiles in Babel and according
 * to our own custom syntax that says `[class MyClass]`.
 */
const [CLASS_SPEC, CLASS_BABEL, CLASS_CUSTOM] = [
	/^\s*class\s+/, // generic class in the spec (not supported anywhere yet)
	/_class\S+/i, // generic cass in Babel
	/^\[class / // our own custom class `toString` response
];

/**
 * Type checking studio.
 */

/**
 * Get type of argument. Note that response may differ between user agents.
 * @see http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator
 * @see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
 * @see http://stackoverflow.com/questions/12018759/how-to-check-the-class-of-an-instance-in-javascript
 * @param {*} any
 * @returns {string}
 */
export function typeOf(any) {
	return stringify
		.call(any)
		.match(TYPE)[1]
		.toLowerCase();
}

/**
 * Is object defined?
 * TODO: unlimited arguments support
 * TODO: See note on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
 * @param {*} any
 * @returns {boolean}
 */
export function isDefined(any) {
	return any !== undefined;
}

/**
 * Is complex type?
 * @param {*} any
 * @returns {boolean}
 */
export function isComplex(any) {
	switch (any) {
		case undefined:
		case null:
		case true:
		case false:
			return false;
	}
	switch (typeof any) {
		case 'string':
		case 'symbol':
		case 'number':
			return false;
	}
	return true;
}

/**
 * @param {*} any
 * @returns {boolean}
 */
export function isArray(any) {
	return Array.isArray(any);
}

/**
 * Note: This no longer works for classes in Chrome because `of`
 * now returns something like `[object [class MyClass]]`, this could
 * however be just a passing phase, so let's panic later.
 * @param {*} any
 * @returns {boolean}
 */
export function isFunction(any) {
	return !!(typeof any === 'function' && any.call && any.apply);
}

/**
 * Is object and *not* and array?
 * @param {*} any
 * @returns {boolean}
 */
export function isObject(any) {
	return typeof any === 'object' && !Array.isArray(any);
}

/**
 * @param {*} any
 * @returns {boolean}
 */
export function isString(any) {
	return typeof any === 'string';
}

/**
 * @param {*} any
 * @returns {boolean}
 */
export function isNumber(any) {
	return typeof any === 'number';
}

/**
 * @param {*} any
 * @returns {boolean}
 */
export function isBoolean(any) {
	return any === true || any === false;
}

/**
 * @param {*} any
 * @returns {boolean}
 */
export function isDate(any) {
	return something(any) && any instanceof Date;
}

/**
 * TODO: See note on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
 * @param {*} any
 * @returns {boolean}
 */
export function isNull(any) {
	return any === null;
}

/**
 * @param {*} any
 * @returns {boolean}
 */
export function isArguments(any) {
	return typeOf(any) === 'arguments';
}

/**
 * @param {*} any
 * @returns {boolean}
 */
export function isSymbol(any) {
	return typeof any === 'symbol';
}

/**
 * @param {*} any
 * @returns {boolean}
 */
export function isFile(any) {
	return typeOf(any) === 'file';
}

/**
 * Is Window object?
 * @param {*} any
 * @returns {boolean}
 */
export function isWindow(any) {
	return !!(
		any &&
		any.document &&
		any.location &&
		any.alert &&
		any.setInterval
	);
}

/**
 * Is Event object?
 * @param {*} any
 * @returns {boolean}
 */
export function isEvent(any) {
	return !!(typeOf(any).endsWith('event') && any.type);
}

/**
 * Is node?
 * @param {*} any
 * @returns {boolean}
 */
export function isNode(any) {
	return !!(
		any &&
		typeof any === 'object' &&
		any.nodeType &&
		any.compareDocumentPosition
	);
}

/**
 * Is DOM element?
 * @param {*} any
 * @returns {boolean}
 */
export function isElement(any) {
	return isNode(any) && any.nodeType === Node.ELEMENT_NODE;
}

/**
 * Is DocumentFragment?
 * @param {*} any
 * @returns {boolean}
 */
export function isDocumentFragment(any) {
	return isNode(any) && any.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}

/**
 * Is Document?
 * @param {*} any
 * @returns {boolean}
 */
export function isDocument(any) {
	return isNode(any) && any.nodeType === Node.DOCUMENT_NODE;
}

/**
 * TODO: This does not seem performant, can we fix that?????
 * Idea: Scope this method to *only* check {Proto} classes?
 * Test if something is a class (and not just a constructor).
 * @param {*} any
 * @returns {boolean}
 */
export function isClass(any) {
	if (any && typeof any === 'function') {
		const string = any.toString();
		const regexs = [CLASS_SPEC, CLASS_BABEL, CLASS_CUSTOM];
		return regexs.some(regexp => regexp.test(string));
	}
	return false;
}

/**
 * Something appears to be something array-like?
 * @param {*} any
 * @returns {boolean}
 */
export function isArrayLike(any) {
	return any && '0' in any && !isArray(any);
}

/**
 * Autocast string to an inferred type. '123' will
 * return a number, `false` will return a boolean.
 * @param {String} string
 * @returns {object}
 */
export function cast(string) {
	const s = String(string).trim();
	switch (s) {
		case 'null':
			return null;
		case 'undefined':
			return undefined;
		case 'true':
		case 'false':
			return s === 'true';
		default:
			return String(parseInt(s, 10)) === s
				? parseInt(s, 10)
				: String(parseFloat(s)) === s
					? parseFloat(s)
					: String(string);
	}
}
