import { Plugin } from '@dataplastique/edb';
import { IMapping } from '@dataplastique/util';
import { chained, flatten, asarray, immutable } from '@dataplastique/util';

/**
 * TODO: Is this thing even used???
 *
 * Class-mixin for tracking callbacks associated to "patterns" that are really
 * just arrays of anything. The host class is expected to define some behavior.
 * @param {Class<Plugin>} [superclass]
 * @returns {Class<Plugin>}
 */
export default function(superclass = Plugin) {
	/**
	 * Tracking patterns and associated handlers.
	 * @type IMapping<IList, ISet<Function|Object>>
	 */
	const handlers = new IMapping();

	return class Tracker extends superclass {
		/**
		 * Add handler for args.
		 * @param {string|Array} pattern
		 * @param {Function|Object} handler
		 * @param {boolean} [once]
		 * @returns {this}
		 */
		@chained
		on(pattern, handler = this.host) {
			pattern = normalize(pattern);
			handlers.add(pattern, handler);
			this.$on(pattern, handler);
		}

		/**
		 * Remove handler for args.
		 * @param {string|Array} pattern
		 * @param {Function|Object} handler
		 * @returns {this}
		 */
		@chained
		off(pattern, handler = this.host) {
			pattern = normalize(pattern);
			handlers.del(pattern, handler);
			this.$off(pattern, handler);
		}

		/**
		 * Add handler for args to be removed once invoked.
		 * @param {*|Array<*>} pattern
		 * @param {Function|Object} handler
		 */
		@chained
		once(pattern, handler = this.host) {
			console.log('TODO!');
			// this.on(pattern, handler);
		}

		/**
		 * Add or remove all based on truthy first param.
		 * @param {truthy} on
		 * @param {Array} pattern
		 * @param {Function|Object} handler
		 * @returns {this}
		 */
		@chained
		shift(on, ...rest) {
			if (!!on) {
				this.on(...rest);
			} else {
				this.off(...rest);
			}
		}

		/**
		 * Has handler for pattern registered?
		 * @param {*|Array<*>} pattern
		 * @param {Function|Object} handler
		 * @returns {boolean}
		 */
		has(pattern, handler = this.host) {
			return handlers.has(pattern, handler);
		}

		// Privileged ..............................................................

		/**
		 * Subclass must implement.
		 * @param {Array<*>} pattern
		 * @param {Function|Object} handler
		 * @param {boolean} [once]
		 */
		$on(pattern, handler, once) {
			implementationError(this);
		}

		/**
		 * Subclass must implement.
		 * @param {Array<*>} pattern
		 * @param {Function|Object} handler
		 */
		$off(pattern, handler) {
			implementationError(this);
		}

		// Static ..................................................................

		/**
		 * Get the map of patterns and handlers.
		 * @returns {IMap<IList, ISet<Function>>}
		 */
		static map() {
			return handlers.map;
		}
	};
}

// Scoped ......................................................................

/**
 * @param {string|Array} pattern
 * @returns {IList}
 */
function normalize(pattern) {
	return immutable(flatten(asarray(pattern)));
}

/**
 * A required method was not defined in the subclass.
 * TODO: Create some kind of ES7 decorator for this.
 * @param {Plugin} plugin
 * @throws {Error}
 */
function implementationError(plugin) {
	throw new Error(`${plugin} expected an implementation`);
}
