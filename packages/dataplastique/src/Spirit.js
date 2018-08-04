import { channeling as channel, Spirit as Base } from '@dataplastique/gui';
import { IOPlugin } from '@dataplastique/edb-plugins';
import {
	BroadcastPlugin,
	ScriptPlugin,
	ShadowPlugin,
	EventPlugin,
	TickPlugin,
	LifePlugin,
	AttPlugin,
	CSSPlugin,
	DOMPlugin,
	KeyPlugin,
	plugin
} from '@dataplastique/gui-plugins';

/*
 * Channeling default...
 * TODO: Don't do this!
 */
@channeling('gui-spirit')
/*
 * Plugin the plugins.
 */
@plugin('att', AttPlugin)
@plugin('life', LifePlugin)
@plugin('broadcast', BroadcastPlugin)
@plugin('css', CSSPlugin)
@plugin('dom', DOMPlugin)
@plugin('event', EventPlugin)
@plugin('io', IOPlugin)
@plugin('key', KeyPlugin)
@plugin('script', ScriptPlugin)
@plugin('shadow', ShadowPlugin)
@plugin('tick', TickPlugin)

/**
 * Implement callback methods as expected by the plugins. At some point in
 * the future we should automatically do this via mixins (or traits) or at
 * least have the plugin validate that the required methods are implemented.
 */
export class Spirit extends Base {
	/**
	 * Handle attribute changed.
	 * @param {Att} a
	 */
	onatt(a) {}

	/**
	 * Handle broadcast.
	 * @param {Broadcast} b
	 */
	onbroadcast(b) {}

	/**
	 * Handle event.
	 * @param {Event} e
	 */
	onevent(e) {}

	/**
	 * Handle input.
	 * @param {Model} c
	 */
	oninput(c) {}

	/**
	 * Handle key.
	 * @param {Key} k
	 */
	onkey(k) {}

	/**
	 * Handle life.
	 * @param {Life} l
	 */
	onlife(l) {}

	/**
	 * EDBML script executed.
	 * @param {Log} l - TODO: Create this `log` thing!!!
	 */
	onrun(l) {}

	/**
	 * Slot changed in Shadow DOM.
	 * @param {Slot} s
	 */
	onslot(s) {}

	/**
	 * Handke tick.
	 * @param {Tick} t
	 */
	ontick(t) {}

	/**
	 * Reroute the call to `onevent`
	 * @implements {EventListener}
	 * @param {Event} e
	 */
	handleEvent(e) {
		this.onevent(e);
	}
}

/**
 * @experimental
 * Add support for "functional spirit" to eliminate the use of reserved keywords
 * `this`, `super`, `extends` and other such real or imagined leaky abstractions.
 * Also support multiple channelings via nested array structure (same structure
 * as used when populating a Map with entries).
 * @param {string|Array} tag
 * @param {Class<Spirit>|Function} [thing]
 * @param {Class<Spirit>} [parent]
 * @returns {Function|undefined}
 */
export function channeling(tag, thing, parent) {
	const decorates = arguments.length === 1;
	return Array.isArray(tag)
		? tag.forEach(tag => channeling(...tag))
		: decorates
			? channel(tag)
			: Spirit.is(thing)
				? channel(tag, thing)
				: thing.call && thing.apply
					? channel(tag, getclass(thing, parent))
					: throwup('Expected function');
}

// Work in progress ............................................................

/**
 * @param {string} message
 * @throws {TypeError}
 */
function throwup(message) {
	throw new TypeError(message);
}

/**
 * Work in progress: Subclass is automatically shadowed by a lifcycle agent.
 * These methods should obviously not be handcoded like this (since
 * there are more callbacks to worry about, also the ones from plugins).
 * TODO: At least use `babel-plugin-transform-optional-chaining` to clean up
 * TODO: Move this feature down into `@dataplastique/gui` core package
 * TODO: Once we figure out how to declare expected callback methods in plugins,
 *       automatically call that method on agent whenever it is called on spirit.
 * @param {Function} agent
 * @param {Class<Spirit>} [Parent]
 * @returns {Class<Spirit>}
 */
function getclass(agent, Parent = Spirit) {
	const ag = 'SYMBOL_GOES_HERE'; // Symbol('agent') breaks Edge, but why???
	return class Anonymous extends Parent {
		displayName = agent.name || 'Anonymous'; // TODO: nonenumerable
		onconstruct() {
			super.onconstruct();
			this[ag] = agent(this, this); // one for destructuring + one for original
			this[ag] && this[ag].onconstruct ? this[ag].onconstruct() : void 0;
		}
		onattach() {
			super.onattach();
			this[ag] && this[ag].onattach ? this[ag].onattach() : void 0;
		}
		onenter() {
			super.onenter();
			this[ag] && this[ag].onenter ? this[ag].onenter() : void 0;
		}
		onready() {
			super.onready();
			this[ag] && this[ag].onready ? this[ag].onready() : void 0;
		}
		onrun(log) {
			super.onrun(log);
			this[ag] && this[ag].onrun ? this[ag].onrun(log) : void 0;
		}
		ondetach() {
			super.ondetach();
			this[ag] && this[ag].ondetach ? this[ag].ondetach : void 0;
		}
		onexorcize() {
			super.onexorcize();
			this[ag] && this[ag].onexorcize ? this[ag].onexorcize() : void 0;
		}
	};
}
