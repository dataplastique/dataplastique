import Life from './Life';
import TrackerPlugin from '../TrackerPlugin';
import { chained } from '@dataplastique/util';
import { asarray } from '@dataplastique/util';
// import * as Const from '../../Const';

// TODO! DON'T !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const LIFE_CONFIGURE = 'gui-life-configure';
const LIFE_ENTER = 'gui-life-enter';
const LIFE_ATTACH = 'gui-life-attach';
const LIFE_READY = 'gui-life-ready';
const LIFE_RENDER = 'gui-life-render';
const LIFE_DETACH = 'gui-life-detach';
const LIFE_EXIT = 'gui-life-exit';
const LIFE_ASYNC = 'gui-life-async';
const LIFE_DESTRUCT = 'gui-life-destruct';

/**
 * Tracking the spirit lifecycle.
 * TODO: Prevent one-offs from changing state twice
 */
export default class LifePlugin extends TrackerPlugin {
	/*
	 * Spirit lifecycle flags.
	 */
	configured = false;
	entered = false;
	attached = false;
	ready = false;
	async = false;
	destructed = false;
	rendered = false; // ???

	/**
	 * Add handler for life event(s).
	 * @param {string|Array<string>} type
	 * @param {LifeHandler} [handler]
	 * @returns {this}
	 */
	@chained
	on(type, handler = this.spirit) {
		asarray(type).forEach(t => {
			this._addchecks(t, [handler]);
		});
	}

	/**
	 * Remove handler for life event(s).
	 * @param {string|Array<string>} type
	 * @param {LifeHandler} [handler]
	 * @returns {this}
	 */
	@chained
	off(type, handler = this.spirit) {
		asarray(type).forEach(t => {
			this._removechecks(t, [handler]);
		});
	}

	/**
	 * Dispatch life event(s).
	 * @param {string|Array<string>} type
	 * @returns {this}
	 */
	@chained
	dispatch(type) {
		let list = this._checklist;
		if (list && list.size) {
			asarray(type).forEach(t => {
				if (list.has(t)) {
					godispatch(t, this.spirit, list);
				}
			});
		}
	}
}

// Scoped ......................................................................

/**
 * These may happen only once.
 * @type {Set<string>}
 */
const singlerun = new Set([
	LIFE_CONFIGURE.LIFE_ENTER,
	LIFE_READY,
	LIFE_DESTRUCT
]);

/**
 * Dispatch life event.
 * @param {string} type
 * @param {Spirit} target
 * @param {Array<LifeHandler>} checklist
 */
function godispatch(type, target, checklist) {
	let life = new Life(type, target);
	checklist
		.toArray(type)
		.map(checks => checks[0])
		.forEach(handler => {
			handler.onlife(life);
		});
	if (singlerun.has(type)) {
		checklist.delete(type);
	}
}
