import Proto from './Proto';
import { Type } from '@dataplastique/util';
import { approximate, registerPlugin } from './proxy/ProxyFactory';

/**
 * Decorator to assign plugins for a Proto constructor (so a class decorator).
 * TODO: Support some `override` arg to bypass previous assignment to same key.
 * @param {string} key
 * @param {Class<Plugin>} PluginC
 * @returns {Function}
 */
export function plugin(key, PluginC) {
	return function plugged(ProtoC) {
		registerPlugin(ProtoC, key, PluginC);
	};
}

/**
 * Plugin.
 */
export default class Plugin extends Proto() {
	/**
	 * Plugins are by default not observable. Make sure to toggle this property
	 * if the plugins primary function is to store some kind of observable state.
	 * Also, the plugin cannot enforce type safety before this is toggled `true`,
	 * although this behavior should probably be controlled by a saparate flag.
	 * TODO: Separate flag!
	 * @type {boolean}
	 */
	get $observable() {
		return false;
	}

	/**
	 * @param {Object} [object]
	 * @returns {Proxy}
	 */
	constructor(object = Object.create(null)) {
		const proxy = approximate(super(), object);
		confirmhost(proxy, proxy.host);
		return proxy;
	}

	/**
	 * Identification.
	 * @type {String}
	 */
	get [Symbol.toStringTag]() {
		return 'Plugin';
	}

	/**
	 * More identification.
	 * @returns {string}
	 */
	toString() {
		return `[plugin ${this.constructor.name}]`;
	}

	// Static ....................................................................

	/**
	 * Return a constructor here to make the Plugin only accept this type of host.
	 * @returns {Class<Proto>|null} - use `null` to simply bypass this restriction
	 */
	static host() {
		return null;
	}

	/**
	 * Plugin is lazy? It will then not be instantiated until it is accessed.
	 * @returns {boolean} - If `false`, the Plugin is newed up with the host.
	 */
	static lazy() {
		return true;
	}

	/**
	 * Plugin type interface. Equivalent to `static model` on {Model} classes.
	 * Note that the plugin must be toggled `$observable` for this to work out.
	 * @param {IMap} map
	 * @returns {Imap|null}
	 */
	static plugin(map) {
		return null;
	}

	/**
	 * Framework internal.
	 * @param {IMap} map
	 * @returns {IMap|null}
	 */
	static [Symbol.for('@dataplastique/objectpipe')](map) {
		return this.plugin(...arguments);
	}

	/**
	 * Identification for ducks.
	 * @type {boolean}
	 */
	static get isPluginConstructor() {
		return true;
	}
}

// Scoped ......................................................................

/**
 * @param {Plugin} plugin
 * @param {Proto} inputhost
 * @throws {TypeError}
 * @returns {Proto}
 */
function confirmhost(plugin, inputhost) {
	const accepthost = plugin.constructor.host();
	return accepthost === null || accepthost.is(inputhost)
		? inputhost
		: badhost(plugin, accepthost, inputhost);
}

/**
 * @throws {TypeError}
 * @param {Plugin} plugin
 * @param {Constructor} accepthost
 * @param {*} inputhost
 */
function badhost(plugin, accepthost, inputhost) {
	throw new TypeError(
		`${plugin.constructor.name} 
		expected a ${accepthost.name} host, got: ${inputhost}`
	);
}
