/**
 * Normalize template. This basically means that we replace the `guid`
 * attribute with the (hardcoded for now) `data-plastique-id` attribute.
 * @param {HTMLTemplateElement} temp
 * @param {string} guid
 * @returns {HTMLTemplateElement}
 */
export function normalize(temp, guid) {
	const frag = temp.content;
	expand(first(frag), guid);
	return temp;
}

/**
 * Canonize template to always contain a root level `this` element.
 * @param {HTMLTemplateElement} temp
 * @param {string} guid
 * @returns {HTMLTemplateElement}
 */
export function canonize(temp, guid) {
	temp = normalize(temp, guid);
	rootguid(temp.content, guid);
	return temp;
}

// Scoped ......................................................................

const first = node => node.firstElementChild,
	next = node => node.nextElementSibling,
	iselm = node => node && node.nodeType === Node.ELEMENT_NODE,
	isroot = elm => iselm(elm) && elm.localName === 'this',
	newelm = name => document.createElement(name),
	append = (n1, n2) => n1.appendChild(n2),
	hasguid = elm => elm.hasAttribute('guid'),
	getguid = elm => elm.getAttribute('guid'),
	delguid = elm => elm.removeAttribute('guid');

/**
 * Replace all `guid` with `data-plastique-id`.
 * TODO: We do that in the EDBML `Parser.js` now, so skip this for performance?
 * @param {Element|null} elm
 * @param {string} guid The root guid
 */
function expand(elm, guid) {
	if (elm) {
		expand(first(elm), guid);
		expand(next(elm), guid);
		if (hasguid(elm)) {
			setguid(elm, guid, getguid(elm));
			delguid(elm);
		}
	}
}

/**
 * If the root element `this` doesn't exist, we'll go ahead and create it.
 * Assigning the root `guid` to the `this` element so that all attribute
 * and callback updates can be handled by the standard business logic
 * (the `this` element represents the spirits element, just to clarify).
 * @param {DocumentFragment} frag
 * @param {string} guid The root guid
 * @returns {DocumentFragment}
 */
function rootguid(frag, guid) {
	const root = first(frag);
	if (isroot(root)) {
		delguid(root);
		setguid(root, guid);
		return frag;
	} else {
		return rootguid(createroot(frag), guid);
	}
}

/**
 * Enclose fragment members in a root level element.
 * @param {DocumentFragment} frag
 * @returns {DocumentFragment}
 */
function createroot(frag) {
	let node;
	const root = newelm('this');
	while ((node = frag.firstChild)) {
		append(root, node);
	}
	append(frag, root);
	return frag;
}

/**
 * The `data-plastique-id` is a combo of the root guid and, if
 * the element is not the root element, the element guid itself.
 * @param {Element} elm
 * @param {string} rootguid The root (Spirit) guid
 * @param {string} elemguid The local element guid
 */
function setguid(elm, rootguid, elemguid) {
	elm.dataset.plastiqueId = rootguid + (elemguid ? `-${elemguid}` : '');
}
