import Key from './Key';
import TrackerPlugin from '../TrackerPlugin';
import { chained } from '@dataplastique/util';
import { asarray } from '@dataplastique/util';

/**
 * Everything keyboard plugin.
 */
export default class KeyPlugin extends TrackerPlugin {
	/**
	 * Add one or more key handlers.
	 * @param {string|Array<string>} arg
	 * @param {Object} [handler]
	 * @returns {this}
	 */
	@chained
	on(type, handler = this.spirit) {
		asarray(type, t => {
			if (this._addchecks(t, [handler])) {
				Key.add(t, handler);
			}
		});
	}

	/**
	 * Add one or more key handlers.
	 * @param {string|Array<string>} arg
	 * @param {Object} [handler]
	 * @returns {this}
	 */
	@chained
	off(type, handler = this.spirit) {
		asarray(type, t => {
			if (this._removechecks(t, [handler])) {
				Key.remove(t, handler);
			}
		});
	}
}
