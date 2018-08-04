/**
 * Tracking spirits by element.
 * @type {WeakMap<Element, Spirit>}
 */
const spirits = new WeakMap();

/**
 * @type {WeakMap<Element, Set<Function>>}
 */
const expects = new WeakMap();

/**
 * TODO: `dataset.plastiqueId` not reliable in Firefox, remove this all over!
 * TODO: This should be configurable, must read from the config.
 * @type {string}
 */
const ID = 'data-plastique-id';

/**
 * Register spirit for element.
 * @param {Element} elm
 * @param {Spirit} spirit
 * @returns {Spirit}
 */
export function set(elm, spirit) {
	spirits.set(elm, spirit);
	stamp(elm, spirit.$id);
	return spirit;
}

/**
 * Unregister spirit for element.
 * @param {Element} elm
 */
export function del(elm) {
	spirits.delete(elm);
	expects.delete(elm);
	stamp(elm, null);
}

/**
 * Get spirit for element.
 * @param {Element} elm
 * @param {Function} [cb]
 * @returns {Spirit}
 */
export function get(elm, cb) {
	cb = cb && typeof cb === 'function' ? cb : undefined;
	const spirit = stamped(elm) ? spirits.get(elm) || null : null;
	return cb ? applyOrDefer(spirit, elm, cb) : spirit;
}

/**
 * Element has spirit?
 * @param {Element} elm
 * @returns {boolean}
 */
export function has(elm) {
	return stamped(elm) && spirits.has(elm);
}

/**
 * Invoked after the spirits `onready` callback to evaluate whether
 * or not any callbacks has been registed for the spirits element.
 * @see {Cycle#ready}
 * @param {Spirit} spirit
 * @param {Element} elm
 */
export function applyDeferred(spirit, elm = spirit.element) {
	if (expects.has(elm)) {
		const cbs = expects.get(elm);
		expects.delete(elm);
		cbs.forEach(cb => cb(spirit));
	}
}

// Scoped ......................................................................

/**
 * Stamp the element with the spirit `$id` mostly so that the developer can
 * confirm that the spirit has been initialized. Note that the `data-plastique-id`
 * attribute will not always be identical to the spirit `$id` property (when for
 * example the element was created with the `data-plastique-id` in some EDBML).
 * @param {Element} elm
 * @param {string|null} guid
 */
function stamp(elm, guid) {
	guid
		? stamped(elm)
			? void 0
			: elm.setAttribute(ID, guid)
		: elm.removeAttribute(ID);
}

/**
 * Quickly test if element could be assoicated to
 * a spirit before we confirm it via the WeakMap.
 * @param {Element} elm
 * @returns {boolean}
 */
function stamped(elm) {
	return elm.hasAttribute(ID);
}

/**
 * @param {Spirit|null} spirit
 * @param {Element} elm
 * @param {Function} cb
 * @returns {Spirit|null}
 */
function applyOrDefer(spirit, elm, cb) {
	if (cb) {
		spirit
			? cb(spirit)
			: expects.has(elm)
				? expects.get(elm).add(cb)
				: expects.set(elm, new Set([cb]));
	}
	return spirit;
}
