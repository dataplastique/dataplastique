import prettier from 'prettier';
import util from 'util';

/**
 * We're gonna remove all JS comments, confirm basic syntactical
 * integrity and standardize the general code style via Prettier.
 * TODO: Support non-Babylon parser via options
 * TODO: Preserve JSDoc comments
 * @param {string} script
 * @param {Object} options
 * @returns {string|Error}
 */
export default function(script, options) {
	return [prepare, parse, restore].reduce((code, step) => {
		return code instanceof Error ? code : step(code, options);
	}, script);
}

// Scoped ......................................................................

/**
 * Match @attribute name that can be declared as JS property using dots
 * @type {RegExp}
 */
const NORMALS = /(?!\n)\s*@([A-Za-z]+[A-Za-z0-9_]*)\s*=+/g;

/**
 * Match @attribute name that must be declared as JS property using brackets.
 * @type {RegExp}
 */
const SPECIAL = /(?!\n)\s*@(.[^\s]*)\s*=+/g;

/**
 * Comment everything that looks like EDBML so that we can parse the code as JS.
 * @attribute assignements will be resolved here so that they also become valid.
 * @param {string} script
 * @returns {string}
 */
function prepare(script) {
	let html = false;
	let cont = false;
	let lead = '';
	let adds = line => line.endsWith('+');
	let atts = line => {
		return line.replace(NORMALS, 'out.$1 =').replace(SPECIAL, "out['$1'] =");
	};
	return script
		.split('\n')
		.map(line => {
			lead = /^\s*/.exec(line);
			line = line.trim();
			switch (line[0]) {
				case '<':
					html = true;
					cont = adds(line);
					break;
				case '+':
					cont = html;
					break;
				case '@':
					if (!cont) {
						line = atts(line);
						html = false;
					}
					break;
				default:
					if (cont) {
						cont = adds(line);
					} else {
						html = false;
					}
					break;
			}
			return (html ? '//!' : '') + lead + line;
		})
		.join('\n');
}

/**
 * Parse the script and prepare to remove JS comments.
 * @param {string} script
 * @returns {string|Error}
 */
function parse(script) {
	let error = null;
	script = prettier.format(script, {
		useTabs: true,
		singleQuote: true,
		printWidth: 1000,
		parser(text, { babylon }) {
			let ast;
			try {
				ast = babylon(text);
			} catch (exception) {
				ast = babylon('');
				error = exception;
			}
			return strip(ast);
		}
	});
	return error || script;
}

/**
 * Make comments identical so they can be targeted for deletion.
 * @param {Object} ast
 * @returns {Object}
 */
function strip(ast) {
	ast.comments.forEach(c => {
		if (!c.value.startsWith('!')) {
			c.value = '?';
		}
	});
	return ast;
}

/**
 * Delete the JS comments (but keep the markup comments).
 * @param {string} script
 * @returns {string}
 */
function restore(script) {
	const block = /\/\*\?\*\//g;
	const lines = /\/\/\?/g;
	return [block, lines].reduce((result, regex) => {
		return result.replace(regex, '');
	}, script);
}
