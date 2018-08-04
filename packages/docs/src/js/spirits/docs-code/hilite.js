const indent = html => html.replace(/^(\s+)/, '<span class="indent">$1</span>');
const inline = html => `<span class="line">${html}</span>`;

/**
 * The highlighter. There can be only one.
 * @param {string} type
 * @returns {Function}
 */
export default function hilite(type) {
	return code => format(Prism.highlight(code.trimRight(), lookup(type)));
}

// Scoped ......................................................................

/**
 * Get highlighter for file type.
 * @param {string} type
 * @returns {Function}
 */
function lookup(type) {
	switch (type) {
		case 'text/javascript':
			return Prism.languages.javascript;
		case 'text/edbml':
			return Prism.languages.jsx;
		default:
			return Prism.languages.text;
	}
}

/**
 * Line art formatting.
 * - Wrap leading whitespace in `span.indent` (so we can style it)
 * - Wrap each individual line in `span.line` (to control lineheight)
 * @param {string} html
 * @returns {string}
 */
function format(html) {
	return html
		.split('\n')
		.map(indent)
		.map(inline)
		.join('');
}
