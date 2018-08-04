/**
 * Remove element childnodes.
 * @param {Range} range
 * @param {Element} elm
 */
export function removekids(range, elm) {
	range.selectNodeContents(elm);
	range.deleteContents();
}

/**
 * Swap node with other node.
 * @param {Node} oldn The node to replace.
 * @param {Node} newn The node to insert.
 * @returns {Node} Returns the new node.
 */
export function replacenode(oldn, newn) {
	const parent = oldn.parentNode;
	parent.replaceChild(newn, oldn);
	return newn;
}

/**
 * Replace element childnodes with other childnodes.
 * @param {Range} range
 * @param {Element} elm
 * @param {Element} other
 */
export function replacekids(range, elm, other) {
	removekids(range, elm);
	range.selectNodeContents(other);
	elm.appendChild(range.extractContents());
}
