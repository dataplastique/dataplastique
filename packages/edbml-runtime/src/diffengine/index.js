import { mapguids } from '@dataplastique/util';
import { updateevents } from './events';
import { snapshotbefore, restoreafter } from './focus';
import { removekids, replacenode, replacekids } from './mutate';
import { childnode, nextnode, childelm, nextelm } from './filter';
import {
	similar,
	samenode,
	samesize,
	samekids,
	sameguid,
	sameatts,
	allguids
} from './compare';
import {
	hardupdate,
	softupdate,
	attsupdate,
	updatesoft,
	softqualify,
	breakdown
} from './updates';

// TODO: Minimal textnode data change!

/**
 * @param {Element} root - The root element
 * @param {string} guid - The root `$id`
 * @param {Out} newout
 * @param {Out|null} oldout
 * @returns {Array<function>}
 */
export function getdiffs(root, guid, newout, oldout) {
	// console.log('DIFFING......................');
	const [ndoc, nids, nfun, doelm, dogui] = newout.toAspects(guid);
	const [odoc, oids, ofun] = oldout.toAspects(guid);
	return [
		...treediffs(root, guid, odoc, ndoc, oids, nids),
		...miscdiffs(root, guid, oids, nids, ofun, nfun, doelm, dogui)
	];
}

/**
 * @param {Element} root - The root element
 * @param {string} guid - The root guid
 * @param {Array<function>} diffs
 * @returns {Object} - TODO: More info!
 */
export function patchdiffs(root, guid, diffs) {
	// console.log('PATCHING......................');
	const log = Object.create(null);
	if (diffs.length) {
		const range = document.createRange();
		const focus = snapshotbefore(root);
		const guids = mapguids(root, guid);
		diffs.forEach(diff => diff(range, guids));
		restoreafter(root, focus);
		range.detach();
	}
	return log;
}

// Scoped ......................................................................

const asarray = alike => Array.from(alike),
	istype = (node, type) => node && node.nodeType === type,
	getatt = (elm, name) => (elm ? elm.getAttribute(name) : null),
	setatt = (elm, name, val) => elm.setAttribute(name, val),
	delatt = (elm, name) => elm.removeAttribute(name),
	hasatt = (elm, name) => (elm ? !!elm.hasAttribute(name) : false),
	getatts = elm => (iselm(elm) ? asarray(elm.attributes) : []),
	hasatts = elm => (elm ? !!elm.attributes.length : false),
	mapatts = elm => new Map(getatts(elm).map(att => [att.name, att.value])),
	submap = elm => new Map(asarray(elm.children).map(e => [getguid(e), e])),
	getguid = node => (iselm(node) ? getatt(node, 'data-plastique-id') : null),
	hasclass = elm => (elm ? !!elm.className : false),
	classes = elm => (elm ? elm.classList : null),
	iselm = node => istype(node, Node.ELEMENT_NODE),
	istext = node => istype(node, Node.TEXT_NODE),
	queryall = (css, ctx) => asarray(ctx.querySelectorAll(css)),
	queryone = (css, ctx) => ctx.querySelector(css),
	unique = (a1, a2) => a1.filter(e => !a2.includes(e));

// Diffing elements and attributes .............................................

/**
 * @param {Element} root - The root element
 * @param {string} guid - The root guid
 * @param {DocumentFragment} odoc - The old VDOM
 * @param {DocumentFragment} ndoc - The new VDOM
 * @param {Map<string, Element>} oids - Guid elements in old VDOM
 * @param {Map<string, Element>} nids - Guid elements in new VDOM
 * @returns {Array<Function>}
 */
function treediffs(root, guid, odoc, ndoc, oids, nids) {
	return oids.size > 1 && odoc.hasChildNodes()
		? do {
				const updates = trawl(oids, odoc, ndoc, guid);
				const reduced = reduce(updates, oids);
				const actions = getactions(oids, nids);
				compile(reduced, actions);
		  }
		: [
				range => {
					const olde = oids.get(guid);
					const newe = nids.get(guid);
					replacekids(range, root, newe);
					syncattribs(root, olde, newe);
				}
		  ];
}

/**
 * TODO: Offer the developer a chance to debug this array of
 * update objects before they all get converted to functions.
 * @param {Array<Object>} updates
 * @param {Object} actions
 * @returns {Array<Function>}
 */
function compile(updates, actions) {
	return updates.map(({ type, guid, operations }) => (range, xids) => {
		return actions[type](range, xids, guid, operations);
	});
}

