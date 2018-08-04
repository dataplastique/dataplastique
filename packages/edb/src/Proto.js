import * as Output from './output/Output';
import { registerPlugin } from './proxy/ProxyFactory';
import { Type } from '@dataplastique/util';
import { chained } from '@dataplastique/util';

/**
 * @param {Function} [superclass] Constructor
 * @returns {Proxy}
 */
export default function mixin(superclass = class {}) {
	return class Proto extends superclass {
		/**
		 * @type {boolean}
		 */
		get $observable() {
			return true;
		}

		/**
		 * Identification.
		 * @type {String}
		 */
		get [Symbol.toStringTag]() {
			return this.constructor.name;
		}

		/**
		 * More identification. This should probably be
		 * rethinked once `Symbol.toStringTag` works...
		 * @returns {string}
		 */
		toString() {
			return `[proto ${this.constructor.name}]`;
		}

		/**
		 * Painless constructor: No need to worry about constructor arguments.
		 * Whatever you would perform in the `constructor`, do it here instead.
		 * Subclass will decide, when it is appropriate to invoke this method.
		 */
		onconstruct() {}

		/**
		 * Called when the {Proto} is about to be disposed.
		 */
		ondestruct() {}

		/**
		 * Assign plugin to this single instance (not all instances of this class)
		 * TODO: Actually go ahead and implement this!
		 * @returns {this}
		 */
		@chained
		plugin(prefix, Plugin) {
			registerPlugin(this, prefix, Plugin);
		}

		/**
		 * Assign plugin to this instance, overriding any previous assignment.
		 * TODO: Actually go ahead and implement this!
		 * @param {string} prefix
		 * @param {Class<Plugin>} Plugin
		 * @returns {this}
		 */
		@chained
		pluginOverride(prefix, Plugin) {
			registerPlugin(this, prefix, Plugin, true);
		}

		/**
		 * Output this instance.
		 * @param {string|Symbol} [scope]
		 * @returns {this}
		 */
		@chained
		output(scope) {
			Output.output(this, scope);
		}

		/**
		 * Revoke this instance.
		 * @param {string|Symbol} [scope]
		 * @returns {this}
		 */
		@chained
		revoke(scope) {
			Output.revoke(this, scope);
		}

		// Static ..................................................................

		/**
		 * @param {Object} tree
		 * @param {Map<string, Class<Proto>>} map
		 * @returns {Proto}
		 */
		static sync(tree, map) {
			return new this.constructor();
		}

		/**
		 * Some given thing is an instance of this class?
		 * @param {*} thing
		 * @returns {boolean}
		 */
		static is(thing) {
			return typeof thing === 'object' && thing instanceof this;
		}

		/**
		 * Get latest output (instance of this type).
		 * @returns {Proto}
		 */
		static output() {
			return Output.get(this);
		}

		/**
		 * @returns {number}
		 */
		static timestamp() {
			return Output.timestamp(this);
		}

		/**
		 * TODO: confirm interface.
		 * @param {InputHandler} handler
		 * @returns {Constructor}
		 */
		@chained
		static connect(handler) {
			Output.connect(this, handler);
		}

		/**
		 * TODO: confirm interface.
		 * @param {InputHandler} handler
		 * @returns {Constructor}
		 */
		@chained
		static disconnect(handler) {
			Output.disconnect(this, handler);
		}

		/**
		 * Identification.
		 * @type {String}
		 */
		static get [Symbol.toStringTag]() {
			return `[class ${this.name}]`;
		}

		/**
		 * Because the above doesn't seem to work.
		 * @returns {String}
		 */
		static toString() {
			return this[Symbol.toStringTag];
		}

		/**
		 * Identification for ducks.
		 * @type {boolean}
		 */
		static get isProtoConstructor() {
			return true;
		}

		/**
		 * The subclass will reroute this method call to another method.
		 * It has to do with property type checking and transformations.
		 * @returns {null}
		 */
		static [Symbol.for('@dataplastique/objectpipe')]() {
			return null;
		}
	};
}
