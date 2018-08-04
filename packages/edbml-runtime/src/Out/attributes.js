/**
 * Get one or more attribute declarations.
 * @param {Function} target
 * @param {string} name
 * @param {*} value
 * @param {string} [type]
 * @returns {string}
 */
export function htmlattribute(target, name, value, type = gettype(value)) {
	switch (type) {
		case 'null':
		case 'undefined':
			return '';
		case 'object':
			return getall(target, Object.entries(value));
		case 'array':
			return getall(value); // TODO: confirm [name, value] here!
		default:
			return getone(target, name, value, type);
	}
}

// Scoped ......................................................................

/**
 * Declare single HTML attribute.
 * @param {Function} target
 * @param {string} name
 * @param {*} val
 * @param {string} [type]
 * @returns {string}
 */
function getone(target, name, val, type) {
	const unsafe = encode(val, type || gettype(val));
	return name + `="${target.guargh(unsafe)}"`;
}

/**
 * Bulk declare HTML attributes.
 * @param {Function} target
 * @param {Array<Array<string, Any>>} entries
 * @returns {string}
 */
function getall(target, entries) {
	return entries
		.map(entry => getone(target, ...entry))
		.join(' ')
		.trim();
}

/**
 * Get string type of something (somewhat better than typeof).
 * That regexp matches 'Array' in '[object Array]' and so on.
 * @param {Object} val
 * @returns {string}
 */
function gettype(val) {
	const stringify = Object.prototype.toString;
	const typematch = /\s([a-zA-Z]+)/;
	return stringify
		.call(val)
		.match(typematch)[1]
		.toLowerCase();
}

/**
 * Stringify stuff to be used as HTML attribute values.
 * TODO: in 'string' case, support simple/handcoded JSON object/array.
 * @param {*} val
 * @param {string} type
 * @returns {string}
 */
function encode(val, type) {
	switch (type) {
		case 'string':
			return val;
		case 'number':
		case 'boolean':
			return String(val);
			break;
		case 'date':
			throw new Error('TODO: Encode standard date format?');
		default:
			throw new Error('Could not create HTML attribute from: ' + type);
	}
}
