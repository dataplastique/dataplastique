/**
 * Mapping (root) element to Handler.
 * @type {WeakMap<Element, EventListener>}
 */
const handlers = new WeakMap();

/**
 * For elements that were removed in the DOM update, remove all assigned
 * listeners. For elements that remain, we only remove the listeners that
 * will not eventually be reassigned by method `newcalls` below.
 * TODO: Mechanism to flush the WeakMap when the `root` gets disconnected
 * @param {Element} root - The root element
 * @param {string} guid - The root guid (which may not be a real attribute)
 * @param {Map<string, Element>} ofun - Callbacks found in old VDOM
 * @param {Map<string, Element>} nfun - Callbacks found in new VDOM
 * @param {Map<string, Element>} oids - Guid elements in old VDOM
 * @param {Map<string, Element>} nids - Guid elements in new VDOM
 * @param {Map<string, Element>} nmap - Guid elements in new real DOM
 * @param {Map<string, Element>} omap - Guid elements in old real DOM
 */
export function updateevents(root, guid, ofun, nfun, oids, nids, nmap, omap) {
	let handler = handlers.get(root);
	if (handler) {
		removeevents(ofun, nfun, oids, nids, nmap, omap, handler);
		handler.map = nfun;
	} else {
		handler = new Handler(nfun, guid);
		handlers.set(root, handler);
	}
	addevents(nfun, nmap, handler);
}

// Scoped ......................................................................

/**
 * A handler to handle events.
 * @implements {EventListener}
 */
class Handler {
	map = null;
	constructor(map, guid) {
		this.map = map;
		this.guid = guid;
	}
	handleEvent(e) {
		const elem = e.currentTarget;
		const guid = elem.dataset.plastiqueId;
		const type = this.map.get(guid || this.guid);
		const func = type.get(e.type);
		if (func) {
			func.call(elem, e);
		}
	}
}

/**
 * For elements that were removed in the DOM update, remove all assigned
 * listeners. For elements that remain, we only remove the listeners that
 * will not eventually be reassigned by method `addevents` down below.
 * @param {Map<string, Element>} ofun - Callbacks found in old VDOM
 * @param {Map<string, Element>} nfun - Callbacks found in new VDOM
 * @param {Map<string, Element>} oids - Guid elements in old VDOM
 * @param {Map<string, Element>} nids - Guid elements in new VDOM
 * @param {Map<string, Element>} nmap - Guid elements in new real DOM
 * @param {Map<string, Element>} omap - Guid elements in old real DOM
 * @param {Handler} handler
 */
function removeevents(ofun, nfun, oids, nids, nmap, omap, handler) {
	omap.forEach((elm, guid) => {
		if (ofun.has(guid)) {
			const oats = ofun.get(guid);
			const nats = nfun.get(guid);
			const gone = !nmap.has(guid);
			oats.forEach((value, type) => {
				if (gone || (!nats || !nats.has(type))) {
					elm.removeEventListener(type, handler);
				}
			});
		}
	});
}

/**
 * When DOM updates are done, refresh and assign all the event listeners.
 * @param {Map<string, Element>} nfun - Callbacks found in new VDOM
 * @param {Map<string, Element>} nmap - Guid elements in new real DOM
 * @param {Handler} handler
 */
function addevents(nfun, nmap, handler) {
	nmap.forEach((elm, guid) => {
		if (nfun.has(guid)) {
			nfun.get(guid).forEach((func, type) => {
				elm.addEventListener(type, handler);
			});
		}
	});
}
