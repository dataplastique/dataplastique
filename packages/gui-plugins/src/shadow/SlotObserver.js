import Slot from './Slot';

/**
 * @filedesc
 * There are numerous problems with the specification and implementation
 * of the `slotchange` event in various browsers, so we'll roll our own
 * implementation via Mutation Observers :/
 */

/**
 * Trigger fake `slotchange` callback initially and watch for future updates.
 * The real slotchange would fire at around when the `slot` element is first
 * rendered in the Shadow DOM but that doesn't quite live up to expectations.
 * @see https://github.com/whatwg/dom/issues/447
 * @param {ShadowPlugin} plugin
 * @returns {Function}
 */
export function observe(plugin) {
	const [slots, scope] = [new Set(), plugin.element];
	triggerslots(slots, plugin, [...scope.children]);
	return (observer => observer.disconnect())(
		getobserver(scope, record => {
			handlemutation(slots, plugin, record);
		})
	);
}

// Scoped ......................................................................

/**
 * Get MutationObserver for element associated to the plugins spirit.
 * We added support for attribute changes as a means to trigger the
 * `slotchange` events since the real spec would not account for this.
 * @param {Element} node
 * @param {Function} handle
 * @returns {MutationObserver}
 */
function getobserver(node, handle) {
	const obs = new MutationObserver(records => {
		records.forEach(handle);
	});
	obs.observe(node, {
		attributes: true,
		childList: true,
		subtree: true
	});
	return obs;
}

/**
 * Handle mutations to support virtual `slotchange`.
 * @param {Set<HTMLSlotElement>} slots
 * @param {ShadowPlugin} plugin
 * @param {MutationRecord} record
 */
function handlemutation(slots, plugin, record) {
	const { type, target, addedNodes, removedNodes } = record;
	const atts = type === 'attributes';
	const elms = atts ? [target] : [...addedNodes, ...removedNodes];
	triggerslots(slots, plugin, elms);
}

/**
 * Trigger fake `slotchange` event for mutated (or newly initialized) DOM.
 * Not sure what the spec would say, but we'll introduce the convention
 * that the unslotted DOM is always registered for a `slot` element with
 * no `name` attribute (if of course one such is found in the Shadow DOM).
 * @param {Set<HTMLSlotElement>} slots
 * @param {ShadowPlugin} plugin
 * @param {Array<Element>} elms
 */
function triggerslots(slots, plugin, elms) {
	const root = plugin.element;
	const isok = elm => elm.parentNode === root;
	const slot = elm => elm.hasAttribute('slot');
	const anon = plugin.q('slot:not([name])');
	const rest = elms.filter(isok).filter(slot);
	anon && registerchange(slots, plugin, anon);
	rest.length &&
		matchingslots(plugin, rest).forEach(slot => {
			registerchange(slots, plugin, slot);
		});
}

/**
 * Lookup `slot` elements in Shadow DOM to match mutated nodes in local DOM.
 * @param {ShadowPlugin} plugin
 * @param {Array<Element>} elms
 * @returns {Array<HTMLSlotElement>}
 */
function matchingslots(plugin, elms) {
	const nuked = node => !plugin.element.contains(node);
	const named = (names, { slot }) => names.concat(slot ? [slot] : []);
	const query = name => plugin.q(`slot[name=${name}]`);
	const exist = slot => !!slot;
	return [...elms.reduce(named, []).map(query)].filter(exist);
}

/**
 * Register mutation in local DOM that matches a slot in Shadow DOM.
 * TODO: `timeOut` takes too long, perhaps, but be careful with
 * microscheduling since the purpose here is to collect multiple
 * changes that might also have been microscheduled (by Angular,
 * typically, since it uses microscheduling for almost anything).
 * TODO: At least use the {TickPlugin} instead of `timeOut` to confirm
 * that the plugin is not destructed (and make TickPlugin check that!)
 * @param {Set<HTMLSlotElement>} slots
 * @param {ShadowPlugin} plugin
 * @param {HTMLSlotElement} slot
 */
function registerchange(slots, plugin, slot) {
	const was = slots.size;
	slots.add(slot);
	if (was === 0 && slots.size === 1) {
		schedule(slots, plugin);
	}
}

/**
 * Schedule to callback all accumulated slot update notifications.
 * TODO: `timeOut` might take too long, perhaps, but be careful with
 * microscheduling since the purpose here is to collect multiple
 * changes that might also have been microscheduled (by Angular,
 * typically, since it uses microscheduling for almost anything).
 * TODO: Confirm that the spirit is not destructed!
 * @param {Set<HTMLSlotElement>} slots
 * @param {ShadowPlugin} plugin
 */
function schedule(slots, { spirit, element }) {
	const callback = slot => spirit.onslot(new Slot(slot, element));
	setTimeout(() => {
		slots.forEach(callback);
		slots.clear();
	});
}
