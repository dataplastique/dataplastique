import SpiritPlugin from '../SpiritPlugin';
import Crawler from './Crawler';
import { Spirit } from '@dataplastique/gui';
import { Key } from '@dataplastique/util';
import { asarray } from '@dataplastique/util';
import { chained } from '@dataplastique/util';
import { Environment } from '@dataplastique/util';
import { typeOf, isString, isClass } from '@dataplastique/util';
import { isDefined, isFunction, isElement } from '@dataplastique/util';

// Hm - do we still want this?
const CLASS_HIDDEN = 'gui-hidden';

/**
 * Normalize something to element or textnode.
 * @param {*} thing
 * @returns {Element|Text}
 */
const normalize = thing =>
	Spirit.is(thing)
		? thing.element
		: thing && thing.nodeType
			? thing
			: textual(thing);

/**
 * Anything as textnode.
 * @param {*} thing
 * @returns {Text}
 */
const textual = thing => document.createTextNode(String(thing));

/**
 * DOM query and manipulation.
 * TODO: add `prependTo` method
 * TODO: https://stackoverflow.com/questions/31991235/sort-elements-by-document-order-in-javascript
 */
export default class DOMPlugin extends SpiritPlugin {
	/**
	 * Set or get element id.
	 * @param {string} [newid]
	 * @returns {string|DOMPlugin}
	 */

	@chained
	id(newid) {
		const elm = this.element;
		if (arguments.length) {
			elm.id = newid;
		} else {
			return elm.id;
		}
	}

	/**
	 * Get or set element title (tooltip).
	 * @param {string} [newtitle]
	 * @returns {string|DOMPlugin}
	 */
	@chained
	title(newtitle) {
		const elm = this.element;
		if (arguments.length) {
			elm.title = newtitle;
		} else {
			return elm.title;
		}
	}

	/**
	 * Get or set element markup.
	 * @param {string} [markup]
	 * @param {string} [position]
	 * @returns {string|DOMPlugin}
	 */
	@chained
	html(markup, position) {
		const elm = this.element;
		if (arguments.length) {
			DOMPlugin.html(elm, markup, position);
		} else {
			return DOMPlugin.html(elm);
		}
	}

	/**
	 * Get or set element outer markup.
	 * @param {string} [markup]
	 * @returns {string|DOMPlugin}
	 */
	@chained
	outerHtml(markup) {
		const elm = this.element;
		if (arguments.length) {
			DOMPlugin.outerHtml(elm, markup);
		} else {
			return DOMPlugin.outerHtml();
		}
	}

	/**
	 * Get or set element textContent.
	 * @param {string} [string]
	 * @returns {String|DOMPlugin}
	 */
	@chained
	text(value) {
		const elm = this.element;
		if (arguments.length) {
			DOMPlugin.text(elm, value);
		} else {
			return DOMPlugin.text(elm);
		}
	}

	/**
	 * Empty spirit subtree.
	 * @returns {DOMPlugin}
	 */
	@chained
	empty() {
		this.html('');
	}

	/**
	 * Mark spirit invisible.
	 * @returns {DOMPlugin}
	 */
	@chained
	hide() {
		this.spirit.css.add(CLASS_HIDDEN);
	}

	/**
	 * Mark spirit visible.
	 * @returns {DOMPlugin}
	 */
	@chained
	show() {
		this.spirit.css.remove(CLASS_HIDDEN);
	}

	/**
	 * Get spirit element tag.
	 * @returns {string}
	 */
	tag() {
		return this.element.localName;
	}

	/**
	 * Is positioned in page DOM? Otherwise plausible
	 * createElement or documentFragment scenario.
	 * @returns {boolean}
	 */
	embedded() {
		return DOMPlugin.embedded(this.element);
	}

	/**
	 * Removing this spirit from it's parent container. Note that this will
	 * schedule destruction of the spirit unless it gets reinserted somewhere.
	 * Also note that this method is called on the spirit, not on the parent.
	 * TODO: Investigate support for `element.remove()` nowadays...
	 */
	@chained
	remove() {
		let parent = this.element.parentNode;
		parent.removeChild(this.element);
	}

