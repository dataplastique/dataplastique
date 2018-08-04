/**
 * We're gonna combine multiple consecutive lines of markup into one single line.
 * @param {string} script
 * @returns {Array<string>}
 */
export default function(script) {
	return script.split('\n').reduce(reducer, []);
}

// Scoped ......................................................................

/**
 * Matches a line of markup (that was commented out in the previous step).
 * @type {RegExp}
 */
const MARKUP = /^\s*\/\/!/;

/**
 * Collecting a list of lines, combining lines as we go along.
 * @param {Array<string>} result
 * @param {string} line
 * @returns {Array<string>}
 */
function reducer(result, line) {
	const was = !!result.now;
	if ((result.now = MARKUP.test(line))) {
		if (was) {
			result[result.length - 1] += strip(line);
		} else {
			result.push(strip(line, true));
		}
	} else {
		result.push(line);
	}
	return result;
}

/**
 * Strip whitespace and all `+` used to concatenate multiple lines of markup.
 * @param {string} line - One line of markup
 * @param {boolean} [first] - First or following line of markup?
 * @returns {string}
 */
function strip(line, first) {
	const LEAD = /^\+/;
	const ENDS = /\+$/;
	return first
		? line.trimRight().replace(ENDS, '')
		: line
				.replace(MARKUP, '')
				.trim()
				.replace(LEAD, '')
				.replace(ENDS, '');
}
