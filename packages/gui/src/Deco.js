import * as Guide from './Guide';

// @channeling decorator .......................................................

/**
 * Channeling the spirit. Optionally to be used as a class decorator.
 * @param {string} tag
 * @param {Class<Spirit>} [SpiritC]
 * @returns {Function}
 */
export function channeling(tag, SpiritC) {
	const decorates = arguments.length === 1;
	if (decorates) {
		return function decorated(SpiritC) {
			Guide.channel(tag, SpiritC);
		};
	} else {
		Guide.channel(tag, SpiritC);
	}
}

// @attribute decorator ........................................................

/**
 * Decorate method or accessor.
 * @param {string} name
 * @returns {Object}
 */
export function attribute(name) {
	return (target, key, desc) =>
		desc.set ? accessor(target, name, desc) : method(target, name, desc);
}

/**
 * Decorate method. Note that we will not invoke the method body if and when
 * the first argument (corresponding to the attribute value) will not result
 * in a changed attribute value. Notice also that when used as a getter, ie.
 * when called without arguments, the return type will be cast to an inferred
 * type so that the attribute value "true" will returned as the boolean `true`.
 * TODO: Static methods in the {AttributePlugin} so that wo don't new it up!
 * TODO: Decorate *validation* of primitive `val` value, no objects or arrays!
 * @param {Class} target
 * @param {string} name
 * @param {Object} desc
 * @returns {Object}
 */
function method(target, name, desc) {
	return stamped(target, name, {
		configurable: false,
		value: function(val) {
			listener(this, this.element, desc);
			if (arguments.length) {
				if (val !== this.att.get(val)) {
					this.att.set(name, val);
					desc.value.apply(this, arguments);
				}
			} else {
				return this.att.get(name); // TODO: Should `null` return empty "" ?
			}
		}
	});
}

/**
 * Decorate accessor. Note that we will not invoke the `set` method if and when
 * the proveded argument will not result in a changed attribute value. Notice
 * also that the result of the `get` method will be cast to an inferred type
 * so that the attribute value "true" will returned as the boolean value `true`.
 * @param {Class} target
 * @param {string} name
 * @param {Object} desc
 * @returns {Object}
 */
function accessor(target, name, desc) {
	return stamped(target, name, {
		configurable: false,
		get: function() {
			listener(this, this.element, desc);
			return this.att.get(name); // TODO: Should `null` return empty "" ?
		},
		set: function(val) {
			this.att.set(name, val);
			if (val !== this.att.get(val)) {
				desc.set.call(this, val);
			}
		}
	});
}

/**
 * Stamp the special attributes onto the Spirit constructor so that each
 * instance can evaluate them during initialization. Please see {Cycle}.
 * @param {Proto} target
 * @param {string} name
 * @param {Object} desc
 * @returns {Object}
 */
function stamped(target, name, desc) {
	const proto = target.constructor;
	const stamp = Symbol.for('@dataplastique/attributes');
	proto[stamp] = proto[stamp] || new Map();
	proto[stamp].set(name, desc);
	return desc;
}

/**
 * When the accessor is first accessed, or when the method is first called, add
 * event listener to invoke the accessor / method whenever the attribute changes.
 * TODO: Memory leak!!! Remove listener upon disposal via the {EventPlugin}
 * @param {Spirit} spirit
 * @param {Element} elm
 * @param {Object} desc
 */
function listener(spirit, elm, desc) {
	listener.done = listener.done || Symbol('done');
	if (!elm[listener.done]) {
		elm[listener.done] = true;
		elm.addEventListener('dataplastique-attribute-change', e => {
			if (e.detail.newvalue !== undefined) {
				// TODO: HOTFIX, Why was it ever????
				(desc.set || desc.value).call(spirit, e.detail.newvalue);
			}
		});
	}
}
