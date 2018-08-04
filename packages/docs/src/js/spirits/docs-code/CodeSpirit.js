import edbml from './CodeSpirit.edbml.js';
import DocModel from '../../models/docs/DocModel';
import MDDocModel from '../../models/docs/MDDocModel';
import EDBMLDocModel from '../../models/docs/EDBMLDocModel';
import JSDocModel from '../../models/docs/JSDocModel';

/**
 * @param {Spirit} spirit
 * @param {ScriptPlugin} spirit.script
 * @param {IOPlugin} spirit.io
 * @param {DOMPlugin} spirit.dom
 * @param {Element} spirit.element
 * @returns {Object}
 */
export default function CodeSpirit({ script, io, dom, element }) {
	return {
		onattach() {
			script.load(edbml);
			io.on({ MDDocModel, EDBMLDocModel, JSDocModel }, doc => {
				script.run(doc);
			});
		},
		onrun() {
			element.scrollTop = 0;
			if (!lineart.done) {
				lineart(dom.q('.code code'));
			}
		}
	};
}

// Scoped ......................................................................

/**
 * Compute `background-image` for `span.indent` to render indent-level lines.
 * @param {HTMLCodeElement} code
 */
function lineart(code) {
	if (code) {
		addrule(getrule(getresolver(code)));
		lineart.done = true;
	}
}

/**
 * Get CSS declaration resolver.
 * @param {HTMLCodeElement} code
 * @returns {Function}
 */
function getresolver(code) {
	const props = getComputedStyle(code, null);
	const getit = name => props.getPropertyValue(name);
	return name => getit(name) || getit('-moz-' + name);
}

/**
 * Compute and inject CSS rule.
 * @param {Function} resolve
 * @returns {string}
 */
function getrule(resolve) {
	return `.indent, .code code:after { background: url("${draw(
		fontshorthand(resolve),
		decorationals(resolve)
	)}"); }`;
}

/**
 * Adding new CSS rule.
 * TODO: In theme sheet!
 * TODO: On theme change!
 * @param {string} rule
 */
function addrule(rule) {
	const sheet = document.styleSheets[0];
	sheet.insertRule(rule, sheet.cssRules.length);
}

/**
 * Draw the line art as Base64.
 * @param {string} font
 * @returns {string}
 */
function draw(font, [linecolor, tabsize]) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	context.font = font;
	(tabwidth => {
		canvas.height = 100;
		canvas.width = tabwidth * tabsize;
		context.fillStyle = linecolor;
		context.fillRect(0, 0, 1, 100);
	})(context.measureText('\t').width);
	return canvas.toDataURL('image/png');
}

/**
 * Resolve typography shorthand.
 * @param {Function} resolve
 * @returns {string}
 */
function fontshorthand(resolve) {
	return ['font-weight', 'font-style', 'font-size', 'font-family']
		.map(resolve)
		.join(' ');
}

/**
 * Resolve tab size and line color (`border-left-color`
 * has been hijacked to control the line art color).
 * @param {Function} resolve
 * @returns {Array<string>}
 */
function decorationals(resolve) {
	return ['border-left-color', 'tab-size'].map(resolve);
}