	/**
	 * Clone spirit element.
	 * @returns {Element}
	 */
	clone() {
		return this.element.cloneNode(true);
	}

	/**
	 * Get ordinal index of element.
	 * TODO: Support 'of-same-type' or something
	 * @returns {number}
	 */
	ordinal() {
		return DOMPlugin.ordinal(this.element);
	}

	/**
	 * Compare the DOM position of this spirit against something else.
	 * @see http://mdn.io/compareDocumentPosition
	 * @param {Element|Spirit} other
	 * @returns {number}
	 */
	compare(other) {
		return DOMPlugin.compare(this.element, other);
	}

	/**
	 * Contains other node or spirit?
	 * @param {Node|Spirit} other
	 * @returns {boolean}
	 */
	contains(other) {
		return DOMPlugin.contains(this.element, other);
	}

	/**
	 * Contained by other node or spirit?
	 * @param {Node|Spirit} other
	 * @returns {boolean}
	 */
	containedBy(other) {
		return DOMPlugin.contains(other, this.element);
	}

	/**
	 * @param {string} id
	 * @param {Class<Spirit>} [type]
	 * @returns {Element|Spirit}
	 */
	guid(id, type) {
		const rootguid = this.spirit.$id;
		const selector = `[data-plastique-id=${rootguid}-${id}]`;
		const expanded = arguments.length > 1;
		return expanded ? this.q(selector, type) : this.q(selector);
	}

	/**
	 * @param {Class<Spirit>} [type]
	 * @returns {Array<Element>|Array<Spirit>}
	 */
	guids(type) {
		const selector = '[data-plastique-id]';
		const expanded = arguments.length > 1;
		return expanded ? this.qall(selector, type) : this.qall(selector);
	}

	/**
	 * TODO: Some kind of `mapguids` method?
	 * @returns {Map<string, Element>}
	 */
	mapguids() {
		return new Map(this.guids().map(guid => {}));
	}

	/**
	 * Get first descendant element matching selector. Optional type argument returns
	 * spirit for first element to be associated to spirit of this type. Note that
	 * this may not be the first element to match the selector. Also note that type
	 * performs slower than betting on <code>Spirit.get(this.dom.q(selector))</code>
	 * @param {string} selector
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@query
	q(selector, type) {
		return DOMPlugin.q(this.element, selector, type);
	}

	/**
	 * Get list of all descendant elements that matches a selector. Optional type
	 * arguments returns instead all associated spirits to match the given type.
	 * @param {string} selector
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Array<Element|Spirit>}
	 */
	@query
	qall(selector, type) {
		return DOMPlugin.qall(this.element, selector, type);
	}

	/**
	 * Same as q, but scoped from the document root. Use wisely.
	 * @param {string} selector
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@query
	qdoc(selector, type) {
		return DOMPlugin.qdoc(selector, type);
	}

	/**
	 * Same as qall, but scoped from the document root. Use wisely.
	 * @param {string} selector
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Array<Element|Spirit>}
	 */
	@query
	qdocall(selector, type) {
		return DOMPlugin.qdocall(selector, type);
	}

