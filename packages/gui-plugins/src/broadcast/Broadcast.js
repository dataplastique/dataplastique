import {
	Mapping,
	isComplex,
	isFunction,
	asarray,
	chained
} from '@dataplastique/util';

/**
 * Broadcast.
 * TODO: Rename `add/remove` `on/off`
 * TODO: Move to `dataplastique-util` project (sans global stuff)
 * TODO: Support array arguments (batched broadcasts).
 * TODO: Pool broadcasts.
 */
export default class Broadcast {
	/**
	 * Use static methods `dispatch` and `dispatchGlobal` to create broadcasts.
	 * @param {string} type
	 * @param {Object} [data]
	 * @param {boolean} [isglobal]
	 */
	constructor(type, data = null, isglobal = false) {
		/**
		 * Broadcast type.
		 * @type {string}
		 */
		this.type = type;

		/**
		 * Broadcast data.
		 * @type {Object}
		 */
		this.data = data;

		/**
		 * Global broadcast?
		 * @type {boolean}
		 */
		this.global = isglobal;
	}

	/**
	 * Subscribe handler to type.
	 * @param {string|Array<string>} type
	 * @param {object|constructor} handler
	 * @returns {Constructor}
	 */
	@chained
	static add(type, handler) {
		add(type, handler);
	}

	/**
	 * Unsubscribe handler from broadcast.
	 * @param {string|Array<string>} type
	 * @param {object|constructor} handler
	 * @returns {Constructor}
	 */
	@chained
	static remove(type, handler) {
		remove(type, handler);
	}

	/**
	 * Subscribe handler to type globally.
	 * @param {string|Array<string>} type
	 * @param {object|constructor} handler
	 * @returns {Constructor}
	 */
	@chained
	static addGlobal(type, handler) {
		add(type, handler, true);
	}

	/**
	 * Unsubscribe handler from global broadcast.
	 * @param {string|Array<string>} type
	 * @param {object|constructor} handler
	 * @returns {Constructor}
	 */
	@chained
	static removeGlobal(type, handler) {
		remove(type, handler, true);
	}

	/**
	 * Publish broadcast in local scope (this window).
	 * TODO: queue for incoming dispatch (finish current type first).
	 * @param {string} type
	 * @param {Object} data
	 */
	@chained
	static dispatch(type, data) {
		dispatch(type, data, false);
	}

	/**
	 * Dispatch broadcast in global scope (all windows).
	 * TODO: queue for incoming dispatch (finish current first).
	 * TODO: Handle remote domain iframes ;)
	 * @param {string} type
	 * @param {Object} data
	 * @returns {gui.Broadcast}
	 */
	@chained
	static dispatchGlobal(type, data) {
		dispatch(type, data, true);
	}
}

// Scoped ......................................................................

const PREFIX = '@dataplastique/broadcast:';
const LOCALS = new Mapping();
const GLOBALS = new Mapping();

/**
 * Subscribe handler to type(s).
 * confirmed('array|string', 'object|function')
 * @param {Array<string>|string} type
 * @param {IBroadcastHandler} handler
 * @param {boolan} isglobal
 */
function add(type, handler, isglobal) {
	let handlers = isglobal ? GLOBALS : LOCALS;
	asarray(type, t => handlers.add(t, handler));
}

/**
 * @param {Array<string>|string} type
 * @param {IBroadcastHandler} handler
 * @param {boolan} isglobal
 */
function remove(type, handler, isglobal) {
	let handlers = isglobal ? GLOBALS : LOCALS;
	asarray(type, t => handlers.remove(t, handler));
}

/**
 * Dispatch broadcast.
 * TODO: cache broadcasts while booting and redispatch on bootstrap done.
 * @param {string|Array<string>} type
 * @param {*} data
 * @param {boolan} isglobal
 */
function dispatch(type, data, isglobal) {
	asarray(type, t => {
		let b = new Broadcast(t, data, isglobal);
		let handlers = isglobal ? GLOBALS : LOCALS;
		if (handlers.has(t)) {
			handlers.toArray(t).forEach(handler => {
				handler.onbroadcast(b);
			});
		}
		if (isglobal) {
			propagate(b);
		}
	});
}

/**
 * @param {Broadcast} b
 */
function propagate(b) {
	//console.error('TODO: Broadcast global');
}

/**
 * Encode broadcast to be posted xdomain.
 * TODO: IE9 is gone, so we can post non-string stuff nowadays
 * @param {Broacast} b
 * @returns {string}
 */
function stringify(b) {
	return (
		PREFIX +
		(function() {
			b.data = (function(d) {
				if (isComplex(d)) {
					if (isFunction(d.stringify)) {
						d = d.stringify();
					} else {
						try {
							JSON.stringify(d);
						} catch (jsonexception) {
							d = null;
						}
					}
				}
				return d;
			})(b.data);
			return JSON.stringify(b);
		})()
	);
}

/**
 * Decode broadcast posted from xdomain and return a broadcast-like object.
 * @param {string} msg
 * @returns {Object}
 */
function parse(msg) {
	if (msg.startsWith(PREFIX)) {
		return JSON.parse(msg.split(PREFIX)[1]);
	}
}
