import * as Store from './Store';
import {
	LIFE_ATTACH,
	LIFE_ENTER,
	LIFE_READY,
	LIFE_ASYNC,
	LIFE_DETACH,
	LIFE_EXORCIZE
} from './Const';

/**
 * @classdesc
 * Attempting to manage the spirit lifecycle as much as possible in a single file.
 */

/**
 * Construct spirit for element. Note that the spirits `onconstruct` call
 * will be performed by the {Model} class that the spirit extends from.
 * @param {Element} elm
 * @param {Class<Spirit>} SpiritC
 * @returns {Spirit}
 */
export function possess(elm, SpiritC) {
	const spirit = register(elm, SpiritC);
	return hackydecorator(spirit, SpiritC);
}

/**
 * Attach spirit for element.
 * @param {Spirit} spirit
 * @returns {Spirit}
 */
export function attach(spirit) {
	if (!spirit.life.attached) {
		spirit.life.attached = true;
		spirit.onattach();
		spirit.life.dispatch(LIFE_ATTACH);
		if (spirit.johnson && spirit.johnson.onattach) {
			spirit.johnson.onattach();
		}
	}
	return spirit;
}

/**
 * Enter spirit for element (attach for the first time).
 * @param {Spirit} spirit
 * @returns {Spirit}
 */
export function enter(spirit) {
	if (!spirit.life.entered) {
		spirit.life.entered = true;
		spirit.onenter();
		spirit.life.dispatch(LIFE_ENTER);
		if (spirit.johnson && spirit.johnson.onenter) {
			spirit.johnson.onenter();
		}
	}
	return spirit;
}

/**
 * Ready spirit for element.
 * @param {Spirit} spirit
 * @returns {Spirit}
 */
export function ready(spirit) {
	if (!spirit.life.ready) {
		spirit.life.ready = true;
		spirit.onready();
		spirit.life.dispatch(LIFE_READY);
		Store.applyDeferred(spirit);
	}
	return spirit;
}

/**
 * TODO!
 */
export function async() {
	// spirit.life.dispatch(LIFE_ASYNC);
}

/**
 * Detach spirit for element. This will also mark the spirit for
 * destruction unless it is reinserted more or less immediately.
 * @param {Spirit} spirit
 * @returns {Spirit}
 */
export function detach(spirit) {
	if (spirit.life.attached) {
		spirit.life.attached = false;
		spirit.ondetach();
		spirit.life.dispatch(LIFE_DETACH);
	}
	return spirit;
}

/**
 * TODO!
 */
export function exorcize() {
	console.warn('TODO: exorcize');
	// spirit.life.dispatch(DESTRUCT); // First!
}

/**
 * Attribute changed. We'll let the {AttPlugin} handle that so that
 * it can feel more in charge of things related to DOM attributes.
 * @param {Element} elm
 * @param {string} name
 * @param {string} oldval
 * @param {string} newval
 */
export function onatt(elm, name, oldval, newval) {
	console.error('TODO');
	// Store.get(elm).att.$onchange(name, oldval, newval);
}

/**
 * TODO: MOTE TO STORE!
 * Called by the {Store} when a headless spirit gets unassigned from the
 * element. Removing the `data-plastique-id` to make this fact apparent.
 * @param {Element} elm
 */
export function ondispose(elm) {
	Store.del(elm);
}

// Scoped ......................................................................

/**
 * Newup spirit and register to element.
 * @param {Element} elm
 * @param {Class<Spirit>} SpiritC
 * @returns {Spirit}
 */
function register(elm, SpiritC) {
	return Store.set(
		elm,
		new SpiritC({
			element: elm
		})
	);
}

/**
 * Run sketchy setup to support for the `@attribute` decorator.
 * TODO: Some kind of global lifecycle hook system so that we don't
 * have to hack support for the `@attribute` decorator in this file.
 * TODO: Setters should eval `onconstruct`, methods at `onready`!!!
 * @param {Spirit} spirit
 * @param {Class<Spirit>} SpiritC
 * @returns {Spirit}
 */
function hackydecorator(spirit, SpiritC) {
	const atts = SpiritC[Symbol.for('@dataplastique/attributes')];
	if (atts) {
		atts.forEach((desc, name) => {
			if (spirit.element.hasAttribute(name)) {
				const value = spirit.element.getAttribute(name);
				desc.set
					? desc.set.call(spirit, value)
					: desc.value.call(spirit, value);
			}
		});
	}
	return spirit;
}
