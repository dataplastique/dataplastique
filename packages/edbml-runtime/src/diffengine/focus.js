/**
 * Get the focused element, either by element reference or by selector
 * scoped from the root element. Since the first option is less error
 * prone, it is advised to always fit focusable elements with a `guid`.
 * @param {Element|ShadowRoot} root
 * @returns {Element|string}
 */
export function snapshotbefore(root) {
	const elm = root.activeElement || document.activeElement;
	if (elm && root.contains(elm)) {
		return elm.dataset.plastiqueId ? elm : selector(root, elm);
	}
}

/**
 * Restore the focus while noting that the patch operation might have changed
 * the DOM in such a way that a CSS selector will now target the wrong element.
 * We supress potential `onfocus` event listeners since they were most likely
 * intended for user instigated focus. TODO: Restore selection range!!!
 * @param {Element|ShadowRoot} root
 * @param {Element|string} elm
 */
export function restoreafter(root, elm) {
	const now = root.activeElement || document.activeElement;
	if (elm && (elm = elm.nodeType ? elm : root.querySelector(elm))) {
		if (root.contains(elm) && elm !== now) {
			elm.focus();
		}
	}
}

// Scoped ......................................................................

/**
 * Compute selector for focused element.
 * @param {Element|ShadowRoot} root
 * @param {Element} elm
 * @returns {string}
 */
function selector(root, elm) {
	const parts = [];
	const [ELEM, FRAG] = [Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE];
	while (elm && (elm.nodeType === ELEM || elm.nodeType === FRAG)) {
		if (elm.id) {
			parts.push('#' + elm.id);
			elm = null;
		} else {
			if (elm === root) {
				parts.push(':scope ');
				elm = null;
			} else {
				parts.push(` > ${elm.localName}:nth-child(${ordinal(elm)})`);
				elm = elm.parentNode;
			}
		}
	}
	return parts.reverse().join('');
}

/**
 * Get ordinal position of element within container. The index is
 * one-based (and not zero-based) to conform with CSS conventions.
 * Note: Bugs fixed here should be synchronized with {DOMPlugin}.
 * @param {Element} elm
 * @returns {number}
 */
function ordinal(elm) {
	let result = 1;
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
 * TODO: Something like this to supress `blur` and `focus` events during update?
 * @param {string} type
 * @param {Element} elm
 * @returns {Element}
 */
function silently(type, elm) {
	const cb = e => e.stopPropagation();
	elm.addEventListener(type, cb, true);
	elm[type]();
	elm.removeEventListener(type, cb, true);
	return elm;
}
