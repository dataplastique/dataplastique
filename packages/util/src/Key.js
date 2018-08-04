import { isString } from './Type';

/**
 * Seriously tracking keys to avoid duplicates.
 * @type {Set<string>}
 */
const keys = new Set();

/**
 * Generating keys for unique key purposes.
 */
export default class Key {
	/**
	 * Generate random key.
	 * @param {string} [fix]
	 * @returns {string}
	 */
	static generate(fix = 'key') {
		const ran = String(Math.random());
		const key = fix + ran.slice(2, 11);
		return keys.has(key)
			? this.generate()
			: do {
					keys.add(key);
					key;
			  };
	}

	/**
	 * Generate some unified resource name with random identifier.
	 * Takes an array for strings (for domain and type and so on).
	 * @returns {string}
	 */
	static generateURN(...args) {
		return `urn:${args.join(':')}:${this.generate('')}`;
	}

	/**
	 * Generate GUID.
	 * TODO: Verify integrity of this by mounting result in Java or something.
	 * @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	 * @returns {string}
	 */
	static generateGUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
			.replace(/[xy]/g, function(c) {
				let r = (Math.random() * 16) | 0;
				let v = c === 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			})
			.toLowerCase();
	}

	/**
	 * String appears to be a generated key? We don't look it up in the key cache,
	 * so this method can be used to check a key that was generated in old session.
	 * @param {string} string
	 * @param {string} [fix]
	 * @returns {boolean}
	 */
	static isKey(string, fix = 'key') {
		let hit = null;
		let looks = false;
		if (isString(string)) {
			hit = this.extractKeys(string, fix);
			looks = hit.length === 1 && hit[0].length === string.length;
		}
		return looks;
	}

	/**
	 * Extract keys from string. This always
	 * returns a (potentially empty) array.
	 * TODO: Rename (since it doesn't remove)!
	 * @param {string} string
	 * @param {string} [fix]
	 * @returns {Array<string>}
	 */
	static extractKeys(string, fix = 'key') {
		let next;
		let keys = [];
		let regex = getfix(fix);
		while ((next = regex.exec(string))) {
			keys.push(next[0]);
		}
		return keys;
	}

	/**
	 * Remove keys from string to compare non-keyed content.
	 * TODO: TEST THIS!
	 * @param {string} string
	 * @param {string} [fix]
	 * @returns {string}
	 */
	static removeKeys(string, fix = 'key') {
		return string.replace(fixs.get(fix), '');
	}
}

// Scoped ......................................................................

/**
 * Collecting regular expressions.
 * @type {Map<string, RegExp>}
 */
const fixs = new Map();

/**
 * Get regexp for fix.
 * @param {string} fix
 * @returns {RegExp}
 */
function getfix(fix = 'key') {
	return fixs.has(fix)
		? fixs.get(fix)
		: do {
				const exp = new RegExp(fix + '\\d{9}', 'g');
				fixs.set(fix, exp);
				exp;
		  };
}
