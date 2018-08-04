import prettier from 'prettier';

/**
 * Prettyprint and remove all non-JSDoc comments.
 * @param {string} js
 * @returns {string}
 */
export function format(js) {
	return js |> parse |> filter |> strip |> clean |> indent;
}

// Scoped ......................................................................

/**
 * Break script into single lines, apply action to lines, join lines to string.
 * @param {string} js
 * @param {Function} action
 * @returns {string}
 */
const eachline = (js, action) => action(js.split('\n')).join('\n');

/**
 * Prettier opinions.
 * @type {Object}
 */
const options = {
	useTabs: true,
	singleQuote: true,
	printWidth: 80
};

/**
 * Parse the script and prepare to remove comments.
 * @param {string} js
 * @returns {string|Error}
 */
function parse(js) {
	return prettier.format(js, {
		...options,
		parser(text, { babylon }) {
			let ast;
			try {
				ast = babylon(text);
			} catch (exception) {
				console.error(exception);
				ast = babylon('');
			}
			return mark(ast);
		}
	});
}

/**
 * Make comments identical so they can be targeted for deletion.
 * @param {Object} ast
 * @returns {Object}
 */
function mark(ast) {
	// const CHAPTER = /^[\s|{|}|,|;]*\/\/\s*[A-Za-z0-9 ]*\s*\.{4,}$/;
	const jsdocs = com => com.value.startsWith('*');
	const header = com => com.value.endsWith('......'); // use regexp above!
	const others = com => !jsdocs(com) && !header(com);
	const markit = com => (com.value = 'DELETE');
	ast.comments.filter(others).forEach(markit);
	return ast;
}

/**
 * Delete the lines consist only of (marked) comments.
 * @param {string} js
 * @returns {string}
 */
function filter(js) {
	return eachline(js, lines => {
		return lines.filter(line => {
			return (line = line.trim()) !== '/*DELETE*/' && line !== '//DELETE';
		});
	});
}

/**
 * Delete the remaining (marked) comments.
 * @param {string} js
 * @returns {string}
 */
function strip(js) {
	const block = /\/\*\DELETE\*\//g;
	const lines = /\/\/\DELETE/g;
	return [block, lines].reduce((result, regex) => {
		return result.replace(regex, '');
	}, js);
}

/**
 * Remove consecutive empty lines (where comments used to be).
 * @param {string} js
 * @returns {string}
 */
function clean(js) {
	let was = false;
	const ok = line => (was = line !== '' || !was);
	return eachline(js, lines => {
		return lines.filter(ok);
	});
}

/**
 * Preserve indent level also on empty lines. In the final rendering, we
 * will style this whitespace with CSS to render the vertical "line art",
 * it was however easier to perform this operation now instead of later.
 * @param {string} js
 * @param {string} [tabs]
 * @returns {string}
 */
function indent(js, tabs = '') {
	const empty = line => line === '';
	const level = line => /^\t*/.exec(line)[0];
	return eachline(js, lines => {
		return lines.map(line => {
			tabs = empty(line) ? tabs : level(line);
			return empty(line) ? tabs : line;
		});
	});
}
