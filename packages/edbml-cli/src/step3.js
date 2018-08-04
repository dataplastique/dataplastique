import Parser from './Parser';

/**
 * Compile EDBML to pure JS.
 * TODO: Conceptualize peek|poke|passout|lockout (and also write it down!)
 * @param {Array<string>} lines
 * @returns {Array<string>}
 */
export default function(lines) {
	const parser = new Parser();
	lines = lines.map(lineparser(parser));
	return inject(lines, parser.injections());
}

// Scoped ......................................................................

/**
 * Matches a line of (still commented out) markup.
 * @type {RegExp}
 */
const MARKUPCOMMENT = /^\s*\/\/!/;

/**
 * Returns a function to parse a line of markup into JS.
 * @param {Parser} parser
 * @returns {Function}
 */
function lineparser(parser) {
	return (line, index) => {
		const ishtml = MARKUPCOMMENT.test(line);
		if (ishtml) {
			line = line.replace(MARKUPCOMMENT, '');
			line = parseedbml(line, parser);
		}
		parser.reset(ishtml, index);
		return line;
	};
}

/**
 * Parse a line of markup to produce a line of JS.
 * @param {string} line
 * @param {SAXParser} parser
 * @returns {string}
 */
function parseedbml(line, parser) {
	const lead = /^\s*/.exec(line);
	line = line.trim();
	line = line.replace(/^\+/, '');
	line = line.replace(/\+$/, '');
	line = parser.parse(line);
	return lead + 'out`' + line + '`;';
}

/**
 * @param {Array<string>} lines
 * @param {Map<number, Array<string>>} map
 * @returns {Array<string>}
 */
function inject(lines, map) {
	return lines.reduce((lines, line, index) => {
		lines.push(line);
		if (map.has(index)) {
			lines.push(...map.get(index));
		}
		return lines;
	}, []);
}
