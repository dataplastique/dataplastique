import { children } from './filter';
import { Key } from '@dataplastique/util';

const iselm = node => node && node.nodeType === Node.ELEMENT_NODE,
	istext = node => node && node.nodeType === Node.TEXT_NODE,
	clean = string => (string ? Key.removeKeys(string, 'cb') : null),
	getatt = (node, name) => (iselm(node) ? node.getAttribute(name) : null),
	getatts = elm => (iselm(elm) ? Array.from(elm.attributes) : []),
	getguid = node => getatt(node, 'data-plastique-id'),
	subguids = elm => Array.from(elm.children).map(getguid),
	matchatt = (elm, att) => clean(getatt(elm, att.name)) === clean(att.value),
	compatts = (elm1, elm2) => getatts(elm1).every(att => matchatt(elm2, att)),
	sametype = (node1, node2) => node1.nodeType === node2.nodeType,
	samename = (elm1, elm2) => elm1.localName === elm2.localName,
	sametext = (txt1, txt2) => txt1.data === txt2.data,
	unique = (list1, list2) => list1.filter(entry => !list2.includes(entry)),
	nonulls = things => things.every(notnull),
	notnull = thing => thing !== null;

/**
 * @param {Node} oldn
 * @param {Node} newn
 * @returns {boolean}
 */
export function similar(oldn, newn) {
	return oldn && newn && samenode(oldn, newn)
		? istext(oldn) || (samesize(oldn, newn) && samekids(oldn, newn))
		: false;
}

/**
 * TODO: Purge this!
 * @param {Element} elm1
 * @param {Element} elm2
 * @returns {boolean}
 */
export function samesize(elm1, elm2) {
	return elm1.childNodes.length === elm2.childNodes.length;
}

/**
 * TODO: Rename this!
 * @param {Node} n1
 * @param {Node} n2
 * @returns {boolean}
 */
export function samenode(n1, n2) {
	return sametype(n1, n2)
		? iselm(n1)
			? samename(n1, n2) && getguid(n1)
				? sameguid(n1, n2)
				: sameatts(n1, n2)
			: sametext(n1, n2)
		: false;
}

/**
 * Direct children of two nodes appear to be similar?
 * @param {Element|DocumentFragment} node1
 * @param {Element|DocumentFragment} node2
 * @returns {boolean}
 */
export function samekids(node1, node2) {
	const [kids1, kids2] = [children(node1), children(node2)];
	return kids1.every((kid1, i) => samenode(kid1, kids2[i]));
}

/**
 * Same guid?
 * @param {Element} elm1
 * @param {Element} elm2
 * @returns {boolean}
 */
export function sameguid(elm1, elm2) {
	return getguid(elm1) === getguid(elm2);
}

/**
 * Same attributes?
 * @param {Element} elm1
 * @param {Element} elm2
 * @returns {boolean}
 */
export function sameatts(elm1, elm2) {
	return compatts(elm1, elm2) && compatts(elm2, elm1);
}

/**
 * TODO: Account for textnodes (should only be whitespace).
 * @param {Node} oldn
 * @param {Node} newn
 * @returns {boolean}
 */
export function allguids(oldn, newn) {
	return iselm(oldn) && iselm(newn)
		? do {
				const oldkids = subguids(oldn);
				const newkids = subguids(newn);
				nonulls(oldkids) && nonulls(newkids)
					? do {
							true;
							/*
							console.log('qualifies!');
							const addlist = unique(newkids, oldkids);
							const outlist = unique(oldkids, newkids);
							const thelist = oldkids.filter(
								guid => !addlist.includes(guid) && !outlist.includes(guid)
							);
							String(thelist) === String(oldkids);
							*/
					  }
					: false;
		  }
		: false;
}
