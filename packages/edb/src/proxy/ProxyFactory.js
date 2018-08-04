import * as Access from './access/Access';
import * as Target from './target/Target';
import * as Plugins from './plugins/Plugins';
import ModelHandler from './handlers/ModelHandler';
import CollectionHandler from './handlers/CollectionHandler';
import Observers from './handlers/observers/Observers';
import ProxyHandler from './ProxyHandler';
import { badConstructor } from './access/Access';

/**
 * @filedesc
 * Proxies and traps. Note that the `target` object referenced in the
 * files beyond this point is the proxied object and not the returned
 * Proxy instance that the user will generally think of as the Model.
 * TODO: Read http://stackoverflow.com/questions/35093382/javascript-trap-in-operator-in-proxy
 */

/**
 * TODO: clash-detect plugin prefixes in constructor argument
 * TODO: Also confirm `addObserver` and `removeObserver`
 * @param {Proto} target - Model, Collection or Plugin
 * @param {Object} object
 * @param {Array} [array]
 * @returns {Proto|Proxy}
 */
export function approximate(target, object, array) {
	return Array.isArray(target) || Access.confirm(object)
		? target.$observable
			? proxify(...arguments)
			: natural(...arguments)
		: Access.badConstructor(target, object);
}

/**
 * Register plugin to prefix.
 * @param {Class<Proto>|Proto} ModelC
 * @param {string} prefix
 * @param {Constructor} PluginC
 * @param {boolean} [override]
 */
export function registerPlugin(ModelC, prefix, PluginC, override) {
	Plugins.register(...arguments);
}

/**
 * Add some kind of global observer.
 * @param {boolean} on
 * @param {IObserver} obs
 */
export function observe(on, obs) {
	on ? Observers.addGlobal(obs) : Observers.removeGlobal(obs);
}

// Scoped ......................................................................

/**
 * @param {Proto} target
 * @param {Object} object
 * @param {Array} [array]
 * @returns {Proxy}
 */
function proxify(target, object, array) {
	const proxy = new Proxy(target, ProxyHandler);
	common(target, object, array, proxy);
	proxy.onconstruct();
	return proxy;
}

/**
 * @param {Proto} target
 * @param {Object} object
 * @param {Array} [array]
 * @returns {Proto}
 */
function natural(target, object, array) {
	common(target, object, array);
	target.onconstruct();
	return target;
}

/**
 * @param {Proto} target
 * @param {Object} object
 * @param {Array} array
 * @param {Proxy} [proxy]
 */
function common(target, object, array, proxy = null) {
	Target.init(target, proxy);
	ModelHandler.init(target, object);
	CollectionHandler.init(target, array);
	Plugins.init(target);
	Target.done(target);
}
