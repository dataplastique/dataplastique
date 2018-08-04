import { has as hasspirit, get as getspirit } from './Store';
import { possess, attach, enter, ready, detach, exorcize } from './Cycle';
import { DATA_PLASTIQUE_ID, EVENT_ATTRIBUTE_CHANGED } from './Const';

/**
 * @type {Map<string, Class<Spirit>}
 */
const channelings = new Map();

/**
 * @param {string} tag
 * @param {Class<Spirit>} SpiritC
 */
export function channel(tag, SpiritC) {
	channelings.set(tag, SpiritC);
}

/**
 * TODO: Spawn with parameter tagname (and assign the `is` attribute).
 * @param {Class<Spirit>} SpiritC
 * @returns {Spirit}
 */
export function spawn(SpiritC) {
	const tag = gettag(SpiritC);
	if (tag) {
		return possess(document.createElement(tag), SpiritC);
	} else {
		throw new Error(`${SpiritC.name} has not been channeled`);
	}
}

/**
 * Boot the shebang.
 * @param {Node} root
 * @returns {Node}
 */
export function bootstrap(root = document) {
	startobserver(root);
	treeupdate([root]);
	return root;
}

// Scoped ......................................................................

const iselm = node => node.nodeType === Node.ELEMENT_NODE,
	entries = () => Array.from(channelings.entries()),
	specialtag = elm => elm.localName.includes('-'),
	special = elm => specialtag(elm) || elm.hasAttribute('is'),
	channeltag = elm => elm.getAttribute('is') || elm.localName,
	channeled = elm => iselm(elm) && special(elm) && haschanneling(elm),
	haschanneling = elm => channelings.has(channeltag(elm)),
	getchanneling = elm => channelings.get(channeltag(elm)),
	elements = nodes => Array.from(nodes).filter(iselm),
	headless = added => spirit => !added.includes(spirit.element),
	possession = elm => getspirit(elm) || possess(elm, getchanneling(elm));

/**
 * @param {Node} node
 */
function startobserver(node) {
	const handler = list => list.forEach(handle);
	new MutationObserver(handler).observe(node, {
		attributeOldValue: true,
		attributes: true,
		childList: true,
		subtree: true
	});
}

/**
 * Handle mutations.
 * @param {MutationRecord} record
 * @using {NodeList} addedNodes
 * @using {NodeList} removedNodes
 */
function handle({
	type,
	target,
	addedNodes,
	removedNodes,
	attributeName,
	oldValue
}) {
	type === 'childList'
		? treeupdate(elements(addedNodes), elements(removedNodes))
		: attsupdate(target, attributeName, oldValue);
}

/**
 * Exorcize removed spirits and spiritualize added elements.
 * @param {Array<Element>} added
 * @param {Array<Element>} [removed]
 */
function treeupdate(added, removed = []) {
	collectall(removed)
		.filter(hasspirit)
		.map(getspirit)
		.map(detach)
		.filter(headless(added))
		.forEach(exorcize);
	collectall(added)
		.map(possession)
		.map(attach)
		.map(enter)
		.reverse()
		.map(ready);
}

/**
 * Attribute changes are interesting for entities that will evolve much later
 * in the ecosystem and so we will avoid hard and circular dependencies here
 * by dispatching the attribute update information via a regular DOM event.
 * @param {Element} target
 * @param {string} name
 * @param {string} oldval
 * @param {string} newval
 */
function attsupdate(target, name, oldval, newval = target.getAttribute(name)) {
	if (hasspirit(target) && name !== DATA_PLASTIQUE_ID) {
		target.dispatchEvent(
			new CustomEvent(EVENT_ATTRIBUTE_CHANGED, {
				detail: { name, oldval, newval },
				bubbles: false
			})
		);
	}
}

/**
 * Collect all elements with existing or potential spirits.
 * @param {Array<Element>} elms
 * @returns {Array<Element>}
 */
function collectall(elms) {
	return elms.reduce((all, elm) => all.concat(collect(elm)), []);
}

/**
 * Find in subtree all elements that should be or could already be possessed.
 * @param {Element} elm
 * @param {Array<Spirit>} [all]
 * @returns {Array<Spirit>}
 */
function collect(elm, all = []) {
	if (elm) {
		channeled(elm) ? all.push(elm) : void 0;
		collect(elm.firstElementChild, all);
		collect(elm.nextElementSibling, all);
	}
	return all;
}

/**
 * Get tag for possessor (get key for value).
 * @param {Class<Spirit>} SpiritC
 * @returns {string}
 */
function gettag(SpiritC) {
	return entries().reduce((result, [tag, klass]) => {
		return result || (klass === SpiritC ? tag : null);
	}, null);
}
