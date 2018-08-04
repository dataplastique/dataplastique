import prettier from 'prettier';

/**
 * Resolve import statements and declare variables in functon bodies.
 * @param {Array<string>} lines
 * @param {Object} options
 * @returns {string}
 */
export default function(lines, options) {
	return [functions, imports, cleanup].reduce((result, step) => {
		return step(result, options);
	}, lines);
}

// Scoped ......................................................................

/**
 * Match root level function declaration.
 * @type {RegExp}
 */
const FUNCTION = /^(?:(export*)?)\s*(?:(default*)*?)\s*function(?=\s*(?:\w*)?\s*\(.*\))/;

/**
 * Extract function name from declaration.
 * @type {RegExp}
 */
const FUNCNAME = /function\s*([^\(]*)/i;

/**
 * We expect this package in the node_modules folder.
 * TODO: Let's explain this again, shall we?
 * @type {string}
 */
const RUNTIME = 'dataplastique'; // WAS '@dataplastique/edbml-runtime' !!!!!

/**
 * Resolve all functions in the script so that `out` and `att` are declared
 * whenever needed. Make sure that exported functions also return something.
 * @param {Array<string>} lines
 * @returns {string}
 */
function functions(lines) {
	let main = [];
	let func = false;
	let body = null;
	let name = null;
	let expo = false;
	lines.forEach(line => {
		if (func) {
			if (line.trimRight() === '}') {
				main.push(resolve(body, name, expo), line);
				func = false;
			} else {
				body.push(line);
			}
		} else {
			if (FUNCTION.test(line)) {
				func = true;
				body = [];
				name = FUNCNAME.exec(line)[1];
				expo = line.trimLeft().startsWith('export');
				// This line will fit the export default function with a proper name
				// in case we want to add expando metadata for template caching stuff
				// main.push(name ? line : line.replace('function', 'function $edbml'));
				main.push(line);
			} else {
				main.push(line);
			}
		}
	});
	return main.join('\n');
}

/**
 * Resolve a single function.
 * TODO: Skip return if closest code has already returned something.
 * @param {Array<string>} body
 * @param {string} name
 * @param {boolean} expo
 * @returns {string}
 */
function resolve(body, name, expo) {
	const out = expo || body.some(l => /out`|out\(/.test(l));
	const intro = out ? `\tconst out = output();` : '';
	const extro = expo ? `\treturn out();` : '';
	return [intro, ...body, extro].join('\n');
}

/**
 * Import members from `dataplastique-edbml-runtime`.
 * @param {string} script
 * @returns {string}
 */
function imports(script) {
	const list = /out`|out\(/g.test(script) ? ['output'] : [];
	const head = list[0]
		? `import { ${list.join(', ')} } from '${RUNTIME}';`
		: '';
	return [head, script].join('\n\n');
}

/**
 * TODO: Cleanup cleaner.
 * @param {string} script
 * @param {Object} options
 * @returns {string}
 */
function cleanup(script, options) {
	const notempty = line => line.trim() !== '';
	return prettier.format(
		script
			.split('\n')
			.filter(notempty)
			.join('\n'),
		options
	);
}
