import { typeOf } from '@dataplastique/util';
import { Class } from '@dataplastique/util';
import { getPlugins, getProxy } from '../target/Target';

/**
 * @filedesc
 * Plugins management studio.
 */

/**
 * Assign plugin to property name.
 * TODO: Support register to instance!
 * @param {Class<Proto>|Proto} what
 * @param {string} name
 * @param {Class<Plugin>} PluginC
 * @param {boolean} [override]
 */
export function register(what, name, PluginC, override) {
	if (true) {
		registerToClass(...arguments);
	} else {
		registerToInstance(...arguments);
	}
}

/**
 * Initialize plugins for instance.
 * @param {Proto} target
 */
export function init(target) {
	initPlugins(target, target.constructor);
}

/**
 * Lookup plugin assigned to property name, if indeed it is.
 * @param {Class<Proto>} ProtoC
 * @param {string} name
 * @returns {Class<Plugin>|null}
 */
export function find(ProtoC, name) {
	return lookupPlugin(ProtoC, name);
}

/**
 * Target class has plugin assigned to property name?
 * @param {Proto} target
 * @param {string} name
 * @returns {boolean}
 */
export function has(target, name) {
	return !!lookupPlugin(target.constructor, name);
}

/**
 * Dispose target plugins.
 * @param {Proto} target
 */
export function dispose(target) {
	const map = getPlugins(target);
	if (map) {
		map.forEach(plugin => {
			plugin.dispose();
		});
	}
}

// Scoped ......................................................................

/**
 * Tracking names and plugins for various classes.
 * TODO: Remove traces of old getter-and-setter logic.
 * @type {Map<Class<Proto>, Map<string, Class<Plugin>>}
 */
const registry = new Map();

/**
 * Assign plugin to class.
 * @param {Class<Proto>} ProtoC
 * @param {string} name
 * @param {Class<Plugin>} PluginC
 * @param {boolean} [override]
 */
function registerToClass(ProtoC, name, PluginC, override) {
	const Plugin = lookupPlugin(ProtoC, name);
	const map = registry;
	if (Plugin && !override) {
		overrideError(Plugin, name);
	} else {
		if (!map.has(ProtoC)) {
			map.set(ProtoC, new Map());
		}
		map.get(ProtoC).set(name, PluginC);
		defineSetter(ProtoC, name, PluginC);
	}
}

/**
 * TODO: Assign plugin to instance.
 * @param {Proto} proto
 * @param {string} name
 * @param {Class<Plugin>} PluginC
 * @param {boolean} [override]
 */
function registerToInstance(proto, name, PluginC, override) {
	console.error('TODO');
}

/**
 * Define the getter so that it instantiates the plugin on initial access.
 * @param {Class<Proto>} ProtoC
 * @param {string} name
 * @param {Class<Plugin>} PluginC
 */
function defineSetter(ProtoC, name, PluginC) {
	Reflect.defineProperty(ProtoC.prototype, name, {
		configurable: true,
		enumarable: false,
		get() {
			const target = getProxy(this) || this;
			const plugin = new PluginC({ host: target });
			getPlugins(this).set(name, plugin);
			Reflect.defineProperty(this, name, {
				configurable: false,
				enumarable: false,
				writable: false,
				value: plugin
			});
			return plugin;
		}
	});
}

/**
 * Lookup plugins assigned to class, recursively crawling up
 * the class hierarchy. If plugins are not lazy, new them up.
 * @param {Proto} target
 * @param {Class<Proto>} ProtoC
 */
function initPlugins(target, ProtoC) {
	const plugins = registry.get(ProtoC);
	if (plugins) {
		plugins.forEach((PluginC, name) => {
			if (!PluginC.lazy()) {
				target[name].$touched = true; // TODO: What if `static plugin` ???
			}
		});
	}
	if ((ProtoC = Object.getPrototypeOf(ProtoC))) {
		initPlugins(target, ProtoC);
	}
}

/**
 * Lookup Plugin assigned to name for given class (or ancestor).
 * TODO: Now called on every accessor (via ProxyHandler), so cache this!
 * @param {Class<Proto>} ProtoC
 * @param {string} name
 * @returns {Class<Plugin>}
 */
function lookupPlugin(ProtoC, name) {
	const plugins = registry.get(ProtoC);
	return plugins && plugins.has(name)
		? plugins.get(name)
		: (ProtoC = Object.getPrototypeOf(ProtoC)).isProtoConstructor
			? lookupPlugin(ProtoC, name)
			: null;
}

/**
 * @param {Class<Plugin>} Plugin
 * @param {string} name
 * @throws {Error}
 */
function overrideError(Plugin, name) {
	throw new Error(`The ${Plugin.name} is assigned to "${name}"`);
}

/**
 * @param {*} thing
 * @throws {TypeError}
 */
function typeError(thing) {
	throw new TypeError(`Expected Plugin, got ${typeOf(thing)}`);
}
