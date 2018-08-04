/**
 *
 */
export default class Slot {
	/**
	 * Slot name.
	 * @type {string}
	 */
	name = '';

	/**
	 * Nodes assigned to slot.
	 * @type {Array<Element>}
	 */
	nodes = null;

	/**
	 * @param {HTMLSlotElement} slot
	 * @param {HTMLElement} scope - the spirits own (root) element
	 */
	constructor(slot, scope) {
		Object.assign(this, {
			nodes: assignedNodes(slot, scope),
			name: slot.name
		});
	}
}

// Scoped ......................................................................

const connected = node => node.isConnected;
const camelcase = name => name.replace(/-([a-z])/g, g => g[1].toUpperCase());

/**
 * Of course, `slot.assignedNodes()` is also randomly empty in Chrome
 * for unknown reasons so we will throw in a patch for that as well :/
 * @param {HTMLSlotElement} slot
 * @param {Element} scope - the spirits own (root) element
 * @returns {Array<Element>}
 */
function assignedNodes(slot, scope) {
	return [...scope.children].filter(child => {
		return !slot.name || child.slot === name;
	});
}

/**
 * NOT USED: Perhaps use this to expose some kind of VDOM along with normal DOM?
 * @see https://github.com/nteract/vdom/blob/master/docs/spec.md
 * @param {Node} node
 * @returns {Object}
 */
function vdom({ nodeType, localName, childNodes, attributes, data }) {
	switch (nodeType) {
		case Node.TEXT_NODE:
			return data;
		case Node.ELEMENT_NODE:
			return {
				tagName: localName,
				element: arguments[0],
				children: Array.from(childNodes).map(vdom),
				attributes: Array.from(attributes).reduce((map, { name, value }) => {
					return Object.assign(map, {
						[camelcase(name)]: value
					});
				}, {})
			};
	}
}
