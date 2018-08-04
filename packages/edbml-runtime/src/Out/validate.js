const rooted = html => `<wellformed>${html}</wellformed>`;
const unroot = html => html.replace(/<\/*wellformed>/g, '');
const encode = html => html.replace(/&([^\s]*);/g, '&amp;$1;');
const decode = html => html.replace(/&amp;([^\s]*);/g, '&$1;');

let serial = null;
let parser = null;

/**
 * TODO: Enable this option!
 * Attempt to parse the markup as XHTML. In case of failure,
 * we return some substitute markup to render a parser error.
 * Please note that such failure will not nescessarily throw
 * an exception an all browsers.
 * @param {string} markup
 * @returns {string} If well-formed, returns this input markup
 */
export function wellformed(markup) {
	parser = parser || (parser = new DOMParser());
	const xml = encode(rooted(markup));
	const doc = parser.parseFromString(xml, 'application/xhtml+xml');
	const err = doc.querySelector('parsererror');
	if (err) {
		serial = serial || (serial = new XMLSerializer());
		markup = serial.serializeToString(doc.documentElement);
		markup = decode(unroot(markup));
	}
	return markup;
}
