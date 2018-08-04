import Out from './Out/';
import { fixvalue } from './Out/fixes';
import { getdiffs, patchdiffs } from './diffengine/';

/**
 * Function to collects markup during EDBML rendering phase. It works like this:
 * When the initial EDBML function is called, it will render directly via this
 * function. All subsequent (nested) function calls will render indirectly via
 * another function. Only the first function (this function) has the ability to
 * produce the HTML result and this operation will also reset the whole setup.
 * This way, any public (exported) function can become the rendering entry point
 * even though they all have the same basic code structure.
 * @type {Function} - this function is refered to as `out` in the generated JS.
 */
let first = null;

/**
 * TODO: Make this stuff run in Node and Workers. Could JSDOM help us?
 * @param {Function} [defer]
 * @returns {Function}
 */
export function output() {
	return first ? nextout : (first = firstout());
}

/**
 * @param {Element} root - The root element
 * @param {string} guid - The root guid
 * @param {Out} newout
 * @param {Out|null} [oldout]
 * @returns {Array<function>}
 */
export function diff(root, guid, newout, oldout) {
	return getdiffs(root, guid, newout, oldout || new Out());
}

/**
 * TODO: Advanced render summary goes here!
 * @param {Element} root The root element
 * @param {string} guid The root guid
 * @param {Array<function>} diffs
 * @param {Map<string, Function>} calls
 * @returns {Object}
 */
export function patch(root, guid, diffs, calls) {
	return patchdiffs(root, guid, diffs, calls);
}

// Scoped ......................................................................

/**
 * Creates the entry point `out` to be used via some tagged template string.
 * @param {Function} [defer] - collecting callbacks for `on:click` type events.
 * @returns {Function}
 */
function firstout(defer) {
	let markup = '';
	let unsafe = [];
	let others = [];
	let defers = new Map();
	let bypass = new Set();
	function out(arg, ...args) {
		if (arguments.length) {
			markup += replace(arg, args, unsafe, others, bypass);
			bypass.clear();
		} else {
			return finalize(markup, unsafe, others, defers);
		}
	}
	return proxy(out, {
		defer: defer,
		blargh: dec => {
			bypass.add(dec);
			return dec;
		},
		guargh: val => {
			unsafe.push(val);
			return fixvalue(val, unsafe, others);
		},
		arrghs: fun => {
			const key = `cb${generatekey()}`;
			defers.set(key, fun);
			return key;
		}
	});
}

/**
 * Nested `out` will simply delegate to the entry point `out`
 * except nothing will happen when called without arguments.
 * @param {string} arg
 * @param {...string} args
 * @returns {string}
 */
const nextout = (function(out) {
	return proxy(out, {
		blargh: dec => (first ? first.blargh(dec) : ''),
		guargh: val => (first ? first.guargh(val) : ''),
		arrghs: fun => (first ? first.arrghs(fun) : '')
	});
})(function out(arg, ...args) {
	if (arguments.length) {
		first(...arguments);
	} else {
		return '';
	}
});

/**
 * @param {Function} out
 * @param {Object} expandos
 * @returns {Proxy}
 */
function proxy(out, expandos) {
	return new Proxy(Object.assign(out, expandos), Out);
}

/**
 * Passing the list of callbacks on to nested `out`.
 * TODO: This would make it possible to change them!
 * TODO: Could these be internalized in the {Out} ?
 * @param {Function} [defer]
 * @returns {Function}
 */
function passtonext(defer) {
	nextout.defer = first.defer;
	return nextout;
}

/**
 * Generate random key for historic reasons.
 * TODO: Attempt to simply increment counter.
 * @param {string} [fix]
 * @returns {string}
 */
function generatekey(fix = 'cb') {
	return String(Math.random()).slice(2, 11);
}

/**
 * The `defer` method is used for collecting callbacks for `on:click` statements
 * and stuff like that. The `ScriptPlugin` will usually set this up automatically,
 * but this plugin is not involved whenever the EDBML function is called directly
 * by the developer and so we will throw an exception if it is not implemented.
 * Note that this is only relevant if the function outputs inline event handlers.
 * @throws {Error}
 */
function nodefer() {
	throw new Error(
		`In order to support deferred callbakcs, the EDBML function 
		must be stamped with a method "defer()" before it is called.`
	);
}

/**
 * If `out` is used as a tagged template, we replace all these `${strings}`
 * with an intermediary value that can be evaluated for XSS safety later on.
 * If `oout` is called directly, we bypass this step and output the argument.
 * IDEA: ENABLE AND DISABLE `$att` PROXY STUFF WITHIN THIS METHOD (?)
 * @param {string|Array<string>} strings
 * @param {Array<string>} values
 * @param {Array<string>} unsafe
 * @param {Array<Node>} others
 * @param {Set<String>} bypass
 * @returns {string}
 */
function replace(strings, values, unsafe, others, bypass) {
	return Array.isArray(strings) && strings.raw
		? strings.raw.reduce((result, string, i) => {
				return result + string + johnson(values[i], unsafe, others, bypass);
		  }, '')
		: String(strings);
}

/**
 * @param {*} value
 * @param {Array<string>} unsafe
 * @param {Array<Node>} others
 * @param {Set<String>} bypass
 * @returns {string}
 */
function johnson(value, unsafe, others, bypass) {
	return bypass.has(value) && value.includes('=')
		? value
		: fixvalue(value, unsafe, others);
}

/**
 * Finally reset and return an {Out} which can be converted to HTML or DOM.
 * @param {string} markup
 * @param {Array} unsafe
 * @param {Array} others
 * @param {Map<string, Function>} defers
 * @returns {Out}
 */
function finalize(markup, unsafe, others, defers) {
	first = null;
	nextout.defer = null;
	return new Out(markup, unsafe, others, defers);
}
