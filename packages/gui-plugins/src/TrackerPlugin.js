import SpiritPlugin from './SpiritPlugin';
import { Mapping } from '@dataplastique/util';
import { chained } from '@dataplastique/util';

/**
 * TODO: Move this thing over to `@dataplastique/util/Immutable` (IMapping?)
 * Plugin that needs to keep track of things, let's say the arguments for
 * `addEventListener`, so that the listener is never registered twice with
 * the same arguments and can be cleanup up for garbage collection later on.
 */
export default class TrackerPlugin extends SpiritPlugin {
	/**
	 * Add handler for type of event.
	 * The subclass will implement this.
	 * @param {string} type
	 */
	on(type) {
		implementationError(this);
	}

	/**
	 * Remove handler for type of event.
	 * The subclass will implement this.
	 * @param {string} type
	 */
	off(type) {
		implementationError(this);
	}

	/**
	 * Remove handler for type of event
	 * whenever the event is registered.
	 * The subclass will implement this.
	 * @param {string} type
	 */
	one(type) {
		implementationError(this);
	}

	/**
	 * Add or remove handlers based on truthy first param.
	 * @param {truthy|falsy} on
	 * @param {string|Array<string>} type
	 * @param {BroadcastHandler} [handler]
	 * @returns {this}
	 */
	@chained
	shift(on, ...rest) {
		!!on ? this.on(...rest) : this.off(...rest);
	}

	/**
	 * TODO: Replace with `has`.
	 * Has (handler for) type?
	 * @param {string} type
	 * @returns {boolean}
	 */
	contains(type) {
		return this._checklist.has(type);
	}

	/**
	 * @deprecated
	 */
	add() {
		throw new Error('Deprecated API is deprecated');
	}

	/**
	 * @deprecated
	 */
	remove() {
		throw new Error('Deprecated API is deprecated');
	}

	// Privileged ................................................................

	/**
	 * Create the checklist (in real constructor because unittest).
	 * The global flag is relevant for some subclasses around here.
	 * @param {Spirit} spirit
	 */
	constructor(spirit) {
		super(spirit);
		this._checklist = new Mapping();
		this._global = false;
	}

	/**
	 * Deconstruct.
	 */
	ondestruct() {
		let checklist = this._checklist;
		if (checklist) {
			if (checklist.size) {
				checklist.forAll((key, checks) => {
					this._cleanupchecks(key, checks);
				});
			}
		} else {
			console.log(
				this.constructor.name,
				this.spirit.toString(),
				'no checklist :/'
			);
		}
		this._checklist = null;
		super.ondestruct();
	}

	// Private ...................................................................

	/**
	 * Can add checks for type? If so, do it now.
	 * @param {string} type
	 * @param {Array<object>} checks
	 * @returns {boolean} - Was added?
	 */
	_addchecks(type, checks) {
		const list = this._checklist;
		if (true) {
			// !list.includesSimilar(type, checks)
			console.warn('TODO! Use immutable stuff');
			list.add(type, checks);
			return true;
		}
		return false;
	}

	/**
	 * Can remove checks for type? If so, do it now.
	 * @param {string} type
	 * @param {Array<object>} checks
	 * @returns {boolean} - Was removed?
	 */
	_removechecks(type, checks) {
		const list = this._checklist;
		if ((checks = list.getSimilar(type, checks))) {
			list.remove(type, checks);
			return true;
		}
		return false;
	}

	/**
	 * Subclass could implement: This gets called upon disposal
	 * so that we can remove all event listeners and what not.
	 * @param {string} type
	 * @param {Array<object>} checks
	 */
	_cleanupchecks(type, checks) {}

	/**
	 * Execute operation in global mode. Note that sometimes it's still
	 * recommended to flip the '_global' flag back to `false` in order to
	 * avoid the global mode leaking the into repeated (nested) calls.
	 * @param {Function} operation
	 * @returns {Object}
	 */
	_globalize(operation) {
		this._global = true;
		let res = operation.call(this);
		this._global = false;
		return res;
	}
}

// Scoped ......................................................................

/**
 * A required method was not defined in the subclass.
 * TODO: Create some kind of ES7 decorator for this.
 * @param {Plugin} plugin
 * @throws {Error}
 */
function implementationError(plugin) {
	throw new Error(`${plugin} expected an implementation`);
}
