import { Mapping } from '@dataplastique/util';
import { chained } from '@dataplastique/util';
import { Tick } from '@dataplastique/util';
import { Environment } from '@dataplastique/util';
import { asarray } from '@dataplastique/util';

/**
 * Key.
 * TODO: Rename `add/remove` `on/off`
 * TODO: Broadcast global!
 */
export default class Key {
	/**
	 * @param {boolean} down
	 * @param {string} type
	 * @param {boolean} isglobal
	 */
	constructor(down, type, isglobal = false) {
		Object.assign(this, { down, type, isglobal }); // ...arguments ?
	}

	// Static ....................................................................

	/**
	 * Add handler for tick.
	 * @param {Object} type String or array of strings
	 * @param {Object} handler
	 * @returns {Constructor}
	 */
	@chained
	static add(type, handler) {
		add(type, handler);
	}

	/**
	 * Remove handler for tick.
	 * @param {Object} type String or array of strings
	 * @param {Object} handler
	 * @returns {Constructor}
	 */
	@chained
	static remove(type, handler) {
		remove(type, handler);
	}

	/**
	 * Add auto-removing handler for tick.
	 * @param {Object} type String or array of strings
	 * @param {Object} handler
	 * @returns {Constructor}
	 */
	@chained
	static one(type, handler) {
		add(type, handler, true);
	}
}

// Scoped ......................................................................

/**
 * @type {Map<string, Set<IKeyHandler>}
 */
const allhandlers = new Mapping();

/**
 * TODO!
 */
const onehandlers = new Mapping();

/**
 *
 */
const keymap = new Map();

/**
 * Mapping DOM0 key codes to some DOM3 key values.
 * Note that keycodes aren't used on an API level.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#key-values
 * TODO: AltGraph CapsLoc Fn FnLock Meta Process NumLock SymbolLock OS Compose
 */
const keys = new Map([
	// navigation
	[38, 'Up'],
	[40, 'Down'],
	[37, 'Left'],
	[39, 'Right'],
	// modifiers
	[18, 'Alt'],
	[17, 'Control'],
	[16, 'Shift'],
	[32, 'Space'],
	// extras
	[27, 'Esc'],
	[13, 'Enter']
]);

/**
 * Key modifiers.
 */
const mods = {
	shiftDown: false, // The Shift key
	ctrlDown: false, // The Control key.
	altDown: false, // The Alt key. On the Macintosh, this is the Option key
	metaDown: false, // The Meta key. On the Macintosh, this is the Command key.
	accelDown: false, // The key used for keyboard shortcuts on the user's platform. Usually, this would be the value you would use.
	accessDown: false // The access key for activating menus and other elements. On Windows, this is the Alt key, used in conjuction with an element's accesskey.
};

let keycode = 0;

/**
 * @param {string|Array<string>} type
 * @param {TickHandler} handler
 * @param {boolean} one
 */
function add(type, handler, one) {
	asarray(type).forEach(t => {
		allhandlers.add(t, handler);
		if (one) {
			onehandlers.add(t, handler);
		}
	});
	if (allhandlers.size === 1) {
		listen(true);
	}
}

/**
 * @param {string|Array<string>} type
 * @param {TickHandler} handler
 */
function remove(type, handler) {
	asarray(type).forEach(t => {
		allhandlers.remove(type, handler);
		onehandlers.remove(type, handler);
	});
	if (allhandlers.size === 0) {
		listen(false);
	}
}

/**
 * @param {boolean} on
 */
function listen(on) {
	if (Environment.browser) {
		['keydown', 'keypress', 'keyup'].forEach(type => {
			const args = [type, handleKey]; // TODO: capture true!
			if (on) {
				document.addEventListener(...args);
			} else {
				document.removeEventListener(...args);
			}
		});
	}
}

/**
 * Handle key event.
 * @param {KeyEvent} e
 */
function handleKey(e) {
	let n = e.keyCode;
	let c = keymap.get(n);
	let b = 'BROADCAST_KEYEVENT';
	switch (e.type) {
		case 'keydown':
			if (c === undefined) {
				keycode = n;
				keymap.set(n, String.fromCharCode(e.which).toLowerCase());
				Tick.next(() => {
					c = keymap.get(n);
					update(true, null, c, n);
					keycode = null;
				});
			}
			break;
		case 'keypress':
			if (keycode) {
				c = keychar(e.keyCode, e.charCode, e.which);
				keymap.set(keycode, c);
			}
			break;
		case 'keyup':
			if (c !== undefined) {
				update(false, null, c, n);
				keymap.delete(n);
			}
			break;
	}
}

/**
 * Get character for event details on keypress only.
 * Returns null for special keys such as arrows etc.
 * http://javascript.info/tutorial/keyboard-events
 * @param {number} n
 * @param {number} c
 * @param {number} which
 * @returns {String}
 */
function keychar(n, c, which) {
	if (which === null || which === undefined) {
		return String.fromCharCode(n); // IE (below 9 or what?)
	} else if (which !== 0 && c) {
		// c != 0
		return String.fromCharCode(which); // the rest
	}
	return null;
}

/**
 * @param {boolean} down
 * @param {String} key Newschool ABORTED FOR NOW!
 * @param {String} c (char) Bothschool
 * @param {number} code Oldschool
 */
function update(down, key, c, code) {
	const type = keys.get(code) || c;
	const all = allhandlers;
	const one = onehandlers;
	if (all.has(type)) {
		const k = new Key(down, type); // TODO: pool this!
		all
			.toArray(type)
			.filter(handler => {
				handler.onkey(k);
				return one.has(type, handler);
			})
			.forEach(handler => {
				all.remove(type, handler);
				one.remove(type, handler);
			});
	}
}
