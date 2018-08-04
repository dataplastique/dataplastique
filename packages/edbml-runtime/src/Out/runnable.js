import { fixtext, fixattr } from './fixes';

/**
 * @param {Object} state
 * @returns {Function}
 */
export function runnable({ markup }) {
	const elm = template(markup);
	const map = index(elm.content);
	return function run({ unsafe, others }) {
		resolve(map, unsafe);
		// return elm.cloneNode(true); nope, this nukes the `content` prop in Edge :/
		return template(elm.innerHTML); // instead, we will clone the template manually
	};
}

// Scoped ......................................................................

/**
 * Initially creates the `template` element with unresolved content.
 * TODO: Now also used to "clone" the template with resolved content because Edge
 * @param {string} markup
 * @returns {HTMLTemplateElement}
 */
function template(markup) {
	const elm = document.createElement('template');
	elm.innerHTML = markup;
	return elm;
}

/**
 * Mapping text and attribute nodes with dynamic value.
 * @param {Node} node
 * @param {Map} [map]
 * @returns {Map}
 */
function index(node, map = new Map()) {
	if (node) {
		index(node.firstChild, map);
		index(node.nextSibling, map);
		switch (node.nodeType) {
			case Node.TEXT_NODE:
				if (node.data.trim() !== '') {
					if (node.data.includes('{unsafe:')) {
						map.set(node, node.data);
					}
					/*
					if (others && node.data.includes('{node:')) {
						const frag = build(node, others);
						const elem = node.parentNode;
						elem.replaceChild(frag, node);
					}
					*/
				}
				break;
			case Node.ELEMENT_NODE:
				Array.from(node.attributes)
					.filter(att => att.value.includes('{unsafe:'))
					.forEach(att => map.set(att, att.value));
				break;
		}
	}
	return map;
}

/**
 * @param {Map<Node, string>} map
 * @param {Array} unsafe
 */
function resolve(map, unsafe) {
	map.forEach((data, node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			node.data = fixtext(data, unsafe);
		} else {
			node.value = fixattr(node.name, data, unsafe);
		}
	});
}

/**
 * @param {TextNode} node
 * @param {Array<sSpirit|Node|NodeList>} others
 * @returns {DocumentFragment}
 */
function build(node, others) {
	const frag = document.createDocumentFragment();
	const cuts = node.data.split(/{node:(\d+)}/);
	const elem = n => (n.isSpirit ? n.element : n);
	cuts.forEach(part => {
		// TODO: USE MODULUS!!!
		if (part.length) {
			const index = parseInt(part, 10);
			if (isNaN(index)) {
				frag.appendChild(document.createTextNode(part));
			} else {
				const other = others[index];
				frag.appendChild(elem(other));
			}
		}
	});
	return frag;
}