/**
 * @param {Map<string, Element>} oids - All `guid` elements in old VDOM
 * @param {Node} oldn - Some node in the old VDOM
 * @param {Node} newn - Some node in the new VDOM, which could be different
 * @param {string} aguid - Last known `guid` as seen on an ancestor element
 * @param {string} pguid - The `guid` of the parent node, if there was one
 * @param {Array<Object>} [updates]
 * @returns {Array<Object>}
 */
function trawl(oids, oldn, newn, aguid, pguid, updates = []) {
	const [child, next, guid] = [childnode, nextnode, getguid];
	if (oldn || newn) {
		if (similar(oldn, newn)) {
			if (sameguid(oldn, newn) && !sameatts(oldn, newn)) {
				updates.push(attsupdate(guid(oldn)));
			}
			trawl(
				oids,
				child(oldn),
				child(newn),
				guid(oldn) || aguid,
				guid(oldn),
				updates
			);
			trawl(oids, next(oldn), next(newn), aguid, pguid, updates);
		} else if (pguid && sameguid(oldn, newn) && allguids(oldn, newn)) {
			if (softqualify(oids, oldn, newn)) {
				updates.push(
					softupdate(guid(oldn), oldn, newn),
					attsupdate(guid(oldn))
				);
				trawlon(oids, submap(oldn), submap(newn), updates);
			} else {
				updates.push(hardupdate(aguid), attsupdate(aguid));
			}
		} else {
			updates.push(hardupdate(aguid), attsupdate(aguid));
		}
	}
	return updates;
}

/**
 * TODO: Attsupdate!
 *
 * @param {Map<string, Element>} oids - Guid elements in old VDOM
 * @param {Map<string, Element>} oldmap
 * @param {Map<string, Element>} newmap
 * @param {Array<Object>} [updates]
 */
function trawlon(oids, oldmap, newmap, updates) {
	newmap.forEach((newn, guid) => {
		const oldn = oldmap.get(guid);
		if (oldn) {
			// updates.push(attsupdate(guid)); !!!!!!!!!!!!!!!!!!!!!!!!!!
			trawl(oids, childnode(oldn), childnode(newn), guid, guid, updates);
		}
	});
}

/**
 * The idea here is to igore updates to nodes inside a hardupdated DOM branch.
 * TODO: Clean this up and get a general idea about performance of `contains`.
 * @param {Array<Object>} updates
 * @param {Map<string, Element>} oids - Guid elements in old VDOM
 * @returns {Array<Function>}
 */
function reduce(updates, oids) {
	const elem = ({ guid }) => oids.get(guid);
	const hard = ({ type }) => type === 'hardupdate';
	const pass = n => h => h === n || !h.contains(n);
	const list = updates.filter(hard).map(elem);
	return updates.reduce((subset, update) => {
		if (list.every(pass(elem(update)))) {
			subset.push(update);
		}
		return subset;
	}, []);
}

/**
 * @param {Map<string, Element>} oids
 * @param {Map<string, Element>} nids
 * @returns {Object}
 */
function getactions(oids, nids) {
	/**
	 * @param {Range} range
	 * @param {Map<string, Element>} xids
	 * @param {string} guid
	 */
	function hardupdate(range, xids, guid) {
		const xelm = xids.get(guid);
		const olde = oids.get(guid);
		const newe = nids.get(guid);
		if (xelm) {
			patchstart(range, xelm, newe, oids, nids, xids);
		}
	}

	/**
	 * @param {Range} range
	 * @param {Map<string, Element>} xids
	 * @param {string} guid
	 */
	function attsupdate(range, xids, guid) {
		const xelm = xids.get(guid);
		const olde = oids.get(guid);
		const newe = nids.get(guid);
		if (xelm) {
			syncattribs(xelm, olde, newe);
		}
	}

	/**
	 * @param {Range} range
	 * @param {Map<string, Element>} xids
	 * @param {string} guid
	 * @param {Array<Object>} operations
	 */
	function softupdate(range, xids, guid, operations) {
		updatesoft(guid, xids, nids, operations);
	}

	return { hardupdate, attsupdate, softupdate };
}

// Diffing more stuff! .........................................................

function miscdiffs(root, guid, oids, nids, ofun, nfun, doelm, dogui) {
	return [
		(range, oldmap) => {
			const newmap = mapguids(root, guid);
			[
				...getcallbackdiffs(root, guid, ofun, nfun, oids, nids),
				...getsetandcall(root, guid, doelm, dogui)
			].forEach(diff => diff(newmap, oldmap));
		}
	];
}

// Diffing callbacks ...........................................................