	/**
	 * Next element or next spirit of given type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@lookup
	next(type) {
		let result = null;
		let spirit = null;
		let el = this.element;
		if (type) {
			while ((el = el.nextElementSibling) !== null) {
				if ((spirit = type.get(el))) {
					result = spirit;
					break;
				}
			}
		} else {
			result = el.nextElementSibling;
		}
		return result;
	}

	/**
	 * Previous element or previous spirit of given type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@lookup
	previous(type) {
		let result = null;
		let spirit = null;
		let el = this.element;
		if (type) {
			while ((el = el.previousElementSibling) !== null) {
				if ((spirit = type.get(el))) {
					result = spirit;
					break;
				}
			}
		} else {
			result = el.previousElementSibling;
		}
		return result;
	}

	/**
	 * First element or first spirit of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@lookup
	first(type) {
		let result = null;
		let spirit = null;
		let el = this.element.firstElementChild;
		if (type) {
			while (result === null && el !== null) {
				if ((spirit = type.get(el))) {
					result = spirit;
				}
				el = el.nextElementSibling;
			}
		} else {
			result = el;
		}
		return result;
	}

	/**
	 * Last element or last spirit of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@lookup
	last(type) {
		let result = null;
		let spirit = null;
		let el = this.element.lastElementChild;
		if (type) {
			while (result === null && el !== null) {
				spirit = type.get(el);
				if (spirit) {
					result = spirit;
				}
				el = el.previoustElementSibling;
			}
		} else {
			result = el;
		}
		return result;
	}

	/**
	 * Parent parent or parent spirit of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@lookup
	parent(type) {
		let spirit;
		let result = this.element.parentNode;
		if (type) {
			if ((spirit = type.get(result))) {
				result = spirit;
			} else {
				result = null;
			}
		}
		return result;
	}

	/**
	 * Child element or child spirit of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@lookup
	child(type) {
		let result = this.element.firstElementChild;
		if (type) {
			result = this.children(type)[0] || null;
		}
		return result;
	}

	/**
	 * Children elements or children spirits of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Array<Element|Spirit>}
	 */
	@lookup
	children(type) {
		let result = [...this.element.children];
		if (type) {
			result = result
				.filter(el => {
					return type.get(el);
				})
				.map(el => {
					return type.get(el);
				});
		}
		return result;
	}

	/**
	 * First ancestor element (parent!) or first ancestor spirit of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@lookup
	ancestor(type) {
		let result = this.parent();
		if (type) {
			result = null;
			new Crawler().ascend(this.element, {
				onspirit(spirit) {
					if (type.is(spirit)) {
						result = spirit;
						return Crawler.STOP;
					}
				}
			});
		}
		return result;
	}

	/**
	 * First ancestor elements or ancestor spirits of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Array<Element|Spirit>}
	 */
	@lookup
	ancestors(type) {
		let result = [];
		let crawler = new Crawler();
		if (type) {
			crawler.ascend(this.element, {
				onspirit(spirit) {
					if (type.is(spirit)) {
						result.push(spirit);
					}
				}
			});
		} else {
			crawler.ascend(this.element, {
				onelement(el) {
					result.push(el);
				}
			});
		}
		return result;
	}

	/**
	 * First descendant element or first descendant spirit of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Element|Spirit}
	 */
	@lookup
	descendant(type) {
		let result = this.child();
		let me = this.element;
		if (type) {
			new Crawler().descend(me, {
				onspirit(spirit) {
					if (type.is(spirit)) {
						if (spirit.element !== me) {
							result = spirit;
							return Crawler.STOP;
						}
					}
				}
			});
		}
		return result;
	}

	/**
	 * All descendant elements or all descendant spirits of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Array<Element|Spirit>}
	 */
	@lookup
	descendants(type) {
		let result = [];
		let me = this.element;
		new Crawler().descend(me, {
			onelement(element) {
				if (!type && element !== me) {
					result.push(element);
				}
			},
			onspirit(spirit) {
				if (type && type.is(spirit)) {
					if (spirit.element !== me) {
						result.push(spirit);
					}
				}
			}
		});
		return result;
	}

	/**
	 * Get following sibling elements or spirits of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Array<element|Spirit>}
	 */
	@lookup
	following(type) {
		let result = [];
		let spirit;
		let el = this.element;
		while ((el = el.nextElementSibling)) {
			if (type) {
				if ((spirit = type.get(el))) {
					result.push(spirit);
				}
			} else {
				result.push(el);
			}
		}
		return result;
	}

	/**
	 * Get preceding sibling elements or spirits of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Array<element|Spirit>}
	 */
	@lookup
	preceding(type) {
		let result = [];
		let spirit;
		let el = this.element;
		while ((el = el.previousElementSibling)) {
			if (type) {
				if ((spirit = type.get(el))) {
					result.push(spirit);
				}
			} else {
				result.push(el);
			}
		}
		return result;
	}

