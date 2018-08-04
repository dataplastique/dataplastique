const converter = new showdown.Converter({ simplifiedAutoLink: true });

/**
 * Convert Markdown to markup.
 * @param {string} markdown
 * @returns {string}
 */
export default function markup(markdown) {
	return converter.makeHtml(markdown || '');
}
