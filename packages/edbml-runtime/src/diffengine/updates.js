/**
 * Defines a hard update. The entire DOM subtree of the element will be replaced
 * except all descendants with a declared `guid` will be substituted back again.
 * @param {string} guid
 * @returns {Object}
 */
export function hardupdate(guid) {
	return { type: 'hardupdate', guid };
}

/**
 * Defines an attribute update. Attributes will be updated yo.
 * @param {string} guid
 * @returns {Object}
 */
export function attsupdate(guid) {
	return { type: 'attsupdate', guid };
}

/**
 * Defines a "soft" update where nodes are removed, inserted or moved around
 * provided that 1) the parent has a `guid` and 2) all children have a `guid`.
 * Typical operations such as adding an item to a list can thus perform max.
 * @param {string} guid
 * @param {Node} oldn
 * @param {Node} newn
 * @returns {Object}
 */
export function softupdate(guid, oldn, newn) {
	return { type: 'softupdate', guid, operations: getoperations(oldn, newn) };
}

/**
 * Before scheduling a soft update, confirm that all new elements are indeed
 * new and not simply moved into the local node list from somewhere else in
 * the document (the system will in that case fall back to a `hardupdate`).
 * @param {Map<string, Element>} oids
 * @param {Element} oldn
 * @param {Element} newn
 * @returns {boolean}
 */
export function softqualify(oids, oldn, newn) {
	const { oldkids, newkids } = breakdown(oldn, newn);
	const moved = guid => oldkids.includes(guid);
	const isnew = guid => !oids.has(guid) || moved(guid);
	return newkids.every(isnew);
}

/**
 * @param {string} guid - guid for parent whose children are updated.
 * @param {Map<string, Element>} xids - Guid elements in real DOM
 * @param {Map<string, Element>} nids - Guid elements in new VDOM
 * @param {Array<Object>} operations
 */
export function updatesoft(guid, xids, nids, operations) {
	operations.forEach(op => executesoft(guid, xids, nids, op));
}

/**
 * TODO: Document members of the returned object here!
 * @param {Node} oldn
 * @param {Node} newn
 * @returns {Object}
 */
export function breakdown(oldn, newn) {
	const [oldkids, newkids] = [childguids(oldn), childguids(newn)];
	const [addlist, outlist] = [uniq(newkids, oldkids), uniq(oldkids, newkids)];
	const remains = uniq(oldkids, outlist);
	const results = remains.concat(newkids);
	return { oldkids, newkids, addlist, outlist, remains, results };
}

// Scoped ......................................................................

const uniq = (a1, a2) => a1.filter(e => !a2.includes(e));
const getguid = elm => elm.getAttribute('data-plastique-id');
const childguids = elm => Array.from(elm.children).map(getguid);

/**
 *
 */
const operations = (operation => ({
	remove: guid => operation('remove', guid),
	move: (guid, prev) => operation('move', guid, prev),
	insert: (guid, prev) => operation('insert', guid, prev)
}))((type, guid, prev) => ({ type, guid, prev }));

/**
 * @param {Node} oldn
 * @param {Node} newn
 * @returns {Array<Object>}
 */
function getoperations(oldn, newn) {
	const { newkids, addlist, outlist, remains } = breakdown(oldn, newn);
	return newkids.reduce(
		getreducer(remains, addlist),
		outlist.map(operations.remove)
	);
}

/**
 * @param {Array<string>} remains
 * @param {Array<string>} addlist
 * @returns {Function}
 */
function getreducer(remains, addlist) {
	return (ops, newguid, i) => {
		const oldguid = remains[i];
		const preguid = remains[i - 1];
		if (oldguid !== newguid) {
			remains.splice(i, 0, newguid);
			ops.push(
				addlist.includes(newguid)
					? operations.insert(newguid, preguid)
					: operations.move(newguid, preguid)
			);
		}
		return ops;
	};
}

/**
 * @param {string} parent
 * @param {Map<string, Element>} xids - Guid elements in real DOM
 * @param {Map<string, Element>} nids - Guid elements in new VDOM
 * @param {Object} operation
 * @returns {boolean}
 */
function executesoft(parent, xids, nids, { type, guid, prev }) {
	return executions[type](parent, guid, prev, xids, nids, guid);
}

/**
 * Methods to execute the soft operations (patch the diffs).
 * TODO: Sync the attributes :/
 * TODO: Use the Range object for these operations.
 */
const executions = (() => {
	/**
	 * @param {string} parent
	 * @param {string} guid
	 * @param {string} prev
	 * @param {Map<string, Element>} xids
	 */
	function remove(parent, guid, prev, xids) {
		// console.log('  remove', guid);
		xids.get(guid).remove();
	}

	/**
	 * @param {string} parent
	 * @param {string} guid
	 * @param {string} prev
	 * @param {Map<string, Element>} xids
	 */
	function move(parent, guid, prev, xids) {
		const oldnode = xids.get(guid);
		if (oldnode.parentNode === (parent = xids.get(parent))) {
			// console.log('  move', guid, 'before', prev);
			if (prev) {
				prev = xids.get(prev);
				parent.insertBefore(oldnode, prev.nextSibling);
			} else {
				parent.prepend(oldnode);
			}
		}
	}

	/**
	 * @param {string} parent
	 * @param {string} guid
	 * @param {string} prev
	 * @param {Map<string, Element>} xids
	 * @param {Map<string, Element>} nids
	 */
	function insert(parent, guid, prev, xids, nids) {
		parent = xids.get(parent);
		// console.log('  insert', guid, 'before', prev);
		const newnode = nids.get(guid);
		if (prev) {
			prev = xids.get(prev) || nids.get(prev);
			parent.insertBefore(newnode, prev.nextSibling);
		} else {
			parent.prepend(newnode);
		}
	}

	return { remove, move, insert };
})();