	/**
	 * Get sibling elements or spirits of type.
	 * @param {constructor} [type] Spirit constructor
	 * @returns {Array<element|Spirit>}
	 */
	@lookup
	siblings(type) {
		return this.preceding(type).concat(this.following(type));
	}

	/**
	 * Append spirit OR element OR array of either.
	 * @param {Object} things Complicated argument
	 * @returns {Object} Returns the argument
	 */
	@insert
	append(things) {
		let els = things;
		let element = this.element;
		els.forEach(el => {
			element.appendChild(el);
		});
		return things;
	}

	/**
	 * Prepend spirit OR element OR array of either.
	 * @param {Object} things Complicated argument
	 * @returns {Object} Returns the argument
	 */
	@insert
	prepend(things) {
		let els = things;
		let element = this.element;
		let first = element.firstChild;
		els.reverse().forEach(el => {
			element.insertBefore(el, first);
		});
		return things;
	}

	/**
	 * Insert spirit OR element OR array of either before this spirit.
	 * @param {Object} things Complicated argument
	 * @returns {Object} Returns the argument
	 */
	@insert
	before(things) {
		let els = things;
		let target = this.element;
		let parent = target.parentNode;
		els.reverse().forEach(el => {
			parent.insertBefore(el, target);
		});
		return things;
	}

	/**
	 * Insert spirit OR element OR array of either after this spirit.
	 * @param {Object} things Complicated argument
	 * @returns {Object} Returns the argument
	 */
	@insert
	after(things) {
		let els = things;
		let target = this.element;
		let parent = target.parentNode;
		els.forEach(el => {
			parent.insertBefore(el, target.nextSibling);
		});
		return things;
	}

	/**
	 * Replace the spirit with something else. This may nuke the spirit.
	 * Note that this method is called on the spirit, not on the parent.
	 * @param {Object} things Complicated argument.
	 * @returns {Object} Returns the argument
	 */
	@insert
	replace(things) {
		this.after(things);
		this.remove();
		return things;
	}

	/**
	 * Append spirit (element) to another spirit or element.
	 * @param {Element|Spirit} thing
	 * @returns {DOMPlugin}
	 */
	@insertme
	appendTo(thing) {
		thing.appendChild(this.element);
		return this;
	}

	/**
	 * Append spirit (element) as the first child of spirit or element.
	 * @param {Element|Spirit} thing
	 * @returns {DOMPlugin}
	 */
	@insertme
	prependTo(thing) {
		thing.parentNode.insertBefore(this.element, thing.firstChild);
		return this;
	}

	/**
	 * Insert spirit (element) before another spirit or element.
	 * @param {object} thing
	 * @returns {DOMPlugin}
	 */
	@insertme
	insertBefore(thing) {
		thing.parentNode.insertBefore(this.element, thing);
		return this;
	}

	/**
	 * Insert spirit (element) after another spirit or element.
	 * @param {Element|Spirit} thing
	 * @returns {DOMPlugin}
	 */
	@insertme
	insertAfter(thing) {
		thing.parentNode.insertBefore(this.element, thing.nextSibling);
		return this;
	}

	// Static ....................................................................

	/**
	 * Spiritual-aware innerHTML (WebKit first aid).
	 * @param {Element} elm
	 * @param {string} [markup]
	 * @param {string} [pos]
	 */
	@chained
	static html(elm, markup, pos) {
		if (arguments.length > 1) {
			if (pos) {
				return elm.insertAdjacentHTML(pos, markup);
			} else {
				elm.innerHTML = markup;
			}
		} else {
			return elm.innerHTML;
		}
	}

	/**
	 * Spiritual-aware outerHTML (WebKit first aid).
	 * TODO: deprecate and support 'replace' value for position?
	 * TODO: can outerHTML carry multiple root-nodes?
	 * @param {Element} elm
	 * @param {string} [markup]
	 */
	@chained
	static outerHtml(elm, markup) {
		if (arguments.length > 1) {
			elm.outerHTML = markup;
		} else {
			return elm.outerHTML;
		}
	}

