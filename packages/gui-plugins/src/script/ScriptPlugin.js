import SpiritPlugin from '../SpiritPlugin';
import { addGlobalObserver, removeGlobalObserver } from '@dataplastique/edb';
import { diff, patch } from '@dataplastique/edbml-runtime';
import {
	ConfigurationError,
	Mapping,
	Tick,
	Key,
	chained
} from '@dataplastique/util';

/**
 * Script plugin.
 * TODO: General purpose decorator to `bind` methods ('run', 'one', 'stop').
 */
export default class ScriptPlugin extends SpiritPlugin {
	/**
	 * Script loaded?
	 * @type {boolean}
	 */
	get loaded() {
		return !!this._script;
	}

	/**
	 * Script is running?
	 * @type {boolean}
	 */
	get running() {
		return !!this._running;
	}

	/**
	 * Load script.
	 * @param {Function} script
	 * @returns {ScriptPlugin}
	 */
	@chained
	load(script) {
		if ((this._script = script)) {
			this._params = [];
		}
	}

	/**
	 * Run the script and watch for future model updates.
	 * TODO: Consider (and test) always running this on a micro schedule
	 * @returns {this}
	 */
	@chained
	run(...args) {
		this._running = true;
		this._params = args;
		if (this._runnable()) {
			addGlobalObserver(this);
			this._watch = true;
			this._props.clear();
			this.one(...args);
		}
	}

	/**
	 * Stop running and ignore future model updates.
	 * @returns {this}
	 */
	@chained
	stop() {
		removeGlobalObserver(this);
		this._running = false;
		this._watch = false;
		this._props.clear();
	}

	/**
	 * Simply run the script once and ignore future model updates.
	 * @returns {this}
	 */
	@chained
	one(...args) {
		this._params = args;
		Tick.cancelFrame(this._scheduleid);
		if (this._runnable()) {
			const oldout = this._output;
			const newout = this._script.apply(this.spirit, args);
			this._watch = false; // keep after `script.apply`
			this._output = render(this.spirit, this.root(), oldout, newout);
		}
	}

	/**
	 * Get the script context root element, mostly so that derived
	 * plugin `ShadowPlugin` can overwrite this very return value.
	 * @returns {Element}
	 */
	root() {
		return this.element;
	}

	/**
	 * Model property inspected.
	 * @implements {IObserver}
	 * @param {Proto} model
	 * @param {string} name
	 */
	onpeek(model, name) {
		if (this.running && this._watch) {
			this._props.add(model.$id, name);
		}
	}

	/**
	 * Model property changed.
	 * @implements {IObserver}
	 * @param {Proto} model
	 * @param {string} name
	 * @param {*} newval
	 * @param {*} oldval
	 */
	onpoke(model, name, newval, oldval) {
		if (this._dependson(model, name)) {
			if (this._watch) {
				throw updateerror(model, name);
			} else {
				this._schedule();
			}
		}
	}

	/**
	 * Collection updated.
	 * @implements {IObserver}
	 * @param {Collection} collection
	 * @param {Array<Any>} added
	 * @param {Array<Any>} removed
	 */
	onsplice(collection, added, removed) {
		if (this._dependson(collection) && (added.length || removed.length)) {
			if (this._watch) {
				throw updateerror(collection);
			} else {
				this._schedule();
			}
		}
	}

	/**
	 * Release everything.
	 * TODO: destruct sequence automated!
	 */
	ondestruct() {
		super.ondestruct();
		removeGlobalObserver(this);
		this._watch = false;
		this._params = null;
		this._props = null;
		if (this._io) {
			this._io.dispose();
		}
	}

	// Private ...................................................................

	/**
	 * Currently loaded script.
	 * @type {Function}
	 */
	_script = null;

	/**
	 * Hm.
	 */
	_props = new Mapping();

	/**
	 * Hm.
	 */
	_watch = false;

	/**
	 * Snapshot latest arguments served to the `run` method.
	 * @type {Array<Any>}
	 */
	_params = [];

	/**
	 * Snapshot the latest script output so
	 * that we may use it to diff the next.
	 * @type {Out}
	 */
	_output = '';

	/**
	 * Script is running?
	 * @type {boolean}
	 */
	_running = false;

	/**
	 * Rerun booking number.
	 * @type {number}
	 */
	_scheduleid = -1;

	/**
	 * Script depends on the model (or a specific property of the model)?
	 * @param {Proto} model - Either a Model or a Collection
	 * @param {string} [name] - Omitted if the `model` is a Collection
	 * @returns {boolean}
	 */
	_dependson(model, name) {
		const map = this._props;
		const $id = model.$id;
		return name ? map.has($id, name) : map.has($id);
	}

	/**
	 * Confirm that we are ready to `run()` the script, otherwise fail miserably.
	 * @param {Function} [reject] - For use in Promise based scenario
	 * @returns {boolean}
	 */
	_runnable(reject) {
		if (this.loaded) {
			return true;
		} else if (reject) {
			reject('No script loaded.');
		} else {
			throw new ConfigurationError('No script loaded.');
		}
	}

	/**
	 * Schedule rerun.
	 * TODO: Make all scripts in the primary DOM run in continuous document order.
	 * TODO: Think about, would we ever need to cancel the requestAnimationFrame?
	 */
	_schedule() {
		Tick.cancelFrame(this._scheduleid);
		this._scheduleid = Tick.nextFrame(() => this._onschedule());
	}

	/**
	 *
	 */
	_onschedule() {
		if (this.running && this._runnable()) {
			this.run(...this._params);
		}
	}
}

// Scoped ......................................................................

/**
 * Compare current to previous rendering and update the DOM.
 * @param {Spirit} spirit
 * @param {Element|ShadowRoot} elm
 * @param {Out} oldout
 * @param {Out} newout
 * @param {Function} resolve
 * @param {Function} reject
 * @returns {Out}
 */
function render(spirit, elm, oldout, newout, resolve) {
	const $id = spirit.$id;
	const dif = diff(elm, $id, newout, oldout);
	const log = dif.length ? patch(elm, $id, dif) : {};
	report(spirit, log);
	return newout;
}

/**
 * Feedback to user.
 * @param {Spirit} spirit
 * @param {Object} log
 * @param {Function} resolve
 */
function report(spirit, log) {
	log.first = !spirit.life.rendered;
	spirit.life.rendered = true;
	// spirit.life.dispatch(Const.LIFE_RENDER);
	spirit.onrun(log);
}

/**
 * @param {Proto} model
 * @param {string} [propname];
 * @returns {Error}
 */
function updateerror(model, propname) {
	const typename = model.constructor.name;
	const offender = typename + (propname ? `.${propname}` : '');
	return new Error(
		`Don't update the ${offender} while the script is being evaluated.` +
			` The update will cause the rendering to run in an endless loop.`
	);
}