/**
 * Remove old event callbaks and assign new callbacks.
 * @param {Element} root - The root element
 * @param {string} guid - The root guid
 * @param {Map<string, string>} ofun - Callbacks found in old VDOM
 * @param {Map<string, string>} nfun - Callbacks found in new VDOM
 * @param {Map<string, Element>} oids - Guid elements in old VDOM
 * @param {Map<string, Element>} nids - Guid elements in new VDOM
 * @returns {Array<function>}
 */
function getcallbackdiffs(root, guid, ofun, nfun, oids, nids) {
	return [
		(newmap, oldmap) => {
			updateevents(root, guid, ofun, nfun, oids, nids, newmap, oldmap);
		}
	];
}

/**
 * @param {Element} root - The root element
 * @param {string} guid - The root guid
 * @param {Map<string, Map<string, Function>>} doelm
 * @param {Map<string, Map<string, Function>>} dogui
 * @param {Map<string, Element>} nids - Guid elements in new VDOM
 * @returns {Array<Function>}
 */
function getsetandcall(root, guid, doelm, dogui) {
	const proplist = [...doelm.entries()];
	const calllist = [...dogui.entries()];
	const update = (newmap, [guid, action], iselm) => {
		const xelm = newmap.get(guid);
		iselm ? action(xelm) : console.warn('TODO: do:gui');
	};
	return [
		...proplist.map(up => newmap => update(newmap, up, true)),
		...calllist.map(up => newmap => update(newmap, up, false))
	];
}

// Patching elements ...........................................................

/**
 * TODO: Consider using a temporary document fragment for this operation.
 * @param {Range} range
 * @param {Element} xelm
 * @param {Element|DocumentFragment} newn
 * @param {Map<string, Element>} oids Guid elements in the old VDOM
 * @param {Map<string, Element>} nids Guid elements in the new VDOM
 * @param {Map<string, Element>} originals Guid elements in the real DOM
 */
function patchstart(range, xelm, newn, oids, nids, originals) {
	replacekids(range, xelm, newn, oids, nids, originals);
	restoreoriginals(range, xelm, oids, nids, originals);
}

/**
 * @param {Range} range
 * @param {Element|DocumentFragment} elm
 * @param {Map<string, Element>} oids Guid elements in the old VDOM
 * @param {Map<string, Element>} nids Guid elements in the new VDOM
 * @param {Map<string, Element>} originals Guid elements removed from real DOM
 */
function restoreoriginals(range, elm, oids, nids, originals) {
	const changelings = mapguids(elm);
	changelings.forEach((changeling, guid) => {
		if (originals.has(guid)) {
			const original = originals.get(guid);
			if (changeling !== original) {
				swapchangeling(range, changeling, original, oids, nids);
			}
		}
	});
}

/**
 * @param {Range} range
 * @param {Element} changeling
 * @param {Element} original
 * @param {Map<string, Element>} oids Guid elements in the old VDOM
 * @param {Map<string, Element>} nids Guid elements in the new VDOM
 */
function swapchangeling(range, changeling, original, oids, nids) {
	const guid = getguid(original);
	const olde = oids.get(guid);
	const newe = nids.get(guid);
	removekids(range, original);
	replacenode(changeling, original);
	replacekids(range, original, changeling);
	syncattribs(original, olde, newe);
}

// Patching attributes .........................................................

/**
 * Synchronize attributes.
 * @param {Element} elm The DOM element as seen on stage
 * @param {Element} oldn The equivalent element in old VDOM
 * @param {Element} newn The equivalent element in new VDOM
 */
function syncattribs(elm, oldn, newn) {
	if (hasatts(oldn) || hasatts(newn)) {
		const oatts = mapatts(oldn);
		const natts = mapatts(newn);
		const names = ['class', 'data-plastique-id'];
		const skips = name => names.some(n => name === n);
		natts.forEach((v, n) => (skips(n) ? void 0 : setatt(elm, n, v)));
		oatts.forEach(
			(v, n) => (skips(n) || natts.has(n) ? void 0 : delatt(elm, n))
		);
		if (hasclass(oldn) || hasclass(newn)) {
			syncclass(classes(elm), classes(oldn), classes(newn));
		}
	}
}

/**
 * Synchronize class list.
 * @param {ClassList} list current
 * @param {ClassList} olist before
 * @param {ClassList} nlist after
 */
function syncclass(list, olist, nlist) {
	const added = c => !olist || !olist.contains(c);
	const nuked = c => !nlist.contains(c);
	asarray(nlist)
		.filter(added)
		.forEach(c => list.add(c));
	if (olist) {
		asarray(olist)
			.filter(nuked)
			.forEach(c => list.remove(c));
	}
}
