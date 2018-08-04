const istype = (node, type) => node && node.nodeType === type;
const istext = node => istype(node, Node.TEXT_NODE);
const iswhite = node => istext(node) && node.data.trim() === '';
const unwhite = node => !iswhite(node);

/**
 * Get first child node which is not a whitespace-only textnode.
 * (so to avoid triggering updates on simple formatting changes).
 * @param {Node} node
 * @returns {Node}
 */
export const childnode = node => (node ? purge(node.firstChild) : null);

/**
 * Get follwong sibling node which is not a whitespace-only textnode.
 * @param {Node} node
 * @returns {Node}
 */
export const nextnode = node => (node ? purge(node.nextSibling) : null);

/**
 * Get first element child, ignoring this whole whitespace issue.
 * @param {Element|DocumentFragment} node
 * @returns {Element}
 */
export const childelm = node => (node ? node.firstElementChild : null);

/**
 * Get following element sibling.
 * @param {Node} node
 * @returns {Element}
 */
export const nextelm = node => (node ? node.nextElementSibling : null);

/**
 * Get array of childnodes exluding whitespace-only textnodes.
 * @param {Element|DocumentFragment} node
 * @returns {Array<Node>}
 */
export const children = node => [...node.childNodes].filter(unwhite);

// Scoped ......................................................................

/**
 * Crawl the DOM until you find something other than a whitespace textnode.
 * @param {Node} n
 * @returns {Node}
 */
function purge(n) {
	return n && iswhite(n) ? purge(n.nextSibling) : iswhite(n) ? null : n;
}