	/**
	 * Spiritual-aware textContent (WebKit first aid).
	 * @param {Element} elm
	 * @param {string} [html]
	 * @param {string} [position]
	 */
	@chained
	static text(elm, value) {
		if (arguments.length > 1) {
			elm.textContent = value;
		} else {
			return elm.textContent;
		}
	}

	/**
	 * Get ordinal position of element within container.
	 * @param {Element} elm
	 * @returns {number}
	 */
	static ordinal(elm) {
		let result = 0;
		let parent = elm.parentNode;
		if (parent) {
			let node = parent.firstElementChild;
			while (node && node !== elm) {
				node = node.nextElementSibling;
				result++;
			}
		}
		return result;
	}

	/**
	 * Compare document position of two nodes.
	 *
	 * @param {Node|Spirit} node1
	 * @param {Node|Spirit} node2
	 * @returns {number}
	 */
	static compare(node1, node2) {
		node1 = normalize(node1);
		node2 = normalize(node2);
		return node1.compareDocumentPosition(node2);
	}

	/**
	 * Node contains other node?
	 * TODO: Just use `node.contains(othernode)` :)
	 * @param {Node|Spirit} node
	 * @param {Node|Spirit} othernode
	 * @returns {boolean}
	 */
	static contains(node, othernode) {
		let check =
			Node.DOCUMENT_POSITION_CONTAINS + Node.DOCUMENT_POSITION_PRECEDING;
		return this.compare(othernode, node) === check;
	}

	/**
	 * Other node is a following sibling to node?
	 * @param {Node|Spirit} node
	 * @param {Node|Spirit} othernode
	 * @returns {boolean}
	 */
	static follows(node, othernode) {
		return this.compare(othernode, node) === Node.DOCUMENT_POSITION_FOLLOWING;
	}

	/**
	 * Other node is a preceding sibling to node?
	 * @param {Node|Spirit} node
	 * @param {Node|Spirit} othernode
	 * @returns {boolean}
	 */
	static precedes(node, othernode) {
		return this.compare(othernode, node) === Node.DOCUMENT_POSITION_PRECEDING;
	}

	/**
	 * Is node positioned in page DOM?
	 * @param {Element|Spirit} node
	 * @returns {boolean}
	 */
	static embedded(node) {
		node = normalize(node);
		return this.contains(node.ownerDocument, node);
	}

	/**
	 * Remove from list all nodes that are contained by others.
	 * TODO: Move this to `spiritual-util` if not used nowhere.
	 * @param {Array<Element|Spirit>} nodes
	 * @returns {Array<Element|Spirit>}
	 */
	static group(nodes) {
		let node;
		let groups = [];
		const containedby = (target, others) => {
			return others.some(other => DOMPlugin.contains(other, target));
		};
		while ((node = nodes.pop())) {
			if (!containedby(node, nodes)) {
				groups.push(node);
			}
		}
		return groups;
	}

	/**
	 * Sort nodes in document order.
	 * @param {Array<Node>} nodes
	 * @returns {Array}
	 */
	static sort(nodes) {
		return nodes.sort(documentPositionComparator);
	}

	/**
	 * Get first element that matches a selector.
	 * Optional type argument filters to spirit of type.
	 * @param {Node} node
	 * @param {string} selector
	 * @param {constructor} [type]
	 * @returns {Element|Spirit}
	 */
	static q(node, selector, type) {
		let result = null;
		if (type) {
			result = this.qall(node, selector, type)[0] || null;
		} else {
			result = node.querySelector(selector);
		}
		return result;
	}

	/**
	 * Get list of all elements that matches a selector.
	 * Optional type argument filters to spirits of type.
	 * Method always returns a (potentially empty) array.
	 * @param {Node} node
	 * @param {string} selector
	 * @param {constructor} [type]
	 * @returns {Array<Element|Spirit>}
	 */
	static qall(node, selector, type) {
		let result = Array.from(node.querySelectorAll(selector));
		if (type) {
			const has = elm => !!type.get(elm);
			const get = elm => type.get(elm);
			result = result.filter(has).map(get);
		}
		return result;
	}

