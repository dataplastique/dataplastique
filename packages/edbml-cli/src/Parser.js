import prettier from 'prettier';
import parse5 from 'parse5';

/**
 * TODO: Translate selected self closing tags to start plus end tags.
 * @see https://www.w3.org/TR/html5/syntax.html#syntax-tag-omission
 */
export default class Parser {
	/**
	 * Configure SAXParser.
	 */
	constructor() {
		const append = html => (this._markup += html);
		this._parser
			.on('startTag', (...args) => append(starttag(this, ...args)))
			.on('endTag', tag => append(`</${tag}>`))
			.on('text', text => append(text));
	}

	/**
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	parse(line, index) {
		this._source += line;
		for (let c of line) {
			this._parser.write(c);
		}
		return this._markup;
	}

	/**
	 * @param {boolean} ishtml
	 * @param {number} index
	 */
	reset(ishtml, index) {
		this._lastjs = ishtml ? this._lastjs : index;
		this._markup = '';
	}

	/**
	 * @returns {number}
	 */
	increment() {
		return this._counts++;
	}

	/**
	 * @param {string} code
	 */
	inject(code) {
		const map = this._inject;
		const now = this._lastjs;
		if (!map.has(now)) {
			map.set(now, []);
		}
		map.get(now).push(code);
	}

	/**
	 * @param {number} start
	 * @param {number} stop
	 * @returns {string}
	 */
	extract(start, stop) {
		return this._source.substring(start, stop);
	}

	/**
	 * @returns {Map<number, Array<string>>}
	 */
	injections() {
		return this._inject;
	}

	// Private ...................................................................

	/**
	 * @type {parse5.SAXParser}
	 */
	_parser = new parse5.SAXParser({
		locationInfo: true
	});

	/**
	 * @type {Map<number, Array<string>>}
	 */
	_inject = new Map();

	/**
	 * @type {Array<string>}
	 */
	_source = '';

	/**
	 * @type {string}
	 */
	_markup = '';

	/**
	 * @type {number}
	 */
	_lastjs = 0;

	/**
	 * @type {number}
	 */
	_counts = 0;
}

// Scoped ......................................................................

/**
 * Match attribute name that can be declared as JS property using dot notation.
 * @type {RegExp}
 */
const SAFEATT = /^[^\d][a-zA-Z0-9_\$]*$/;

/**
 * Matches the ${value} between the curly braces.
 * @type {RegExp}
 */
const XPVALUE = /\$\{(.*)\}/;

/**
 * @param {string} name
 * @returns {string}
 */
const prefix = name => name.split(':')[0];

/**
 * @param {string} name
 * @returns {string}
 */
const localname = name => name.split(':')[1];

/**
 * @param {string} name
 * @returns {boolean}
 */
const reserved = name => /^(on:|do:elm|do:gui)/.test(name);

/**
 * @param {string} value
 * @returns {string}
 */
const decode = value => value.match(XPVALUE)[1];

/**
 * @param {Parser} parser
 * @param {string} tag
 * @param {Array<Object>} atts
 * @param {boolean} closing
 * @param {Object} location
 * @returns {string}
 */
function starttag(parser, tag, atts, closing, location) {
	atts = atts.map(att => exactcase(parser, att, location));
	atts = resolveall(parser, tag, atts).map(attributedone);
	return `<${tag}${atts.join('')}${closing ? '/' : ''}>`;
}

/**
 * Restore attribute name to pascalCase and convert to kebab-case.
 * The attributes appear to *not* be indexed for SVG elements (?).
 * This conversion is not technically needed anymore, but still.
 * @see https://github.com/inikulin/parse5/issues/116
 * @param {Parser} parser
 * @param {Object} att
 * @param {Object} location
 * @returns {Object}
 */
function exactcase(parser, { name, value }, location) {
	const loc = location.attrs[name];
	if (loc) {
		const sub = parser.extract(loc.startOffset, loc.endOffset);
		return { name: sub.substr(0, name.length), value };
	} else {
		return { name, value };
	}
}

/**
 * @param {Parser} parser
 * @param {string} tag
 * @param {Array<Object>} before
 * @returns {Array<Object>}
 */
function resolveall(parser, tag, before) {
	return before.reduce((after, att) => {
		if (reserved(att.name)) {
			resolveone(parser, tag, after, att);
		} else {
			after.push(att);
		}
		return after;
	}, []);
}

/**
 * @param {Parser} parser
 * @param {string} tag
 * @param {Array<Object>} atts
 * @param {Object} att
 */
function resolveone(parser, tag, atts, { name, value }) {
	const code = format(decode(value));
	const type = localname(name);
	switch (prefix(name)) {
		case 'on':
			updateatts(
				atts,
				'data-plastique-on',
				`${type}:${injectevent(parser, tag, code)}`
			);
			break;
		case 'do':
			updateatts(atts, `data-plastique-${type}`, inject(parser, code, type));
			break;
	}
}

/**
 * @param {Object} att
 * @returns {Object}
 *
function resolveguid({ name, value }) {
	name = name === 'guid' ? 'data-plastique-id' : name;
	return { name, value };
}
*/

/**
 * @param {Array<Object>} atts
 * @param {string} dataname
 * @param {string} value
 */
function updateatts(atts, dataname, value) {
	let old = att => att.name === dataname;
	let att = atts.find(old);
	if (!att) {
		atts.push((att = { name: dataname, value: '' }));
	}
	att.value += (att.value ? ';' : '') + value;
}

/**
 * Finally string the attribute as HTML.
 * @param {Object} att
 * @returns {string}
 */
function attributedone({ name, value }) {
	return name.startsWith('@') ? proxyatt(name.slice(1)) : ` ${name}="${value}"`;
}

/**
 * This attribute becomes a HTML attribute at runtime.
 * @param {string} name
 * @returns {string}
 */
function proxyatt(name) {
	return SAFEATT.test(name)
		? ' ${out.' + name + '}'
		: " ${out['" + name + "']}";
}

/**
 * @param {Parser} parser
 * @param {string} tag
 * @param {string} code
 * @returns {string}
 */
function injectevent(parser, tag, code) {
	const form = /textarea|input/.test(tag);
	const args = form ? '(e, value, checked)' : 'e';
	return inject(parser, code, args);
}

/**
 * @param {Parser} parser
 * @param {string} code
 * @param {string} [args]
 * @returns {string}
 */
function inject(parser, code, args = '()') {
	const next = parser.increment();
	const call = `const df${next} = out.arrghs(${args} => ${code});\n`;
	parser.inject(call);
	return '${df' + next + '}';
}

// Code formatting .............................................................

/**
 * Run inline calback (string) through Prettier to determine if it should be
 * wrapped in curly braces for a multiline arrow function. As a bonus, the
 * parser will fail fast at this point if the code is not syntactically valid.
 * TODO: Make such an exception triggers more useful console debugging info.
 * @param {string} code
 * @param {string} lead
 * @returns {string}
 */
function format(code, lead = '') {
	code = pretty(code);
	if (code.includes('\n')) {
		return indent(pretty('{' + code + '}'), lead);
	} else {
		return code.replace(/;$/, '');
	}
}

/**
 * @param {string} code
 * @returns {string}
 */
function pretty(code) {
	return prettier
		.format(code, {
			useTabs: true,
			singleQuote: true,
			printWidth: 1000
		})
		.trim();
}

/**
 * @param {string} code
 * @param {string} lead
 * @returns {string}
 */
function indent(code, lead) {
	return code
		.split('\n')
		.map((l, i) => (i ? lead + l : l))
		.join('\n');
}