	/**
	 * Get first element in document that matches a selector.
	 * Optional type argument filters to spirit of type.
	 * @param {string} selector
	 * @param {constructor} [type]
	 * @returns {Element|Spirit}
	 */
	static qdoc(selector, type) {
		return this.q(document, selector, type);
	}

	/**
	 * Get list of all elements in document that matches a selector.
	 * Optional type argument filters to spirits of type.
	 * Method always returns a (potentially empty) array.
	 * @param {string} selector
	 * @param {constructor} [type]
	 * @returns {Array<Element|Spirit>}
	 */
	static qdocall(selector, type) {
		return this.qall(document, selector, type);
	}
}

// Scoped ......................................................................

const [FOLLOWING, PRECEDING, CONTAINS, CONTAINED_BY] = Environment.browser
	? [
			Node.DOCUMENT_POSITION_FOLLOWING,
			Node.DOCUMENT_POSITION_PRECEDING,
			Node.DOCUMENT_POSITION_CONTAINS,
			Node.DOCUMENT_POSITION_CONTAINED_BY
	  ]
	: [];

/**
 * https://stackoverflow.com/questions/31991235/sort-elements-by-document-order-in-javascript
 * @param {Node} a
 * @param {Node} b
 * @returns {Number}
 */
function documentPositionComparator(a, b) {
	const position = a.compareDocumentPosition(b);
	return a === b
		? 0
		: position & FOLLOWING || position & CONTAINED_BY
			? -1
			: position & PRECEDING || position & CONTAINS
				? 1
				: 0;
}

/**
 * DOM query methods accept a CSS selector and an optional spirit constructor
 * as arguments. They return a spirit, an element or an array of either.
 * @param {Object} target
 * @param {string} name
 * @param {Object} desc
 * @returns {Object}
 */
function query(target, name, desc) {
	const base = desc.value;
	desc.value = function() {
		let selector = arguments[0];
		let type = arguments[1];
		if (isString(selector)) {
			if (arguments.length === 1 || isClass(type)) {
				return base.apply(this, arguments);
			} else {
				throw new TypeError(
					`Unknown spirit for query ${name}: (${selector}, ${typeOf(type)})`
				);
			}
		} else {
			throw new TypeError(`Bad selector for query ${name}: ${selector}`);
		}
	};
	return desc;
}

/**
 * DOM lookup methods accept an optional spirit constructor as argument.
 * These methods return a spirit, an element or an array of either.
 * @param {Object} target
 * @param {string} name
 * @param {Object} desc
 * @returns {Object}
 */
function lookup(target, name, desc) {
	const base = desc.value;
	desc.value = function(type) {
		if (!isDefined(type) || isFunction(type)) {
			return base.apply(this, arguments);
		} else {
			throw new TypeError(
				`Unknown spirit for query ${name}: (${typeOf(type)})`
			);
		}
	};
	return desc;
}

/**
 * DOM insertion methods accept one argument: one spirit OR one element OR an array of either
 * or both. The input argument is returned as given, this allows for the following one-liner:
 * `this.something = this.dom.append(gui.SomeThingSpirit.summon()); // imagine 15 more`
 * TODO: Go for compliance with DOM4 method matches (something about textnoding string arguments)
 * TODO: Validate input either Spirit or element
 * TODO: DocumentFragment and friends :)
 * @param {Object} target
 * @param {string} name
 * @param {Object} desc
 * @returns {Object}
 */
function insert(target, name, desc) {
	const base = desc.value;
	desc.value = function(things) {
		let elms = asarray(things).map(normalize);
		if (elms.length) {
			base.call(this, elms);
		}
		return things;
	};
	return desc;
}

/**
 * Bonus DOM insertion methods takes an element or spirit as argument.
 * @param {Object} target
 * @param {string} name
 * @param {Object} desc
 * @returns {Object}
 */
function insertme(target, name, desc) {
	const base = desc.value;
	desc.value = function(thing) {
		thing = normalize(thing);
		if (isElement(thing)) {
			base.call(this, thing);
			return this;
		} else {
			throw new TypeError(`Expected spirit or element, got ${typeOf(thing)}`);
		}
	};
	return desc;
}
