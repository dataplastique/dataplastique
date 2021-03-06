var docs = (function (exports) {
  'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  const TYPE = /\s([a-zA-Z]+)/; // match 'Array' in '[object Array]' and so on.

  /**
   * Make sure not to use any strange `toString` method.
   * @type {Function}
   */

  const stringify = Object.prototype.toString;

  const something = any => typeof any === 'object';
  /**
   * Regexp `class.toString` according to the specification,
   * according to how it transpiles in Babel and according
   * to our own custom syntax that says `[class MyClass]`.
   */


  const CLASS_SPEC = /^\s*class\s+/,
        CLASS_BABEL = // generic class in the spec (not supported anywhere yet)
  /_class\S+/i,
        CLASS_CUSTOM = // generic cass in Babel
  /^\[class / // our own custom class `toString` response
  ;
  /**
   * Type checking studio.
   */

  /**
   * Get type of argument. Note that response may differ between user agents.
   * @see http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator
   * @see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
   * @see http://stackoverflow.com/questions/12018759/how-to-check-the-class-of-an-instance-in-javascript
   * @param {*} any
   * @returns {string}
   */

  function typeOf(any) {
    return stringify.call(any).match(TYPE)[1].toLowerCase();
  }
  /**
   * Is object defined?
   * TODO: unlimited arguments support
   * TODO: See note on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
   * @param {*} any
   * @returns {boolean}
   */


  function isDefined(any) {
    return any !== undefined;
  }
  /**
   * @param {*} any
   * @returns {boolean}
   */


  function isArray(any) {
    return Array.isArray(any);
  }
  /**
   * Note: This no longer works for classes in Chrome because `of`
   * now returns something like `[object [class MyClass]]`, this could
   * however be just a passing phase, so let's panic later.
   * @param {*} any
   * @returns {boolean}
   */


  function isFunction(any) {
    return !!(typeof any === 'function' && any.call && any.apply);
  }
  /**
   * Is object and *not* and array?
   * @param {*} any
   * @returns {boolean}
   */


  function isObject(any) {
    return typeof any === 'object' && !Array.isArray(any);
  }
  /**
   * @param {*} any
   * @returns {boolean}
   */


  function isString(any) {
    return typeof any === 'string';
  }
  /**
   * @param {*} any
   * @returns {boolean}
   */


  function isNumber(any) {
    return typeof any === 'number';
  }
  /**
   * @param {*} any
   * @returns {boolean}
   */


  function isBoolean(any) {
    return any === true || any === false;
  }
  /**
   * @param {*} any
   * @returns {boolean}
   */


  function isDate(any) {
    return something(any) && any instanceof Date;
  }
  /**
   * @param {*} any
   * @returns {boolean}
   */


  function isSymbol(any) {
    return typeof any === 'symbol';
  }
  /**
   * Is Window object?
   * @param {*} any
   * @returns {boolean}
   */


  function isWindow(any) {
    return !!(any && any.document && any.location && any.alert && any.setInterval);
  }
  /**
   * Is node?
   * @param {*} any
   * @returns {boolean}
   */


  function isNode(any) {
    return !!(any && typeof any === 'object' && any.nodeType && any.compareDocumentPosition);
  }
  /**
   * Is DOM element?
   * @param {*} any
   * @returns {boolean}
   */


  function isElement(any) {
    return isNode(any) && any.nodeType === Node.ELEMENT_NODE;
  }
  /**
   * TODO: This does not seem performant, can we fix that?????
   * Idea: Scope this method to *only* check {Proto} classes?
   * Test if something is a class (and not just a constructor).
   * @param {*} any
   * @returns {boolean}
   */


  function isClass(any) {
    if (any && typeof any === 'function') {
      const string = any.toString();
      const regexs = [CLASS_SPEC, CLASS_BABEL, CLASS_CUSTOM];
      return regexs.some(regexp => regexp.test(string));
    }

    return false;
  }
  /**
   * Something appears to be something array-like?
   * @param {*} any
   * @returns {boolean}
   */


  function isArrayLike(any) {
    return any && '0' in any && !isArray(any);
  }
  /**
   * Autocast string to an inferred type. '123' will
   * return a number, `false` will return a boolean.
   * @param {String} string
   * @returns {object}
   */


  function cast(string) {
    const s = String(string).trim();

    switch (s) {
      case 'null':
        return null;

      case 'undefined':
        return undefined;

      case 'true':
      case 'false':
        return s === 'true';

      default:
        return String(parseInt(s, 10)) === s ? parseInt(s, 10) : String(parseFloat(s)) === s ? parseFloat(s) : String(string);
    }
  }
  /**
   * Seriously tracking keys to avoid duplicates.
   * @type {Set<string>}
   */


  const keys = new Set();
  /**
   * Generating keys for unique key purposes.
   */

  class Key {
    /**
     * Generate random key.
     * @param {string} [fix]
     * @returns {string}
     */
    static generate(fix = 'key') {
      const ran = String(Math.random());
      const key = fix + ran.slice(2, 11);
      return keys.has(key) ? this.generate() : (keys.add(key), key);
    }
    /**
     * Generate some unified resource name with random identifier.
     * Takes an array for strings (for domain and type and so on).
     * @returns {string}
     */


    static generateURN(...args) {
      return `urn:${args.join(':')}:${this.generate('')}`;
    }
    /**
     * Generate GUID.
     * TODO: Verify integrity of this by mounting result in Java or something.
     * @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
     * @returns {string}
     */


    static generateGUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0;
        let v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      }).toLowerCase();
    }
    /**
     * String appears to be a generated key? We don't look it up in the key cache,
     * so this method can be used to check a key that was generated in old session.
     * @param {string} string
     * @param {string} [fix]
     * @returns {boolean}
     */


    static isKey(string, fix = 'key') {
      let hit = null;
      let looks = false;

      if (isString(string)) {
        hit = this.extractKeys(string, fix);
        looks = hit.length === 1 && hit[0].length === string.length;
      }

      return looks;
    }
    /**
     * Extract keys from string. This always
     * returns a (potentially empty) array.
     * TODO: Rename (since it doesn't remove)!
     * @param {string} string
     * @param {string} [fix]
     * @returns {Array<string>}
     */


    static extractKeys(string, fix = 'key') {
      let next;
      let keys = [];
      let regex = getfix(fix);

      while (next = regex.exec(string)) {
        keys.push(next[0]);
      }

      return keys;
    }
    /**
     * Remove keys from string to compare non-keyed content.
     * TODO: TEST THIS!
     * @param {string} string
     * @param {string} [fix]
     * @returns {string}
     */


    static removeKeys(string, fix = 'key') {
      return string.replace(fixs.get(fix), '');
    }

  } // Scoped ......................................................................

  /**
   * Collecting regular expressions.
   * @type {Map<string, RegExp>}
   */


  const fixs = new Map();
  /**
   * Get regexp for fix.
   * @param {string} fix
   * @returns {RegExp}
   */

  function getfix(fix = 'key') {
    return fixs.has(fix) ? fixs.get(fix) : function () {
      const exp = new RegExp(fix + '\\d{9}', 'g');
      fixs.set(fix, exp);
      return exp;
    }();
  }
  /**
   * Make a method return `this` if otherwise it would return `undefined`.
   * @param {Object} target
   * @param {string} name
   * @param {Object} descriptor
   * @returns {Object}
   */


  function chained(target, name, descriptor) {
    let unchained = descriptor.value;

    descriptor.value = function () {
      let result = unchained.apply(this, arguments);
      return result === undefined ? this : result;
    };

    return descriptor;
  }

  var _class;
  /**
   *
   */


  let Mapping = (_class = class Mapping {
    constructor() {
      this._map = new Map();
    }
    /**
     * Push entry to set indexed by key.
     * TODO: Validate that `key` is a string
     * @param {string} key
     * @param {*} value
     * @returns {this}
     */


    add(key, value) {
      const map = this._map;

      if (!map.has(key)) {
        map.set(key, new Set());
      }

      const set = map.get(key);

      if (!set.has(value)) {
        set.add(value);
      }
    }
    /**
     * Remove entry from set indexed by key.
     * TODO: Rename `delete`
     * TODO: Validate that `key` is a string
     * TODO: Validate that `value` is provided
     * @param {string} key
     * @param {*} value
     * @returns {this}
     */


    del(key, value) {
      let map = this._map;
      let set = map.get(key);

      if (set && set.has(value)) {
        set.delete(value);

        if (set.size === 0) {
          map.delete(key);
        }
      }
    }
    /**
     * @param {string} key
     * @param {*} value
     * @returns {boolean}
     */


    has(key, value) {
      const map = this._map;
      const one = arguments.length === 1;
      return map.has(key) && (one || map.get(key).has(value));
    }
    /**
     * Get set indexed by key. Returns a copy. May return null.
     * @param {string} key
     * @returns {Set<*>}
     */


    get(key) {
      return this.has(key) ? new Set(this._map.get(key)) : undefined;
    }
    /**
     * Clear the map.
     * @returns {this}
     */


    clear() {
      this._map.clear();
    }
    /**
     * Get the map. Returns a copy.
     * @returns {Map<string, Set<*>>}
     */


    toMap() {
      return new Map(this._map);
    }
    /**
     * Get the set indexed by key. Returns a copy. Always returns a Set.
     * @param {string} key
     * @returns {Set<*>}
     */


    toSet(key) {
      return this.has(key) ? new Set(this._map.get(key)) : new Set();
    }
    /**
     * Get the set indexed by key as array. Always returns an array.
     * @param {string} key
     * @returns {Array}
     */


    toArray(key) {
      return [...this.toSet(key)];
    }

  }, (_applyDecoratedDescriptor(_class.prototype, "add", [chained], Object.getOwnPropertyDescriptor(_class.prototype, "add"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "del", [chained], Object.getOwnPropertyDescriptor(_class.prototype, "del"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clear", [chained], Object.getOwnPropertyDescriptor(_class.prototype, "clear"), _class.prototype)), _class);
  const global = typeof self !== 'undefined' ? self : Function('return this')();
  const isprocess = !!global.process;
  const isbrowser = !!global.document;
  /**
   * Awkward `window is not defined` workaround for Node process.
   * TODO: WebWorkerGlobalScope
   */

  class Environment {
    /**
     * Appears to be a node script?
     * @type {boolean}
     */
    static get node() {
      return isprocess;
    }
    /**
     * Appears to run in a browser?
     * @type {boolean}
     */


    static get browser() {
      return isbrowser;
    }
    /**
     * Get the window.
     * @type {Window}
     */


    static get window() {
      return isbrowser ? global : null;
    }
    /**
     * Get the document.
     * @type {Document}
     */


    static get document() {
      return isbrowser ? global.document : null;
    }

  }
  /**
   * Flatten that array.
   * @param {Array} array
   * @returns {Array}
   */


  function flatten(array) {
    return array.reduce((result, next) => {
      return result.concat(Array.isArray(next) ? flatten(next) : next);
    }, []);
  }
  /**
   * Resolve single argument into an array with one or more
   * entries with special handling of single string argument:
   *
   * 1. Strings to be split at spaces into an array
   * 3. Arrays are converted to a similar but fresh array
   * 2. Array-like objects transformed into real arrays.
   * 3. Other objects are pushed into a one entry array.
   *
   * @param {Object} arg
   * @param {Function} [action]
   * @returns {Array|void}
   */


  function asarray(arg, action) {
    const list = makearray(arg);

    if (action) {
      list.forEach(action);
    } else {
      return list;
    }
  } // Scoped ......................................................................

  /**
   * Resolve argument into array.
   * @param {*} arg
   * @returns {Array}
   */


  function makearray(arg) {
    switch (typeOf(arg)) {
      case 'string':
        return arg.split(' ');

      case 'array':
        return Array.from(arg);

      default:
        if (isArrayLike(arg)) {
          return Array.from(arg);
        } else {
          return [arg];
        }

    }
  }

  var _class$1;
  /**
   * Handler implements `onclick`.
   * @typedef {Object} TickHandler
   * @property {Function} ontick
   */

  /**
   * Create each type only once.
   * @type {Map<string, Tick>}
   */


  const pool = new Map();
  /**
   * Mapping `setInterval` coroutines.
   * @type {Map<string, number>}
   */

  const intervals = new Map();
  /**
   * Tracking ticks types ready to fire.
   * @type {Set<string>}
   */

  const scheduled = new Set();
  /**
   * Mapping tick types to handlers for tick.
   * @type {Mapping} <string, Set<TickHandler>>
   */

  const allhandlers = new Mapping();
  /**
   * Mapping handlers that should auto-unregister upon tick.
   * @type {Mapping} <string, Set<TickHandler>>
   */

  const onehandlers = new Mapping();
  /**
   * Create function to execute something
   * async with low latency (in browsers).
   * TODO: Make this cancellable!
   * @type {Function}
   */

  const fixImmediate = (() => {
    let index = -1;

    if (Environment.browser) {
      let runs = false;
      const list = [];
      const node = document.createElement('div');
      new MutationObserver(() => {
        runs = false;

        while (list.length) {
          list.shift()();
        }
      }).observe(node, {
        attributes: true
      });
      return action => {
        const id = ++index;
        list.push(action);

        if (!runs) {
          node.classList.toggle('trigger');
        }

        return id;
      };
    }
  })();
  /**
   * Scheduling and timing of things.
   */


  let Tick = (_class$1 = class Tick {
    /**
     * Tick identifier.
     * @type {string}
     */

    /**
     * @param {string} type
     */
    constructor(type) {
      this.type = void 0;

      if (isString(type)) {
        this.type = type;
        Object.seal(this);
      } else {
        throw new TypeError('Tick needs a type');
      }
    } // Static ....................................................................

    /**
     * Add handler for tick.
     * @param {string|Array<string>} type - String or array of strings
     * @param {TickHandler} handler
     * @returns {this}
     */


    static add(type, handler) {
      addhandler(type, handler);
    }
    /**
     * Remove handler for tick.
     * @param {string|Array<string>} type - String or array of strings
     * @param {TickHandler} handler
     * @returns {Constructor}
     */


    static remove(type, handler) {
      delhandler(type, handler);
    }
    /**
     * Add auto-removing handler for tick.
     * @param {Object} type String or array of strings
     * @param {Object} handler
     * @returns {Constructor}
     */


    static one(type, handler) {
      addhandler(type, handler, true);
    }
    /**
     * @param {Function} action
     * @returns {number}
     */


    static next(action) {
      return nexttick(action);
    }
    /**
     * TODO!
     * @param {number} n
     */


    static cancelNext(n) {
      console.error('TODO!'); //cancelnext(n);
    }
    /**
     * Schedule action for next animation frame.
     * @param {Function} action Called back with a timestamp
     * returns {number}
     */


    static nextFrame(action) {
      return requestAnimationFrame(action);
    }
    /**
     * Cancel animation frame by index.
     * @param {number} n
     */


    static cancelFrame(n) {
      cancelAnimationFrame(n);
    }
    /**
     * Set a timeout.
     * @param {Function} action
     * @param {number} [time] Default to something like 4ms
     * @param {Object} [thisp]
     * returns {number}
     */


    static time(action, time) {
      return setTimeout(action, time || 0);
    }
    /**
     * Cancel timeout by index.
     * @param {number} n
     */


    static cancelTime(n) {
      clearTimeout(n);
    }
    /**
     * Start repeated tick of given type. Once a tick
     * is started, subsequent calls will be ignored.
     * @param {string} type Tick type
     * @param {number} time In milliseconds
     * @returns {Function}
     */


    static start(type, time) {
      if (!intervals.has(type)) {
        intervals.set(type, setInterval(() => {
          dispatch(type);
        }, time));
      }
    }
    /**
     * Schedule callback async via `requestAnimationFrame`
     * (in the browser) or via `setTimeout` (in the Node
     * where process.next cannot be cancelled, or can it?)
     * @param {Function} cb
     * @returns {number}
     */


    static schedule(cb) {
      return Environment.browser ? this.nextFrame(cb) : this.time(cb);
    }
    /**
     * Cancel scheduled callback.
     * @param {number} id
     */


    static cancelSchedule(id) {
      Environment.browser ? this.cancelFrame(id) : this.cancelTime(id);
    }
    /**
     * Stop repeated tick of given type.
     * @param {string} type Tick type
     * @returns {Function}
     */


    static stop(type) {
      if (intervals.has(type)) {
        clearTimeout(intervals.get(type));
      }
    }
    /**
     * Dispatch tick now or in specified time. No return value
     * because `process.nextTick` can't be cancelled anyways.
     * @param {string} type
     * @param {number} [time]
     */


    static dispatch(type, time) {
      dispatch(type, time);
    }

  }, (_applyDecoratedDescriptor(_class$1, "add", [chained], Object.getOwnPropertyDescriptor(_class$1, "add"), _class$1), _applyDecoratedDescriptor(_class$1, "remove", [chained], Object.getOwnPropertyDescriptor(_class$1, "remove"), _class$1), _applyDecoratedDescriptor(_class$1, "one", [chained], Object.getOwnPropertyDescriptor(_class$1, "one"), _class$1), _applyDecoratedDescriptor(_class$1, "next", [chained], Object.getOwnPropertyDescriptor(_class$1, "next"), _class$1), _applyDecoratedDescriptor(_class$1, "nextFrame", [chained], Object.getOwnPropertyDescriptor(_class$1, "nextFrame"), _class$1), _applyDecoratedDescriptor(_class$1, "cancelFrame", [chained], Object.getOwnPropertyDescriptor(_class$1, "cancelFrame"), _class$1), _applyDecoratedDescriptor(_class$1, "time", [chained], Object.getOwnPropertyDescriptor(_class$1, "time"), _class$1), _applyDecoratedDescriptor(_class$1, "cancelTime", [chained], Object.getOwnPropertyDescriptor(_class$1, "cancelTime"), _class$1), _applyDecoratedDescriptor(_class$1, "start", [chained], Object.getOwnPropertyDescriptor(_class$1, "start"), _class$1), _applyDecoratedDescriptor(_class$1, "cancelSchedule", [chained], Object.getOwnPropertyDescriptor(_class$1, "cancelSchedule"), _class$1), _applyDecoratedDescriptor(_class$1, "stop", [chained], Object.getOwnPropertyDescriptor(_class$1, "stop"), _class$1), _applyDecoratedDescriptor(_class$1, "dispatch", [chained], Object.getOwnPropertyDescriptor(_class$1, "dispatch"), _class$1)), _class$1);
  /**
   * Get tick for type.
   * @param {string} type
   * @returns {Tick}
   */

  function get(type) {
    if (!pool.has(type)) {
      pool.set(type, new Tick(type));
    }

    return pool.get(type);
  }
  /**
   * @param {string|Array<string>} type
   * @param {TickHandler} handler
   * @param {boolean} [one]
   */


  function addhandler(type, handler, one) {
    asarray(type, t => {
      allhandlers.add(t, handler);

      if (one) {
        onehandlers.add(t, handler);
      }
    });
  }
  /**
   * @param {string|Array<string>} type
   * @param {TickHandler} handler
   */


  function delhandler(type, handler) {
    asarray(type, t => {
      allhandlers.del(type, handler);
      onehandlers.del(type, handler);
    });
  }
  /**
   * Dispatch tick sooner or later.
   * @param {string} type
   * @param {number} [time]
   * @returns {number}
   */


  function dispatch(type, time) {
    const now = arguments.length === 1;
    const set = scheduled;

    if (!set.has(type)) {
      set.add(type);

      const doit = () => {
        set.delete(type);
        handlers(get(type));
      };

      return now ? nexttick(doit) : setTimeout(doit, time);
    }
  }
  /**
   * @param {Tick} tick
   */


  function handlers(tick) {
    const type = tick.type;
    const all = allhandlers;
    const one = onehandlers;
    all.toArray(type).filter(handler => {
      handler.ontick(tick);
      return one.has(type, handler);
    }).forEach(handler => {
      all.del(type, handler);
      one.del(type, handler);
    });
  }
  /**
   * @param {Function} action
   * @returns {number}
   */


  function nexttick(action) {
    return Environment.browser ? fixImmediate(action) : Environment.node ? setImmediate(action) : todo('WebWorkers unite');
  }
  /**
   * A gentle reminder.
   * @param {string} [message]
   * @throws {Error}
   */


  function todo(message = 'fix') {
    throw new Error('TODO: ' + message);
  }
  /**
   * Working with classes.
   */

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the LOCAL!!! directory of this source tree.
   */
  // Used for setting prototype methods that IE8 chokes on.


  var DELETE = 'delete'; // Constants describing the size of trie nodes.

  var SHIFT = 5; // Resulted in best performance after ______?

  var SIZE = 1 << SHIFT;
  var MASK = SIZE - 1; // A consistent shared value representing "not set" which equals nothing other
  // than itself, and nothing that could be provided externally.

  var NOT_SET = {}; // Boolean references, Rough equivalent of `bool &`.

  var CHANGE_LENGTH = {
    value: false
  };
  var DID_ALTER = {
    value: false
  };

  function MakeRef(ref) {
    ref.value = false;
    return ref;
  }

  function SetRef(ref) {
    ref && (ref.value = true);
  } // A function which returns a value representing an "owner" for transient writes
  // to tries. The return value will only ever equal itself, and will not equal
  // the return of any subsequent call of this function.


  function OwnerID() {}

  function ensureSize(iter) {
    if (iter.size === undefined) {
      iter.size = iter.__iterate(returnTrue);
    }

    return iter.size;
  }

  function wrapIndex(iter, index) {
    // This implements "is array index" which the ECMAString spec defines as:
    //
    //     A String property name P is an array index if and only if
    //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
    //     to 2^32−1.
    //
    // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
    if (typeof index !== 'number') {
      var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32

      if ('' + uint32Index !== index || uint32Index === 4294967295) {
        return NaN;
      }

      index = uint32Index;
    }

    return index < 0 ? ensureSize(iter) + index : index;
  }

  function returnTrue() {
    return true;
  }

  function wholeSlice(begin, end, size) {
    return (begin === 0 && !isNeg(begin) || size !== undefined && begin <= -size) && (end === undefined || size !== undefined && end >= size);
  }

  function resolveBegin(begin, size) {
    return resolveIndex(begin, size, 0);
  }

  function resolveEnd(end, size) {
    return resolveIndex(end, size, size);
  }

  function resolveIndex(index, size, defaultIndex) {
    // Sanitize indices using this shorthand for ToInt32(argument)
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
    return index === undefined ? defaultIndex : isNeg(index) ? size === Infinity ? size : Math.max(0, size + index) | 0 : size === undefined || size === index ? index : Math.min(size, index) | 0;
  }

  function isNeg(value) {
    // Account for -0 which is negative, but not less than 0.
    return value < 0 || value === 0 && 1 / value === -Infinity;
  }

  function isImmutable(maybeImmutable) {
    return isCollection(maybeImmutable) || isRecord(maybeImmutable);
  }

  function isCollection(maybeCollection) {
    return !!(maybeCollection && maybeCollection[IS_ITERABLE_SENTINEL]);
  }

  function isKeyed(maybeKeyed) {
    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
  }

  function isIndexed(maybeIndexed) {
    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
  }

  function isAssociative(maybeAssociative) {
    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
  }

  function isOrdered(maybeOrdered) {
    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
  }

  function isRecord(maybeRecord) {
    return !!(maybeRecord && maybeRecord[IS_RECORD_SENTINEL]);
  }

  function isValueObject(maybeValue) {
    return !!(maybeValue && typeof maybeValue.equals === 'function' && typeof maybeValue.hashCode === 'function');
  }

  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
  var IS_RECORD_SENTINEL = '@@__IMMUTABLE_RECORD__@@';

  var Collection = function Collection(value) {
    return isCollection(value) ? value : Seq(value);
  };

  var KeyedCollection = function (Collection) {
    function KeyedCollection(value) {
      return isKeyed(value) ? value : KeyedSeq(value);
    }

    if (Collection) KeyedCollection.__proto__ = Collection;
    KeyedCollection.prototype = Object.create(Collection && Collection.prototype);
    KeyedCollection.prototype.constructor = KeyedCollection;
    return KeyedCollection;
  }(Collection);

  var IndexedCollection = function (Collection) {
    function IndexedCollection(value) {
      return isIndexed(value) ? value : IndexedSeq(value);
    }

    if (Collection) IndexedCollection.__proto__ = Collection;
    IndexedCollection.prototype = Object.create(Collection && Collection.prototype);
    IndexedCollection.prototype.constructor = IndexedCollection;
    return IndexedCollection;
  }(Collection);

  var SetCollection = function (Collection) {
    function SetCollection(value) {
      return isCollection(value) && !isAssociative(value) ? value : SetSeq(value);
    }

    if (Collection) SetCollection.__proto__ = Collection;
    SetCollection.prototype = Object.create(Collection && Collection.prototype);
    SetCollection.prototype.constructor = SetCollection;
    return SetCollection;
  }(Collection);

  Collection.Keyed = KeyedCollection;
  Collection.Indexed = IndexedCollection;
  Collection.Set = SetCollection;
  var ITERATE_KEYS = 0;
  var ITERATE_VALUES = 1;
  var ITERATE_ENTRIES = 2;
  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';
  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;

  var Iterator = function Iterator(next) {
    this.next = next;
  };

  Iterator.prototype.toString = function toString() {
    return '[Iterator]';
  };

  Iterator.KEYS = ITERATE_KEYS;
  Iterator.VALUES = ITERATE_VALUES;
  Iterator.ENTRIES = ITERATE_ENTRIES;

  Iterator.prototype.inspect = Iterator.prototype.toSource = function () {
    return this.toString();
  };

  Iterator.prototype[ITERATOR_SYMBOL] = function () {
    return this;
  };

  function iteratorValue(type, k, v, iteratorResult) {
    var value = type === 0 ? k : type === 1 ? v : [k, v];
    iteratorResult ? iteratorResult.value = value : iteratorResult = {
      value: value,
      done: false
    };
    return iteratorResult;
  }

  function iteratorDone() {
    return {
      value: undefined,
      done: true
    };
  }

  function hasIterator(maybeIterable) {
    return !!getIteratorFn(maybeIterable);
  }

  function isIterator(maybeIterator) {
    return maybeIterator && typeof maybeIterator.next === 'function';
  }

  function getIterator(iterable) {
    var iteratorFn = getIteratorFn(iterable);
    return iteratorFn && iteratorFn.call(iterable);
  }

  function getIteratorFn(iterable) {
    var iteratorFn = iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);

    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  function isArrayLike$1(value) {
    return value && typeof value.length === 'number';
  }

  var Seq = function (Collection$$1) {
    function Seq(value) {
      return value === null || value === undefined ? emptySequence() : isImmutable(value) ? value.toSeq() : seqFromValue(value);
    }

    if (Collection$$1) Seq.__proto__ = Collection$$1;
    Seq.prototype = Object.create(Collection$$1 && Collection$$1.prototype);
    Seq.prototype.constructor = Seq;

    Seq.prototype.toSeq = function toSeq() {
      return this;
    };

    Seq.prototype.toString = function toString() {
      return this.__toString('Seq {', '}');
    };

    Seq.prototype.cacheResult = function cacheResult() {
      if (!this._cache && this.__iterateUncached) {
        this._cache = this.entrySeq().toArray();
        this.size = this._cache.length;
      }

      return this;
    }; // abstract __iterateUncached(fn, reverse)


    Seq.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      var cache = this._cache;

      if (cache) {
        var size = cache.length;
        var i = 0;

        while (i !== size) {
          var entry = cache[reverse ? size - ++i : i++];

          if (fn(entry[1], entry[0], this$1) === false) {
            break;
          }
        }

        return i;
      }

      return this.__iterateUncached(fn, reverse);
    }; // abstract __iteratorUncached(type, reverse)


    Seq.prototype.__iterator = function __iterator(type, reverse) {
      var cache = this._cache;

      if (cache) {
        var size = cache.length;
        var i = 0;
        return new Iterator(function () {
          if (i === size) {
            return iteratorDone();
          }

          var entry = cache[reverse ? size - ++i : i++];
          return iteratorValue(type, entry[0], entry[1]);
        });
      }

      return this.__iteratorUncached(type, reverse);
    };

    return Seq;
  }(Collection);

  var KeyedSeq = function (Seq) {
    function KeyedSeq(value) {
      return value === null || value === undefined ? emptySequence().toKeyedSeq() : isCollection(value) ? isKeyed(value) ? value.toSeq() : value.fromEntrySeq() : isRecord(value) ? value.toSeq() : keyedSeqFromValue(value);
    }

    if (Seq) KeyedSeq.__proto__ = Seq;
    KeyedSeq.prototype = Object.create(Seq && Seq.prototype);
    KeyedSeq.prototype.constructor = KeyedSeq;

    KeyedSeq.prototype.toKeyedSeq = function toKeyedSeq() {
      return this;
    };

    return KeyedSeq;
  }(Seq);

  var IndexedSeq = function (Seq) {
    function IndexedSeq(value) {
      return value === null || value === undefined ? emptySequence() : isCollection(value) ? isKeyed(value) ? value.entrySeq() : value.toIndexedSeq() : isRecord(value) ? value.toSeq().entrySeq() : indexedSeqFromValue(value);
    }

    if (Seq) IndexedSeq.__proto__ = Seq;
    IndexedSeq.prototype = Object.create(Seq && Seq.prototype);
    IndexedSeq.prototype.constructor = IndexedSeq;

    IndexedSeq.of = function of()
    /*...values*/
    {
      return IndexedSeq(arguments);
    };

    IndexedSeq.prototype.toIndexedSeq = function toIndexedSeq() {
      return this;
    };

    IndexedSeq.prototype.toString = function toString() {
      return this.__toString('Seq [', ']');
    };

    return IndexedSeq;
  }(Seq);

  var SetSeq = function (Seq) {
    function SetSeq(value) {
      return (isCollection(value) && !isAssociative(value) ? value : IndexedSeq(value)).toSetSeq();
    }

    if (Seq) SetSeq.__proto__ = Seq;
    SetSeq.prototype = Object.create(Seq && Seq.prototype);
    SetSeq.prototype.constructor = SetSeq;

    SetSeq.of = function of()
    /*...values*/
    {
      return SetSeq(arguments);
    };

    SetSeq.prototype.toSetSeq = function toSetSeq() {
      return this;
    };

    return SetSeq;
  }(Seq);

  Seq.isSeq = isSeq;
  Seq.Keyed = KeyedSeq;
  Seq.Set = SetSeq;
  Seq.Indexed = IndexedSeq;
  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';
  Seq.prototype[IS_SEQ_SENTINEL] = true; // #pragma Root Sequences

  var ArraySeq = function (IndexedSeq) {
    function ArraySeq(array) {
      this._array = array;
      this.size = array.length;
    }

    if (IndexedSeq) ArraySeq.__proto__ = IndexedSeq;
    ArraySeq.prototype = Object.create(IndexedSeq && IndexedSeq.prototype);
    ArraySeq.prototype.constructor = ArraySeq;

    ArraySeq.prototype.get = function get(index, notSetValue) {
      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
    };

    ArraySeq.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      var array = this._array;
      var size = array.length;
      var i = 0;

      while (i !== size) {
        var ii = reverse ? size - ++i : i++;

        if (fn(array[ii], ii, this$1) === false) {
          break;
        }
      }

      return i;
    };

    ArraySeq.prototype.__iterator = function __iterator(type, reverse) {
      var array = this._array;
      var size = array.length;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }

        var ii = reverse ? size - ++i : i++;
        return iteratorValue(type, ii, array[ii]);
      });
    };

    return ArraySeq;
  }(IndexedSeq);

  var ObjectSeq = function (KeyedSeq) {
    function ObjectSeq(object) {
      var keys = Object.keys(object);
      this._object = object;
      this._keys = keys;
      this.size = keys.length;
    }

    if (KeyedSeq) ObjectSeq.__proto__ = KeyedSeq;
    ObjectSeq.prototype = Object.create(KeyedSeq && KeyedSeq.prototype);
    ObjectSeq.prototype.constructor = ObjectSeq;

    ObjectSeq.prototype.get = function get(key, notSetValue) {
      if (notSetValue !== undefined && !this.has(key)) {
        return notSetValue;
      }

      return this._object[key];
    };

    ObjectSeq.prototype.has = function has(key) {
      return hasOwnProperty.call(this._object, key);
    };

    ObjectSeq.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      var object = this._object;
      var keys = this._keys;
      var size = keys.length;
      var i = 0;

      while (i !== size) {
        var key = keys[reverse ? size - ++i : i++];

        if (fn(object[key], key, this$1) === false) {
          break;
        }
      }

      return i;
    };

    ObjectSeq.prototype.__iterator = function __iterator(type, reverse) {
      var object = this._object;
      var keys = this._keys;
      var size = keys.length;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }

        var key = keys[reverse ? size - ++i : i++];
        return iteratorValue(type, key, object[key]);
      });
    };

    return ObjectSeq;
  }(KeyedSeq);

  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;

  var CollectionSeq = function (IndexedSeq) {
    function CollectionSeq(collection) {
      this._collection = collection;
      this.size = collection.length || collection.size;
    }

    if (IndexedSeq) CollectionSeq.__proto__ = IndexedSeq;
    CollectionSeq.prototype = Object.create(IndexedSeq && IndexedSeq.prototype);
    CollectionSeq.prototype.constructor = CollectionSeq;

    CollectionSeq.prototype.__iterateUncached = function __iterateUncached(fn, reverse) {
      var this$1 = this;

      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }

      var collection = this._collection;
      var iterator = getIterator(collection);
      var iterations = 0;

      if (isIterator(iterator)) {
        var step;

        while (!(step = iterator.next()).done) {
          if (fn(step.value, iterations++, this$1) === false) {
            break;
          }
        }
      }

      return iterations;
    };

    CollectionSeq.prototype.__iteratorUncached = function __iteratorUncached(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }

      var collection = this._collection;
      var iterator = getIterator(collection);

      if (!isIterator(iterator)) {
        return new Iterator(iteratorDone);
      }

      var iterations = 0;
      return new Iterator(function () {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, iterations++, step.value);
      });
    };

    return CollectionSeq;
  }(IndexedSeq);

  var IteratorSeq = function (IndexedSeq) {
    function IteratorSeq(iterator) {
      this._iterator = iterator;
      this._iteratorCache = [];
    }

    if (IndexedSeq) IteratorSeq.__proto__ = IndexedSeq;
    IteratorSeq.prototype = Object.create(IndexedSeq && IndexedSeq.prototype);
    IteratorSeq.prototype.constructor = IteratorSeq;

    IteratorSeq.prototype.__iterateUncached = function __iterateUncached(fn, reverse) {
      var this$1 = this;

      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }

      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;

      while (iterations < cache.length) {
        if (fn(cache[iterations], iterations++, this$1) === false) {
          return iterations;
        }
      }

      var step;

      while (!(step = iterator.next()).done) {
        var val = step.value;
        cache[iterations] = val;

        if (fn(val, iterations++, this$1) === false) {
          break;
        }
      }

      return iterations;
    };

    IteratorSeq.prototype.__iteratorUncached = function __iteratorUncached(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }

      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      return new Iterator(function () {
        if (iterations >= cache.length) {
          var step = iterator.next();

          if (step.done) {
            return step;
          }

          cache[iterations] = step.value;
        }

        return iteratorValue(type, iterations, cache[iterations++]);
      });
    };

    return IteratorSeq;
  }(IndexedSeq); // # pragma Helper functions


  function isSeq(maybeSeq) {
    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
  }

  var EMPTY_SEQ;

  function emptySequence() {
    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
  }

  function keyedSeqFromValue(value) {
    var seq = Array.isArray(value) ? new ArraySeq(value) : isIterator(value) ? new IteratorSeq(value) : hasIterator(value) ? new CollectionSeq(value) : undefined;

    if (seq) {
      return seq.fromEntrySeq();
    }

    if (typeof value === 'object') {
      return new ObjectSeq(value);
    }

    throw new TypeError('Expected Array or collection object of [k, v] entries, or keyed object: ' + value);
  }

  function indexedSeqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value);

    if (seq) {
      return seq;
    }

    throw new TypeError('Expected Array or collection object of values: ' + value);
  }

  function seqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value);

    if (seq) {
      return seq;
    }

    if (typeof value === 'object') {
      return new ObjectSeq(value);
    }

    throw new TypeError('Expected Array or collection object of values, or keyed object: ' + value);
  }

  function maybeIndexedSeqFromValue(value) {
    return isArrayLike$1(value) ? new ArraySeq(value) : isIterator(value) ? new IteratorSeq(value) : hasIterator(value) ? new CollectionSeq(value) : undefined;
  }
  /**
   * An extension of the "same-value" algorithm as [described for use by ES6 Map
   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
   *
   * NaN is considered the same as NaN, however -0 and 0 are considered the same
   * value, which is different from the algorithm described by
   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
   *
   * This is extended further to allow Objects to describe the values they
   * represent, by way of `valueOf` or `equals` (and `hashCode`).
   *
   * Note: because of this extension, the key equality of Immutable.Map and the
   * value equality of Immutable.Set will differ from ES6 Map and Set.
   *
   * ### Defining custom values
   *
   * The easiest way to describe the value an object represents is by implementing
   * `valueOf`. For example, `Date` represents a value by returning a unix
   * timestamp for `valueOf`:
   *
   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
   *     var date2 = new Date(1234567890000);
   *     date1.valueOf(); // 1234567890000
   *     assert( date1 !== date2 );
   *     assert( Immutable.is( date1, date2 ) );
   *
   * Note: overriding `valueOf` may have other implications if you use this object
   * where JavaScript expects a primitive, such as implicit string coercion.
   *
   * For more complex types, especially collections, implementing `valueOf` may
   * not be performant. An alternative is to implement `equals` and `hashCode`.
   *
   * `equals` takes another object, presumably of similar type, and returns true
   * if it is equal. Equality is symmetrical, so the same result should be
   * returned if this and the argument are flipped.
   *
   *     assert( a.equals(b) === b.equals(a) );
   *
   * `hashCode` returns a 32bit integer number representing the object which will
   * be used to determine how to store the value object in a Map or Set. You must
   * provide both or neither methods, one must not exist without the other.
   *
   * Also, an important relationship between these methods must be upheld: if two
   * values are equal, they *must* return the same hashCode. If the values are not
   * equal, they might have the same hashCode; this is called a hash collision,
   * and while undesirable for performance reasons, it is acceptable.
   *
   *     if (a.equals(b)) {
   *       assert( a.hashCode() === b.hashCode() );
   *     }
   *
   * All Immutable collections are Value Objects: they implement `equals()`
   * and `hashCode()`.
   */


  function is(valueA, valueB) {
    if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
      return true;
    }

    if (!valueA || !valueB) {
      return false;
    }

    if (typeof valueA.valueOf === 'function' && typeof valueB.valueOf === 'function') {
      valueA = valueA.valueOf();
      valueB = valueB.valueOf();

      if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
        return true;
      }

      if (!valueA || !valueB) {
        return false;
      }
    }

    return !!(isValueObject(valueA) && isValueObject(valueB) && valueA.equals(valueB));
  }

  var imul = typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ? Math.imul : function imul(a, b) {
    a |= 0; // int

    b |= 0; // int

    var c = a & 0xffff;
    var d = b & 0xffff; // Shift by 0 fixes the sign on the high part.

    return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0; // int
  }; // v8 has an optimization for storing 31-bit signed numbers.
  // Values which have either 00 or 11 as the high order bits qualify.
  // This function drops the highest order bit in a signed number, maintaining
  // the sign bit.

  function smi(i32) {
    return i32 >>> 1 & 0x40000000 | i32 & 0xbfffffff;
  }

  function hash(o) {
    if (o === false || o === null || o === undefined) {
      return 0;
    }

    if (typeof o.valueOf === 'function') {
      o = o.valueOf();

      if (o === false || o === null || o === undefined) {
        return 0;
      }
    }

    if (o === true) {
      return 1;
    }

    var type = typeof o;

    if (type === 'number') {
      if (o !== o || o === Infinity) {
        return 0;
      }

      var h = o | 0;

      if (h !== o) {
        h ^= o * 0xffffffff;
      }

      while (o > 0xffffffff) {
        o /= 0xffffffff;
        h ^= o;
      }

      return smi(h);
    }

    if (type === 'string') {
      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
    }

    if (typeof o.hashCode === 'function') {
      // Drop any high bits from accidentally long hash codes.
      return smi(o.hashCode());
    }

    if (type === 'object') {
      return hashJSObj(o);
    }

    if (typeof o.toString === 'function') {
      return hashString(o.toString());
    }

    throw new Error('Value type ' + type + ' cannot be hashed.');
  }

  function cachedHashString(string) {
    var hashed = stringHashCache[string];

    if (hashed === undefined) {
      hashed = hashString(string);

      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
        STRING_HASH_CACHE_SIZE = 0;
        stringHashCache = {};
      }

      STRING_HASH_CACHE_SIZE++;
      stringHashCache[string] = hashed;
    }

    return hashed;
  } // http://jsperf.com/hashing-strings


  function hashString(string) {
    // This is the hash from JVM
    // The hash code for a string is computed as
    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
    // where s[i] is the ith character of the string and n is the length of
    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
    // (exclusive) by dropping high bits.
    var hashed = 0;

    for (var ii = 0; ii < string.length; ii++) {
      hashed = 31 * hashed + string.charCodeAt(ii) | 0;
    }

    return smi(hashed);
  }

  function hashJSObj(obj) {
    var hashed;

    if (usingWeakMap) {
      hashed = weakMap.get(obj);

      if (hashed !== undefined) {
        return hashed;
      }
    }

    hashed = obj[UID_HASH_KEY];

    if (hashed !== undefined) {
      return hashed;
    }

    if (!canDefineProperty) {
      hashed = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];

      if (hashed !== undefined) {
        return hashed;
      }

      hashed = getIENodeHash(obj);

      if (hashed !== undefined) {
        return hashed;
      }
    }

    hashed = ++objHashUID;

    if (objHashUID & 0x40000000) {
      objHashUID = 0;
    }

    if (usingWeakMap) {
      weakMap.set(obj, hashed);
    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
      throw new Error('Non-extensible objects are not allowed as keys.');
    } else if (canDefineProperty) {
      Object.defineProperty(obj, UID_HASH_KEY, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: hashed
      });
    } else if (obj.propertyIsEnumerable !== undefined && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
      // Since we can't define a non-enumerable property on the object
      // we'll hijack one of the less-used non-enumerable properties to
      // save our hash on it. Since this is a function it will not show up in
      // `JSON.stringify` which is what we want.
      obj.propertyIsEnumerable = function () {
        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
      };

      obj.propertyIsEnumerable[UID_HASH_KEY] = hashed;
    } else if (obj.nodeType !== undefined) {
      // At this point we couldn't get the IE `uniqueID` to use as a hash
      // and we couldn't use a non-enumerable property to exploit the
      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
      // itself.
      obj[UID_HASH_KEY] = hashed;
    } else {
      throw new Error('Unable to set a non-enumerable property on object.');
    }

    return hashed;
  } // Get references to ES5 object methods.


  var isExtensible = Object.isExtensible; // True if Object.defineProperty works as expected. IE8 fails this test.

  var canDefineProperty = function () {
    try {
      Object.defineProperty({}, '@', {});
      return true;
    } catch (e) {
      return false;
    }
  }(); // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
  // and avoid memory leaks from the IE cloneNode bug.


  function getIENodeHash(node) {
    if (node && node.nodeType > 0) {
      switch (node.nodeType) {
        case 1:
          // Element
          return node.uniqueID;

        case 9:
          // Document
          return node.documentElement && node.documentElement.uniqueID;
      }
    }
  } // If possible, use a WeakMap.


  var usingWeakMap = typeof WeakMap === 'function';
  var weakMap;

  if (usingWeakMap) {
    weakMap = new WeakMap();
  }

  var objHashUID = 0;
  var UID_HASH_KEY = '__immutablehash__';

  if (typeof Symbol === 'function') {
    UID_HASH_KEY = Symbol(UID_HASH_KEY);
  }

  var STRING_HASH_CACHE_MIN_STRLEN = 16;
  var STRING_HASH_CACHE_MAX_SIZE = 255;
  var STRING_HASH_CACHE_SIZE = 0;
  var stringHashCache = {};

  var ToKeyedSequence = function (KeyedSeq$$1) {
    function ToKeyedSequence(indexed, useKeys) {
      this._iter = indexed;
      this._useKeys = useKeys;
      this.size = indexed.size;
    }

    if (KeyedSeq$$1) ToKeyedSequence.__proto__ = KeyedSeq$$1;
    ToKeyedSequence.prototype = Object.create(KeyedSeq$$1 && KeyedSeq$$1.prototype);
    ToKeyedSequence.prototype.constructor = ToKeyedSequence;

    ToKeyedSequence.prototype.get = function get(key, notSetValue) {
      return this._iter.get(key, notSetValue);
    };

    ToKeyedSequence.prototype.has = function has(key) {
      return this._iter.has(key);
    };

    ToKeyedSequence.prototype.valueSeq = function valueSeq() {
      return this._iter.valueSeq();
    };

    ToKeyedSequence.prototype.reverse = function reverse() {
      var this$1 = this;
      var reversedSequence = reverseFactory(this, true);

      if (!this._useKeys) {
        reversedSequence.valueSeq = function () {
          return this$1._iter.toSeq().reverse();
        };
      }

      return reversedSequence;
    };

    ToKeyedSequence.prototype.map = function map(mapper, context) {
      var this$1 = this;
      var mappedSequence = mapFactory(this, mapper, context);

      if (!this._useKeys) {
        mappedSequence.valueSeq = function () {
          return this$1._iter.toSeq().map(mapper, context);
        };
      }

      return mappedSequence;
    };

    ToKeyedSequence.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      return this._iter.__iterate(function (v, k) {
        return fn(v, k, this$1);
      }, reverse);
    };

    ToKeyedSequence.prototype.__iterator = function __iterator(type, reverse) {
      return this._iter.__iterator(type, reverse);
    };

    return ToKeyedSequence;
  }(KeyedSeq);

  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;

  var ToIndexedSequence = function (IndexedSeq$$1) {
    function ToIndexedSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    if (IndexedSeq$$1) ToIndexedSequence.__proto__ = IndexedSeq$$1;
    ToIndexedSequence.prototype = Object.create(IndexedSeq$$1 && IndexedSeq$$1.prototype);
    ToIndexedSequence.prototype.constructor = ToIndexedSequence;

    ToIndexedSequence.prototype.includes = function includes(value) {
      return this._iter.includes(value);
    };

    ToIndexedSequence.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      var i = 0;
      reverse && ensureSize(this);
      return this._iter.__iterate(function (v) {
        return fn(v, reverse ? this$1.size - ++i : i++, this$1);
      }, reverse);
    };

    ToIndexedSequence.prototype.__iterator = function __iterator(type, reverse) {
      var this$1 = this;

      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

      var i = 0;
      reverse && ensureSize(this);
      return new Iterator(function () {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, reverse ? this$1.size - ++i : i++, step.value, step);
      });
    };

    return ToIndexedSequence;
  }(IndexedSeq);

  var ToSetSequence = function (SetSeq$$1) {
    function ToSetSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    if (SetSeq$$1) ToSetSequence.__proto__ = SetSeq$$1;
    ToSetSequence.prototype = Object.create(SetSeq$$1 && SetSeq$$1.prototype);
    ToSetSequence.prototype.constructor = ToSetSequence;

    ToSetSequence.prototype.has = function has(key) {
      return this._iter.includes(key);
    };

    ToSetSequence.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      return this._iter.__iterate(function (v) {
        return fn(v, v, this$1);
      }, reverse);
    };

    ToSetSequence.prototype.__iterator = function __iterator(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

      return new Iterator(function () {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, step.value, step.value, step);
      });
    };

    return ToSetSequence;
  }(SetSeq);

  var FromEntriesSequence = function (KeyedSeq$$1) {
    function FromEntriesSequence(entries) {
      this._iter = entries;
      this.size = entries.size;
    }

    if (KeyedSeq$$1) FromEntriesSequence.__proto__ = KeyedSeq$$1;
    FromEntriesSequence.prototype = Object.create(KeyedSeq$$1 && KeyedSeq$$1.prototype);
    FromEntriesSequence.prototype.constructor = FromEntriesSequence;

    FromEntriesSequence.prototype.entrySeq = function entrySeq() {
      return this._iter.toSeq();
    };

    FromEntriesSequence.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      return this._iter.__iterate(function (entry) {
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          var indexedCollection = isCollection(entry);
          return fn(indexedCollection ? entry.get(1) : entry[1], indexedCollection ? entry.get(0) : entry[0], this$1);
        }
      }, reverse);
    };

    FromEntriesSequence.prototype.__iterator = function __iterator(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

      return new Iterator(function () {
        while (true) {
          var step = iterator.next();

          if (step.done) {
            return step;
          }

          var entry = step.value; // Check if entry exists first so array access doesn't throw for holes
          // in the parent iteration.

          if (entry) {
            validateEntry(entry);
            var indexedCollection = isCollection(entry);
            return iteratorValue(type, indexedCollection ? entry.get(0) : entry[0], indexedCollection ? entry.get(1) : entry[1], step);
          }
        }
      });
    };

    return FromEntriesSequence;
  }(KeyedSeq);

  ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;

  function flipFactory(collection) {
    var flipSequence = makeSequence(collection);
    flipSequence._iter = collection;
    flipSequence.size = collection.size;

    flipSequence.flip = function () {
      return collection;
    };

    flipSequence.reverse = function () {
      var reversedSequence = collection.reverse.apply(this); // super.reverse()

      reversedSequence.flip = function () {
        return collection.reverse();
      };

      return reversedSequence;
    };

    flipSequence.has = function (key) {
      return collection.includes(key);
    };

    flipSequence.includes = function (key) {
      return collection.has(key);
    };

    flipSequence.cacheResult = cacheResultThrough;

    flipSequence.__iterateUncached = function (fn, reverse) {
      var this$1 = this;
      return collection.__iterate(function (v, k) {
        return fn(k, v, this$1) !== false;
      }, reverse);
    };

    flipSequence.__iteratorUncached = function (type, reverse) {
      if (type === ITERATE_ENTRIES) {
        var iterator = collection.__iterator(type, reverse);

        return new Iterator(function () {
          var step = iterator.next();

          if (!step.done) {
            var k = step.value[0];
            step.value[0] = step.value[1];
            step.value[1] = k;
          }

          return step;
        });
      }

      return collection.__iterator(type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES, reverse);
    };

    return flipSequence;
  }

  function mapFactory(collection, mapper, context) {
    var mappedSequence = makeSequence(collection);
    mappedSequence.size = collection.size;

    mappedSequence.has = function (key) {
      return collection.has(key);
    };

    mappedSequence.get = function (key, notSetValue) {
      var v = collection.get(key, NOT_SET);
      return v === NOT_SET ? notSetValue : mapper.call(context, v, key, collection);
    };

    mappedSequence.__iterateUncached = function (fn, reverse) {
      var this$1 = this;
      return collection.__iterate(function (v, k, c) {
        return fn(mapper.call(context, v, k, c), k, this$1) !== false;
      }, reverse);
    };

    mappedSequence.__iteratorUncached = function (type, reverse) {
      var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

      return new Iterator(function () {
        var step = iterator.next();

        if (step.done) {
          return step;
        }

        var entry = step.value;
        var key = entry[0];
        return iteratorValue(type, key, mapper.call(context, entry[1], key, collection), step);
      });
    };

    return mappedSequence;
  }

  function reverseFactory(collection, useKeys) {
    var this$1 = this;
    var reversedSequence = makeSequence(collection);
    reversedSequence._iter = collection;
    reversedSequence.size = collection.size;

    reversedSequence.reverse = function () {
      return collection;
    };

    if (collection.flip) {
      reversedSequence.flip = function () {
        var flipSequence = flipFactory(collection);

        flipSequence.reverse = function () {
          return collection.flip();
        };

        return flipSequence;
      };
    }

    reversedSequence.get = function (key, notSetValue) {
      return collection.get(useKeys ? key : -1 - key, notSetValue);
    };

    reversedSequence.has = function (key) {
      return collection.has(useKeys ? key : -1 - key);
    };

    reversedSequence.includes = function (value) {
      return collection.includes(value);
    };

    reversedSequence.cacheResult = cacheResultThrough;

    reversedSequence.__iterate = function (fn, reverse) {
      var this$1 = this;
      var i = 0;
      reverse && ensureSize(collection);
      return collection.__iterate(function (v, k) {
        return fn(v, useKeys ? k : reverse ? this$1.size - ++i : i++, this$1);
      }, !reverse);
    };

    reversedSequence.__iterator = function (type, reverse) {
      var i = 0;
      reverse && ensureSize(collection);

      var iterator = collection.__iterator(ITERATE_ENTRIES, !reverse);

      return new Iterator(function () {
        var step = iterator.next();

        if (step.done) {
          return step;
        }

        var entry = step.value;
        return iteratorValue(type, useKeys ? entry[0] : reverse ? this$1.size - ++i : i++, entry[1], step);
      });
    };

    return reversedSequence;
  }

  function filterFactory(collection, predicate, context, useKeys) {
    var filterSequence = makeSequence(collection);

    if (useKeys) {
      filterSequence.has = function (key) {
        var v = collection.get(key, NOT_SET);
        return v !== NOT_SET && !!predicate.call(context, v, key, collection);
      };

      filterSequence.get = function (key, notSetValue) {
        var v = collection.get(key, NOT_SET);
        return v !== NOT_SET && predicate.call(context, v, key, collection) ? v : notSetValue;
      };
    }

    filterSequence.__iterateUncached = function (fn, reverse) {
      var this$1 = this;
      var iterations = 0;

      collection.__iterate(function (v, k, c) {
        if (predicate.call(context, v, k, c)) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$1);
        }
      }, reverse);

      return iterations;
    };

    filterSequence.__iteratorUncached = function (type, reverse) {
      var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

      var iterations = 0;
      return new Iterator(function () {
        while (true) {
          var step = iterator.next();

          if (step.done) {
            return step;
          }

          var entry = step.value;
          var key = entry[0];
          var value = entry[1];

          if (predicate.call(context, value, key, collection)) {
            return iteratorValue(type, useKeys ? key : iterations++, value, step);
          }
        }
      });
    };

    return filterSequence;
  }

  function countByFactory(collection, grouper, context) {
    var groups = Map$1().asMutable();

    collection.__iterate(function (v, k) {
      groups.update(grouper.call(context, v, k, collection), 0, function (a) {
        return a + 1;
      });
    });

    return groups.asImmutable();
  }

  function groupByFactory(collection, grouper, context) {
    var isKeyedIter = isKeyed(collection);
    var groups = (isOrdered(collection) ? OrderedMap() : Map$1()).asMutable();

    collection.__iterate(function (v, k) {
      groups.update(grouper.call(context, v, k, collection), function (a) {
        return a = a || [], a.push(isKeyedIter ? [k, v] : v), a;
      });
    });

    var coerce = collectionClass(collection);
    return groups.map(function (arr) {
      return reify(collection, coerce(arr));
    });
  }

  function sliceFactory(collection, begin, end, useKeys) {
    var originalSize = collection.size;

    if (wholeSlice(begin, end, originalSize)) {
      return collection;
    }

    var resolvedBegin = resolveBegin(begin, originalSize);
    var resolvedEnd = resolveEnd(end, originalSize); // begin or end will be NaN if they were provided as negative numbers and
    // this collection's size is unknown. In that case, cache first so there is
    // a known size and these do not resolve to NaN.

    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
      return sliceFactory(collection.toSeq().cacheResult(), begin, end, useKeys);
    } // Note: resolvedEnd is undefined when the original sequence's length is
    // unknown and this slice did not supply an end and should contain all
    // elements after resolvedBegin.
    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.


    var resolvedSize = resolvedEnd - resolvedBegin;
    var sliceSize;

    if (resolvedSize === resolvedSize) {
      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
    }

    var sliceSeq = makeSequence(collection); // If collection.size is undefined, the size of the realized sliceSeq is
    // unknown at this point unless the number of items to slice is 0

    sliceSeq.size = sliceSize === 0 ? sliceSize : collection.size && sliceSize || undefined;

    if (!useKeys && isSeq(collection) && sliceSize >= 0) {
      sliceSeq.get = function (index, notSetValue) {
        index = wrapIndex(this, index);
        return index >= 0 && index < sliceSize ? collection.get(index + resolvedBegin, notSetValue) : notSetValue;
      };
    }

    sliceSeq.__iterateUncached = function (fn, reverse) {
      var this$1 = this;

      if (sliceSize === 0) {
        return 0;
      }

      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }

      var skipped = 0;
      var isSkipping = true;
      var iterations = 0;

      collection.__iterate(function (v, k) {
        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$1) !== false && iterations !== sliceSize;
        }
      });

      return iterations;
    };

    sliceSeq.__iteratorUncached = function (type, reverse) {
      if (sliceSize !== 0 && reverse) {
        return this.cacheResult().__iterator(type, reverse);
      } // Don't bother instantiating parent iterator if taking 0.


      if (sliceSize === 0) {
        return new Iterator(iteratorDone);
      }

      var iterator = collection.__iterator(type, reverse);

      var skipped = 0;
      var iterations = 0;
      return new Iterator(function () {
        while (skipped++ < resolvedBegin) {
          iterator.next();
        }

        if (++iterations > sliceSize) {
          return iteratorDone();
        }

        var step = iterator.next();

        if (useKeys || type === ITERATE_VALUES || step.done) {
          return step;
        }

        if (type === ITERATE_KEYS) {
          return iteratorValue(type, iterations - 1, undefined, step);
        }

        return iteratorValue(type, iterations - 1, step.value[1], step);
      });
    };

    return sliceSeq;
  }

  function takeWhileFactory(collection, predicate, context) {
    var takeSequence = makeSequence(collection);

    takeSequence.__iterateUncached = function (fn, reverse) {
      var this$1 = this;

      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }

      var iterations = 0;

      collection.__iterate(function (v, k, c) {
        return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$1);
      });

      return iterations;
    };

    takeSequence.__iteratorUncached = function (type, reverse) {
      var this$1 = this;

      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }

      var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

      var iterating = true;
      return new Iterator(function () {
        if (!iterating) {
          return iteratorDone();
        }

        var step = iterator.next();

        if (step.done) {
          return step;
        }

        var entry = step.value;
        var k = entry[0];
        var v = entry[1];

        if (!predicate.call(context, v, k, this$1)) {
          iterating = false;
          return iteratorDone();
        }

        return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
      });
    };

    return takeSequence;
  }

  function skipWhileFactory(collection, predicate, context, useKeys) {
    var skipSequence = makeSequence(collection);

    skipSequence.__iterateUncached = function (fn, reverse) {
      var this$1 = this;

      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }

      var isSkipping = true;
      var iterations = 0;

      collection.__iterate(function (v, k, c) {
        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$1);
        }
      });

      return iterations;
    };

    skipSequence.__iteratorUncached = function (type, reverse) {
      var this$1 = this;

      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }

      var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

      var skipping = true;
      var iterations = 0;
      return new Iterator(function () {
        var step;
        var k;
        var v;

        do {
          step = iterator.next();

          if (step.done) {
            if (useKeys || type === ITERATE_VALUES) {
              return step;
            }

            if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations++, undefined, step);
            }

            return iteratorValue(type, iterations++, step.value[1], step);
          }

          var entry = step.value;
          k = entry[0];
          v = entry[1];
          skipping && (skipping = predicate.call(context, v, k, this$1));
        } while (skipping);

        return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
      });
    };

    return skipSequence;
  }

  function concatFactory(collection, values) {
    var isKeyedCollection = isKeyed(collection);
    var iters = [collection].concat(values).map(function (v) {
      if (!isCollection(v)) {
        v = isKeyedCollection ? keyedSeqFromValue(v) : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
      } else if (isKeyedCollection) {
        v = KeyedCollection(v);
      }

      return v;
    }).filter(function (v) {
      return v.size !== 0;
    });

    if (iters.length === 0) {
      return collection;
    }

    if (iters.length === 1) {
      var singleton = iters[0];

      if (singleton === collection || isKeyedCollection && isKeyed(singleton) || isIndexed(collection) && isIndexed(singleton)) {
        return singleton;
      }
    }

    var concatSeq = new ArraySeq(iters);

    if (isKeyedCollection) {
      concatSeq = concatSeq.toKeyedSeq();
    } else if (!isIndexed(collection)) {
      concatSeq = concatSeq.toSetSeq();
    }

    concatSeq = concatSeq.flatten(true);
    concatSeq.size = iters.reduce(function (sum, seq) {
      if (sum !== undefined) {
        var size = seq.size;

        if (size !== undefined) {
          return sum + size;
        }
      }
    }, 0);
    return concatSeq;
  }

  function flattenFactory(collection, depth, useKeys) {
    var flatSequence = makeSequence(collection);

    flatSequence.__iterateUncached = function (fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }

      var iterations = 0;
      var stopped = false;

      function flatDeep(iter, currentDepth) {
        iter.__iterate(function (v, k) {
          if ((!depth || currentDepth < depth) && isCollection(v)) {
            flatDeep(v, currentDepth + 1);
          } else {
            iterations++;

            if (fn(v, useKeys ? k : iterations - 1, flatSequence) === false) {
              stopped = true;
            }
          }

          return !stopped;
        }, reverse);
      }

      flatDeep(collection, 0);
      return iterations;
    };

    flatSequence.__iteratorUncached = function (type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }

      var iterator = collection.__iterator(type, reverse);

      var stack = [];
      var iterations = 0;
      return new Iterator(function () {
        while (iterator) {
          var step = iterator.next();

          if (step.done !== false) {
            iterator = stack.pop();
            continue;
          }

          var v = step.value;

          if (type === ITERATE_ENTRIES) {
            v = v[1];
          }

          if ((!depth || stack.length < depth) && isCollection(v)) {
            stack.push(iterator);
            iterator = v.__iterator(type, reverse);
          } else {
            return useKeys ? step : iteratorValue(type, iterations++, v, step);
          }
        }

        return iteratorDone();
      });
    };

    return flatSequence;
  }

  function flatMapFactory(collection, mapper, context) {
    var coerce = collectionClass(collection);
    return collection.toSeq().map(function (v, k) {
      return coerce(mapper.call(context, v, k, collection));
    }).flatten(true);
  }

  function interposeFactory(collection, separator) {
    var interposedSequence = makeSequence(collection);
    interposedSequence.size = collection.size && collection.size * 2 - 1;

    interposedSequence.__iterateUncached = function (fn, reverse) {
      var this$1 = this;
      var iterations = 0;

      collection.__iterate(function (v) {
        return (!iterations || fn(separator, iterations++, this$1) !== false) && fn(v, iterations++, this$1) !== false;
      }, reverse);

      return iterations;
    };

    interposedSequence.__iteratorUncached = function (type, reverse) {
      var iterator = collection.__iterator(ITERATE_VALUES, reverse);

      var iterations = 0;
      var step;
      return new Iterator(function () {
        if (!step || iterations % 2) {
          step = iterator.next();

          if (step.done) {
            return step;
          }
        }

        return iterations % 2 ? iteratorValue(type, iterations++, separator) : iteratorValue(type, iterations++, step.value, step);
      });
    };

    return interposedSequence;
  }

  function sortFactory(collection, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }

    var isKeyedCollection = isKeyed(collection);
    var index = 0;
    var entries = collection.toSeq().map(function (v, k) {
      return [k, v, index++, mapper ? mapper(v, k, collection) : v];
    }).valueSeq().toArray();
    entries.sort(function (a, b) {
      return comparator(a[3], b[3]) || a[2] - b[2];
    }).forEach(isKeyedCollection ? function (v, i) {
      entries[i].length = 2;
    } : function (v, i) {
      entries[i] = v[1];
    });
    return isKeyedCollection ? KeyedSeq(entries) : isIndexed(collection) ? IndexedSeq(entries) : SetSeq(entries);
  }

  function maxFactory(collection, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }

    if (mapper) {
      var entry = collection.toSeq().map(function (v, k) {
        return [v, mapper(v, k, collection)];
      }).reduce(function (a, b) {
        return maxCompare(comparator, a[1], b[1]) ? b : a;
      });
      return entry && entry[0];
    }

    return collection.reduce(function (a, b) {
      return maxCompare(comparator, a, b) ? b : a;
    });
  }

  function maxCompare(comparator, a, b) {
    var comp = comparator(b, a); // b is considered the new max if the comparator declares them equal, but
    // they are not equal and b is in fact a nullish value.

    return comp === 0 && b !== a && (b === undefined || b === null || b !== b) || comp > 0;
  }

  function zipWithFactory(keyIter, zipper, iters, zipAll) {
    var zipSequence = makeSequence(keyIter);
    var sizes = new ArraySeq(iters).map(function (i) {
      return i.size;
    });
    zipSequence.size = zipAll ? sizes.max() : sizes.min(); // Note: this a generic base implementation of __iterate in terms of
    // __iterator which may be more generically useful in the future.

    zipSequence.__iterate = function (fn, reverse) {
      var this$1 = this;
      /* generic:
        var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
        var step;
        var iterations = 0;
        while (!(step = iterator.next()).done) {
          iterations++;
          if (fn(step.value[1], step.value[0], this) === false) {
            break;
          }
        }
        return iterations;
        */
      // indexed:

      var iterator = this.__iterator(ITERATE_VALUES, reverse);

      var step;
      var iterations = 0;

      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this$1) === false) {
          break;
        }
      }

      return iterations;
    };

    zipSequence.__iteratorUncached = function (type, reverse) {
      var iterators = iters.map(function (i) {
        return i = Collection(i), getIterator(reverse ? i.reverse() : i);
      });
      var iterations = 0;
      var isDone = false;
      return new Iterator(function () {
        var steps;

        if (!isDone) {
          steps = iterators.map(function (i) {
            return i.next();
          });
          isDone = zipAll ? steps.every(function (s) {
            return s.done;
          }) : steps.some(function (s) {
            return s.done;
          });
        }

        if (isDone) {
          return iteratorDone();
        }

        return iteratorValue(type, iterations++, zipper.apply(null, steps.map(function (s) {
          return s.value;
        })));
      });
    };

    return zipSequence;
  } // #pragma Helper Functions


  function reify(iter, seq) {
    return iter === seq ? iter : isSeq(iter) ? seq : iter.constructor(seq);
  }

  function validateEntry(entry) {
    if (entry !== Object(entry)) {
      throw new TypeError('Expected [K, V] tuple: ' + entry);
    }
  }

  function collectionClass(collection) {
    return isKeyed(collection) ? KeyedCollection : isIndexed(collection) ? IndexedCollection : SetCollection;
  }

  function makeSequence(collection) {
    return Object.create((isKeyed(collection) ? KeyedSeq : isIndexed(collection) ? IndexedSeq : SetSeq).prototype);
  }

  function cacheResultThrough() {
    if (this._iter.cacheResult) {
      this._iter.cacheResult();

      this.size = this._iter.size;
      return this;
    }

    return Seq.prototype.cacheResult.call(this);
  }

  function defaultComparator(a, b) {
    if (a === undefined && b === undefined) {
      return 0;
    }

    if (a === undefined) {
      return 1;
    }

    if (b === undefined) {
      return -1;
    }

    return a > b ? 1 : a < b ? -1 : 0;
  } // http://jsperf.com/copy-array-inline


  function arrCopy(arr, offset) {
    offset = offset || 0;
    var len = Math.max(0, arr.length - offset);
    var newArr = new Array(len);

    for (var ii = 0; ii < len; ii++) {
      newArr[ii] = arr[ii + offset];
    }

    return newArr;
  }

  function invariant(condition, error) {
    if (!condition) {
      throw new Error(error);
    }
  }

  function assertNotInfinite(size) {
    invariant(size !== Infinity, 'Cannot perform this action with an infinite size.');
  }

  function coerceKeyPath(keyPath) {
    if (isArrayLike$1(keyPath) && typeof keyPath !== 'string') {
      return keyPath;
    }

    if (isOrdered(keyPath)) {
      return keyPath.toArray();
    }

    throw new TypeError('Invalid keyPath: expected Ordered Collection or Array: ' + keyPath);
  }

  function isPlainObj(value) {
    return value && (value.constructor === Object || value.constructor === undefined);
  }
  /**
   * Returns true if the value is a potentially-persistent data structure, either
   * provided by Immutable.js or a plain Array or Object.
   */


  function isDataStructure(value) {
    return isImmutable(value) || Array.isArray(value) || isPlainObj(value);
  }
  /**
   * Converts a value to a string, adding quotes if a string was provided.
   */


  function quoteString(value) {
    try {
      return typeof value === 'string' ? JSON.stringify(value) : String(value);
    } catch (_ignoreError) {
      return JSON.stringify(value);
    }
  }

  function has(collection, key) {
    return isImmutable(collection) ? collection.has(key) : isDataStructure(collection) && hasOwnProperty.call(collection, key);
  }

  function get$1(collection, key, notSetValue) {
    return isImmutable(collection) ? collection.get(key, notSetValue) : !has(collection, key) ? notSetValue : typeof collection.get === 'function' ? collection.get(key) : collection[key];
  }

  function shallowCopy(from) {
    if (Array.isArray(from)) {
      return arrCopy(from);
    }

    var to = {};

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    return to;
  }

  function remove(collection, key) {
    if (!isDataStructure(collection)) {
      throw new TypeError('Cannot update non-data-structure value: ' + collection);
    }

    if (isImmutable(collection)) {
      if (!collection.remove) {
        throw new TypeError('Cannot update immutable value without .remove() method: ' + collection);
      }

      return collection.remove(key);
    }

    if (!hasOwnProperty.call(collection, key)) {
      return collection;
    }

    var collectionCopy = shallowCopy(collection);

    if (Array.isArray(collectionCopy)) {
      collectionCopy.splice(key, 1);
    } else {
      delete collectionCopy[key];
    }

    return collectionCopy;
  }

  function set$1(collection, key, value) {
    if (!isDataStructure(collection)) {
      throw new TypeError('Cannot update non-data-structure value: ' + collection);
    }

    if (isImmutable(collection)) {
      if (!collection.set) {
        throw new TypeError('Cannot update immutable value without .set() method: ' + collection);
      }

      return collection.set(key, value);
    }

    if (hasOwnProperty.call(collection, key) && value === collection[key]) {
      return collection;
    }

    var collectionCopy = shallowCopy(collection);
    collectionCopy[key] = value;
    return collectionCopy;
  }

  function updateIn(collection, keyPath, notSetValue, updater) {
    if (!updater) {
      updater = notSetValue;
      notSetValue = undefined;
    }

    var updatedValue = updateInDeeply(isImmutable(collection), collection, coerceKeyPath(keyPath), 0, notSetValue, updater);
    return updatedValue === NOT_SET ? notSetValue : updatedValue;
  }

  function updateInDeeply(inImmutable, existing, keyPath, i, notSetValue, updater) {
    var wasNotSet = existing === NOT_SET;

    if (i === keyPath.length) {
      var existingValue = wasNotSet ? notSetValue : existing;
      var newValue = updater(existingValue);
      return newValue === existingValue ? existing : newValue;
    }

    if (!wasNotSet && !isDataStructure(existing)) {
      throw new TypeError('Cannot update within non-data-structure value in path [' + keyPath.slice(0, i).map(quoteString) + ']: ' + existing);
    }

    var key = keyPath[i];
    var nextExisting = wasNotSet ? NOT_SET : get$1(existing, key, NOT_SET);
    var nextUpdated = updateInDeeply(nextExisting === NOT_SET ? inImmutable : isImmutable(nextExisting), nextExisting, keyPath, i + 1, notSetValue, updater);
    return nextUpdated === nextExisting ? existing : nextUpdated === NOT_SET ? remove(existing, key) : set$1(wasNotSet ? inImmutable ? emptyMap() : {} : existing, key, nextUpdated);
  }

  function setIn$1(collection, keyPath, value) {
    return updateIn(collection, keyPath, NOT_SET, function () {
      return value;
    });
  }

  function setIn$$1(keyPath, v) {
    return setIn$1(this, keyPath, v);
  }

  function removeIn(collection, keyPath) {
    return updateIn(collection, keyPath, function () {
      return NOT_SET;
    });
  }

  function deleteIn(keyPath) {
    return removeIn(this, keyPath);
  }

  function update$1(collection, key, notSetValue, updater) {
    return updateIn(collection, [key], notSetValue, updater);
  }

  function update$$1(key, notSetValue, updater) {
    return arguments.length === 1 ? key(this) : update$1(this, key, notSetValue, updater);
  }

  function updateIn$1(keyPath, notSetValue, updater) {
    return updateIn(this, keyPath, notSetValue, updater);
  }

  function merge() {
    var iters = [],
        len = arguments.length;

    while (len--) iters[len] = arguments[len];

    return mergeIntoKeyedWith(this, iters);
  }

  function mergeWith(merger) {
    var iters = [],
        len = arguments.length - 1;

    while (len-- > 0) iters[len] = arguments[len + 1];

    return mergeIntoKeyedWith(this, iters, merger);
  }

  function mergeIntoKeyedWith(collection, collections, merger) {
    var iters = [];

    for (var ii = 0; ii < collections.length; ii++) {
      var collection$1 = KeyedCollection(collections[ii]);

      if (collection$1.size !== 0) {
        iters.push(collection$1);
      }
    }

    if (iters.length === 0) {
      return collection;
    }

    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
      return collection.constructor(iters[0]);
    }

    return collection.withMutations(function (collection) {
      var mergeIntoCollection = merger ? function (value, key) {
        update$1(collection, key, NOT_SET, function (oldVal) {
          return oldVal === NOT_SET ? value : merger(oldVal, value, key);
        });
      } : function (value, key) {
        collection.set(key, value);
      };

      for (var ii = 0; ii < iters.length; ii++) {
        iters[ii].forEach(mergeIntoCollection);
      }
    });
  }

  function mergeDeepWithSources(collection, sources, merger) {
    return mergeWithSources(collection, sources, deepMergerWith(merger));
  }

  function mergeWithSources(collection, sources, merger) {
    if (!isDataStructure(collection)) {
      throw new TypeError('Cannot merge into non-data-structure value: ' + collection);
    }

    if (isImmutable(collection)) {
      return collection.mergeWith ? collection.mergeWith.apply(collection, [merger].concat(sources)) : collection.concat.apply(collection, sources);
    }

    var isArray = Array.isArray(collection);
    var merged = collection;
    var Collection$$1 = isArray ? IndexedCollection : KeyedCollection;
    var mergeItem = isArray ? function (value) {
      // Copy on write
      if (merged === collection) {
        merged = shallowCopy(merged);
      }

      merged.push(value);
    } : function (value, key) {
      var hasVal = hasOwnProperty.call(merged, key);
      var nextVal = hasVal && merger ? merger(merged[key], value, key) : value;

      if (!hasVal || nextVal !== merged[key]) {
        // Copy on write
        if (merged === collection) {
          merged = shallowCopy(merged);
        }

        merged[key] = nextVal;
      }
    };

    for (var i = 0; i < sources.length; i++) {
      Collection$$1(sources[i]).forEach(mergeItem);
    }

    return merged;
  }

  function deepMergerWith(merger) {
    function deepMerger(oldValue, newValue, key) {
      return isDataStructure(oldValue) && isDataStructure(newValue) ? mergeWithSources(oldValue, [newValue], deepMerger) : merger ? merger(oldValue, newValue, key) : newValue;
    }

    return deepMerger;
  }

  function mergeDeep() {
    var iters = [],
        len = arguments.length;

    while (len--) iters[len] = arguments[len];

    return mergeDeepWithSources(this, iters);
  }

  function mergeDeepWith(merger) {
    var iters = [],
        len = arguments.length - 1;

    while (len-- > 0) iters[len] = arguments[len + 1];

    return mergeDeepWithSources(this, iters, merger);
  }

  function mergeIn(keyPath) {
    var iters = [],
        len = arguments.length - 1;

    while (len-- > 0) iters[len] = arguments[len + 1];

    return updateIn(this, keyPath, emptyMap(), function (m) {
      return mergeWithSources(m, iters);
    });
  }

  function mergeDeepIn(keyPath) {
    var iters = [],
        len = arguments.length - 1;

    while (len-- > 0) iters[len] = arguments[len + 1];

    return updateIn(this, keyPath, emptyMap(), function (m) {
      return mergeDeepWithSources(m, iters);
    });
  }

  function withMutations(fn) {
    var mutable = this.asMutable();
    fn(mutable);
    return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
  }

  function asMutable() {
    return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
  }

  function asImmutable() {
    return this.__ensureOwner();
  }

  function wasAltered() {
    return this.__altered;
  }

  var Map$1 = function (KeyedCollection$$1) {
    function Map(value) {
      return value === null || value === undefined ? emptyMap() : isMap(value) && !isOrdered(value) ? value : emptyMap().withMutations(function (map) {
        var iter = KeyedCollection$$1(value);
        assertNotInfinite(iter.size);
        iter.forEach(function (v, k) {
          return map.set(k, v);
        });
      });
    }

    if (KeyedCollection$$1) Map.__proto__ = KeyedCollection$$1;
    Map.prototype = Object.create(KeyedCollection$$1 && KeyedCollection$$1.prototype);
    Map.prototype.constructor = Map;

    Map.of = function of() {
      var keyValues = [],
          len = arguments.length;

      while (len--) keyValues[len] = arguments[len];

      return emptyMap().withMutations(function (map) {
        for (var i = 0; i < keyValues.length; i += 2) {
          if (i + 1 >= keyValues.length) {
            throw new Error('Missing value for key: ' + keyValues[i]);
          }

          map.set(keyValues[i], keyValues[i + 1]);
        }
      });
    };

    Map.prototype.toString = function toString() {
      return this.__toString('Map {', '}');
    }; // @pragma Access


    Map.prototype.get = function get(k, notSetValue) {
      return this._root ? this._root.get(0, undefined, k, notSetValue) : notSetValue;
    }; // @pragma Modification


    Map.prototype.set = function set(k, v) {
      return updateMap(this, k, v);
    };

    Map.prototype.remove = function remove(k) {
      return updateMap(this, k, NOT_SET);
    };

    Map.prototype.deleteAll = function deleteAll(keys) {
      var collection = Collection(keys);

      if (collection.size === 0) {
        return this;
      }

      return this.withMutations(function (map) {
        collection.forEach(function (key) {
          return map.remove(key);
        });
      });
    };

    Map.prototype.clear = function clear() {
      if (this.size === 0) {
        return this;
      }

      if (this.__ownerID) {
        this.size = 0;
        this._root = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return emptyMap();
    }; // @pragma Composition


    Map.prototype.sort = function sort(comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator));
    };

    Map.prototype.sortBy = function sortBy(mapper, comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator, mapper));
    }; // @pragma Mutability


    Map.prototype.__iterator = function __iterator(type, reverse) {
      return new MapIterator(this, type, reverse);
    };

    Map.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      var iterations = 0;
      this._root && this._root.iterate(function (entry) {
        iterations++;
        return fn(entry[1], entry[0], this$1);
      }, reverse);
      return iterations;
    };

    Map.prototype.__ensureOwner = function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      if (!ownerID) {
        if (this.size === 0) {
          return emptyMap();
        }

        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }

      return makeMap(this.size, this._root, ownerID, this.__hash);
    };

    return Map;
  }(KeyedCollection);

  function isMap(maybeMap) {
    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
  }

  Map$1.isMap = isMap;
  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';
  var MapPrototype = Map$1.prototype;
  MapPrototype[IS_MAP_SENTINEL] = true;
  MapPrototype[DELETE] = MapPrototype.remove;
  MapPrototype.removeAll = MapPrototype.deleteAll;
  MapPrototype.concat = MapPrototype.merge;
  MapPrototype.setIn = setIn$$1;
  MapPrototype.removeIn = MapPrototype.deleteIn = deleteIn;
  MapPrototype.update = update$$1;
  MapPrototype.updateIn = updateIn$1;
  MapPrototype.merge = merge;
  MapPrototype.mergeWith = mergeWith;
  MapPrototype.mergeDeep = mergeDeep;
  MapPrototype.mergeDeepWith = mergeDeepWith;
  MapPrototype.mergeIn = mergeIn;
  MapPrototype.mergeDeepIn = mergeDeepIn;
  MapPrototype.withMutations = withMutations;
  MapPrototype.wasAltered = wasAltered;
  MapPrototype.asImmutable = asImmutable;
  MapPrototype['@@transducer/init'] = MapPrototype.asMutable = asMutable;

  MapPrototype['@@transducer/step'] = function (result, arr) {
    return result.set(arr[0], arr[1]);
  };

  MapPrototype['@@transducer/result'] = function (obj) {
    return obj.asImmutable();
  }; // #pragma Trie Nodes


  var ArrayMapNode = function ArrayMapNode(ownerID, entries) {
    this.ownerID = ownerID;
    this.entries = entries;
  };

  ArrayMapNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
    var entries = this.entries;

    for (var ii = 0, len = entries.length; ii < len; ii++) {
      if (is(key, entries[ii][0])) {
        return entries[ii][1];
      }
    }

    return notSetValue;
  };

  ArrayMapNode.prototype.update = function update$$1(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    var removed = value === NOT_SET;
    var entries = this.entries;
    var idx = 0;
    var len = entries.length;

    for (; idx < len; idx++) {
      if (is(key, entries[idx][0])) {
        break;
      }
    }

    var exists = idx < len;

    if (exists ? entries[idx][1] === value : removed) {
      return this;
    }

    SetRef(didAlter);
    (removed || !exists) && SetRef(didChangeSize);

    if (removed && entries.length === 1) {
      return; // undefined
    }

    if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
      return createNodes(ownerID, entries, key, value);
    }

    var isEditable = ownerID && ownerID === this.ownerID;
    var newEntries = isEditable ? entries : arrCopy(entries);

    if (exists) {
      if (removed) {
        idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop();
      } else {
        newEntries[idx] = [key, value];
      }
    } else {
      newEntries.push([key, value]);
    }

    if (isEditable) {
      this.entries = newEntries;
      return this;
    }

    return new ArrayMapNode(ownerID, newEntries);
  };

  var BitmapIndexedNode = function BitmapIndexedNode(ownerID, bitmap, nodes) {
    this.ownerID = ownerID;
    this.bitmap = bitmap;
    this.nodes = nodes;
  };

  BitmapIndexedNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
    if (keyHash === undefined) {
      keyHash = hash(key);
    }

    var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
    var bitmap = this.bitmap;
    return (bitmap & bit) === 0 ? notSetValue : this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT, keyHash, key, notSetValue);
  };

  BitmapIndexedNode.prototype.update = function update$$1(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (keyHash === undefined) {
      keyHash = hash(key);
    }

    var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
    var bit = 1 << keyHashFrag;
    var bitmap = this.bitmap;
    var exists = (bitmap & bit) !== 0;

    if (!exists && value === NOT_SET) {
      return this;
    }

    var idx = popCount(bitmap & bit - 1);
    var nodes = this.nodes;
    var node = exists ? nodes[idx] : undefined;
    var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

    if (newNode === node) {
      return this;
    }

    if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
      return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
    }

    if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
      return nodes[idx ^ 1];
    }

    if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
      return newNode;
    }

    var isEditable = ownerID && ownerID === this.ownerID;
    var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
    var newNodes = exists ? newNode ? setAt(nodes, idx, newNode, isEditable) : spliceOut(nodes, idx, isEditable) : spliceIn(nodes, idx, newNode, isEditable);

    if (isEditable) {
      this.bitmap = newBitmap;
      this.nodes = newNodes;
      return this;
    }

    return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
  };

  var HashArrayMapNode = function HashArrayMapNode(ownerID, count, nodes) {
    this.ownerID = ownerID;
    this.count = count;
    this.nodes = nodes;
  };

  HashArrayMapNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
    if (keyHash === undefined) {
      keyHash = hash(key);
    }

    var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
    var node = this.nodes[idx];
    return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
  };

  HashArrayMapNode.prototype.update = function update$$1(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (keyHash === undefined) {
      keyHash = hash(key);
    }

    var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
    var removed = value === NOT_SET;
    var nodes = this.nodes;
    var node = nodes[idx];

    if (removed && !node) {
      return this;
    }

    var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

    if (newNode === node) {
      return this;
    }

    var newCount = this.count;

    if (!node) {
      newCount++;
    } else if (!newNode) {
      newCount--;

      if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
        return packNodes(ownerID, nodes, newCount, idx);
      }
    }

    var isEditable = ownerID && ownerID === this.ownerID;
    var newNodes = setAt(nodes, idx, newNode, isEditable);

    if (isEditable) {
      this.count = newCount;
      this.nodes = newNodes;
      return this;
    }

    return new HashArrayMapNode(ownerID, newCount, newNodes);
  };

  var HashCollisionNode = function HashCollisionNode(ownerID, keyHash, entries) {
    this.ownerID = ownerID;
    this.keyHash = keyHash;
    this.entries = entries;
  };

  HashCollisionNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
    var entries = this.entries;

    for (var ii = 0, len = entries.length; ii < len; ii++) {
      if (is(key, entries[ii][0])) {
        return entries[ii][1];
      }
    }

    return notSetValue;
  };

  HashCollisionNode.prototype.update = function update$$1(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (keyHash === undefined) {
      keyHash = hash(key);
    }

    var removed = value === NOT_SET;

    if (keyHash !== this.keyHash) {
      if (removed) {
        return this;
      }

      SetRef(didAlter);
      SetRef(didChangeSize);
      return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
    }

    var entries = this.entries;
    var idx = 0;
    var len = entries.length;

    for (; idx < len; idx++) {
      if (is(key, entries[idx][0])) {
        break;
      }
    }

    var exists = idx < len;

    if (exists ? entries[idx][1] === value : removed) {
      return this;
    }

    SetRef(didAlter);
    (removed || !exists) && SetRef(didChangeSize);

    if (removed && len === 2) {
      return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
    }

    var isEditable = ownerID && ownerID === this.ownerID;
    var newEntries = isEditable ? entries : arrCopy(entries);

    if (exists) {
      if (removed) {
        idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop();
      } else {
        newEntries[idx] = [key, value];
      }
    } else {
      newEntries.push([key, value]);
    }

    if (isEditable) {
      this.entries = newEntries;
      return this;
    }

    return new HashCollisionNode(ownerID, this.keyHash, newEntries);
  };

  var ValueNode = function ValueNode(ownerID, keyHash, entry) {
    this.ownerID = ownerID;
    this.keyHash = keyHash;
    this.entry = entry;
  };

  ValueNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
    return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
  };

  ValueNode.prototype.update = function update$$1(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    var removed = value === NOT_SET;
    var keyMatch = is(key, this.entry[0]);

    if (keyMatch ? value === this.entry[1] : removed) {
      return this;
    }

    SetRef(didAlter);

    if (removed) {
      SetRef(didChangeSize);
      return; // undefined
    }

    if (keyMatch) {
      if (ownerID && ownerID === this.ownerID) {
        this.entry[1] = value;
        return this;
      }

      return new ValueNode(ownerID, this.keyHash, [key, value]);
    }

    SetRef(didChangeSize);
    return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
  }; // #pragma Iterators


  ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function (fn, reverse) {
    var entries = this.entries;

    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
        return false;
      }
    }
  };

  BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function (fn, reverse) {
    var nodes = this.nodes;

    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
      var node = nodes[reverse ? maxIndex - ii : ii];

      if (node && node.iterate(fn, reverse) === false) {
        return false;
      }
    }
  }; // eslint-disable-next-line no-unused-vars


  ValueNode.prototype.iterate = function (fn, reverse) {
    return fn(this.entry);
  };

  var MapIterator = function (Iterator$$1) {
    function MapIterator(map, type, reverse) {
      this._type = type;
      this._reverse = reverse;
      this._stack = map._root && mapIteratorFrame(map._root);
    }

    if (Iterator$$1) MapIterator.__proto__ = Iterator$$1;
    MapIterator.prototype = Object.create(Iterator$$1 && Iterator$$1.prototype);
    MapIterator.prototype.constructor = MapIterator;

    MapIterator.prototype.next = function next() {
      var this$1 = this;
      var type = this._type;
      var stack = this._stack;

      while (stack) {
        var node = stack.node;
        var index = stack.index++;
        var maxIndex = void 0;

        if (node.entry) {
          if (index === 0) {
            return mapIteratorValue(type, node.entry);
          }
        } else if (node.entries) {
          maxIndex = node.entries.length - 1;

          if (index <= maxIndex) {
            return mapIteratorValue(type, node.entries[this$1._reverse ? maxIndex - index : index]);
          }
        } else {
          maxIndex = node.nodes.length - 1;

          if (index <= maxIndex) {
            var subNode = node.nodes[this$1._reverse ? maxIndex - index : index];

            if (subNode) {
              if (subNode.entry) {
                return mapIteratorValue(type, subNode.entry);
              }

              stack = this$1._stack = mapIteratorFrame(subNode, stack);
            }

            continue;
          }
        }

        stack = this$1._stack = this$1._stack.__prev;
      }

      return iteratorDone();
    };

    return MapIterator;
  }(Iterator);

  function mapIteratorValue(type, entry) {
    return iteratorValue(type, entry[0], entry[1]);
  }

  function mapIteratorFrame(node, prev) {
    return {
      node: node,
      index: 0,
      __prev: prev
    };
  }

  function makeMap(size, root, ownerID, hash$$1) {
    var map = Object.create(MapPrototype);
    map.size = size;
    map._root = root;
    map.__ownerID = ownerID;
    map.__hash = hash$$1;
    map.__altered = false;
    return map;
  }

  var EMPTY_MAP;

  function emptyMap() {
    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
  }

  function updateMap(map, k, v) {
    var newRoot;
    var newSize;

    if (!map._root) {
      if (v === NOT_SET) {
        return map;
      }

      newSize = 1;
      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
    } else {
      var didChangeSize = MakeRef(CHANGE_LENGTH);
      var didAlter = MakeRef(DID_ALTER);
      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);

      if (!didAlter.value) {
        return map;
      }

      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
    }

    if (map.__ownerID) {
      map.size = newSize;
      map._root = newRoot;
      map.__hash = undefined;
      map.__altered = true;
      return map;
    }

    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
  }

  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (!node) {
      if (value === NOT_SET) {
        return node;
      }

      SetRef(didAlter);
      SetRef(didChangeSize);
      return new ValueNode(ownerID, keyHash, [key, value]);
    }

    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
  }

  function isLeafNode(node) {
    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
  }

  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
    if (node.keyHash === keyHash) {
      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
    }

    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
    var newNode;
    var nodes = idx1 === idx2 ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] : (newNode = new ValueNode(ownerID, keyHash, entry), idx1 < idx2 ? [node, newNode] : [newNode, node]);
    return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes);
  }

  function createNodes(ownerID, entries, key, value) {
    if (!ownerID) {
      ownerID = new OwnerID();
    }

    var node = new ValueNode(ownerID, hash(key), [key, value]);

    for (var ii = 0; ii < entries.length; ii++) {
      var entry = entries[ii];
      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
    }

    return node;
  }

  function packNodes(ownerID, nodes, count, excluding) {
    var bitmap = 0;
    var packedII = 0;
    var packedNodes = new Array(count);

    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
      var node = nodes[ii];

      if (node !== undefined && ii !== excluding) {
        bitmap |= bit;
        packedNodes[packedII++] = node;
      }
    }

    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
  }

  function expandNodes(ownerID, nodes, bitmap, including, node) {
    var count = 0;
    var expandedNodes = new Array(SIZE);

    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
    }

    expandedNodes[including] = node;
    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
  }

  function popCount(x) {
    x -= x >> 1 & 0x55555555;
    x = (x & 0x33333333) + (x >> 2 & 0x33333333);
    x = x + (x >> 4) & 0x0f0f0f0f;
    x += x >> 8;
    x += x >> 16;
    return x & 0x7f;
  }

  function setAt(array, idx, val, canEdit) {
    var newArray = canEdit ? array : arrCopy(array);
    newArray[idx] = val;
    return newArray;
  }

  function spliceIn(array, idx, val, canEdit) {
    var newLen = array.length + 1;

    if (canEdit && idx + 1 === newLen) {
      array[idx] = val;
      return array;
    }

    var newArray = new Array(newLen);
    var after = 0;

    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        newArray[ii] = val;
        after = -1;
      } else {
        newArray[ii] = array[ii + after];
      }
    }

    return newArray;
  }

  function spliceOut(array, idx, canEdit) {
    var newLen = array.length - 1;

    if (canEdit && idx === newLen) {
      array.pop();
      return array;
    }

    var newArray = new Array(newLen);
    var after = 0;

    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        after = 1;
      }

      newArray[ii] = array[ii + after];
    }

    return newArray;
  }

  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

  var List = function (IndexedCollection$$1) {
    function List(value) {
      var empty = emptyList();

      if (value === null || value === undefined) {
        return empty;
      }

      if (isList(value)) {
        return value;
      }

      var iter = IndexedCollection$$1(value);
      var size = iter.size;

      if (size === 0) {
        return empty;
      }

      assertNotInfinite(size);

      if (size > 0 && size < SIZE) {
        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
      }

      return empty.withMutations(function (list) {
        list.setSize(size);
        iter.forEach(function (v, i) {
          return list.set(i, v);
        });
      });
    }

    if (IndexedCollection$$1) List.__proto__ = IndexedCollection$$1;
    List.prototype = Object.create(IndexedCollection$$1 && IndexedCollection$$1.prototype);
    List.prototype.constructor = List;

    List.of = function of()
    /*...values*/
    {
      return this(arguments);
    };

    List.prototype.toString = function toString() {
      return this.__toString('List [', ']');
    }; // @pragma Access


    List.prototype.get = function get(index, notSetValue) {
      index = wrapIndex(this, index);

      if (index >= 0 && index < this.size) {
        index += this._origin;
        var node = listNodeFor(this, index);
        return node && node.array[index & MASK];
      }

      return notSetValue;
    }; // @pragma Modification


    List.prototype.set = function set(index, value) {
      return updateList(this, index, value);
    };

    List.prototype.remove = function remove(index) {
      return !this.has(index) ? this : index === 0 ? this.shift() : index === this.size - 1 ? this.pop() : this.splice(index, 1);
    };

    List.prototype.insert = function insert(index, value) {
      return this.splice(index, 0, value);
    };

    List.prototype.clear = function clear() {
      if (this.size === 0) {
        return this;
      }

      if (this.__ownerID) {
        this.size = this._origin = this._capacity = 0;
        this._level = SHIFT;
        this._root = this._tail = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return emptyList();
    };

    List.prototype.push = function push()
    /*...values*/
    {
      var values = arguments;
      var oldSize = this.size;
      return this.withMutations(function (list) {
        setListBounds(list, 0, oldSize + values.length);

        for (var ii = 0; ii < values.length; ii++) {
          list.set(oldSize + ii, values[ii]);
        }
      });
    };

    List.prototype.pop = function pop() {
      return setListBounds(this, 0, -1);
    };

    List.prototype.unshift = function unshift()
    /*...values*/
    {
      var values = arguments;
      return this.withMutations(function (list) {
        setListBounds(list, -values.length);

        for (var ii = 0; ii < values.length; ii++) {
          list.set(ii, values[ii]);
        }
      });
    };

    List.prototype.shift = function shift() {
      return setListBounds(this, 1);
    }; // @pragma Composition


    List.prototype.concat = function concat()
    /*...collections*/
    {
      var arguments$1 = arguments;
      var seqs = [];

      for (var i = 0; i < arguments.length; i++) {
        var argument = arguments$1[i];
        var seq = IndexedCollection$$1(typeof argument !== 'string' && hasIterator(argument) ? argument : [argument]);

        if (seq.size !== 0) {
          seqs.push(seq);
        }
      }

      if (seqs.length === 0) {
        return this;
      }

      if (this.size === 0 && !this.__ownerID && seqs.length === 1) {
        return this.constructor(seqs[0]);
      }

      return this.withMutations(function (list) {
        seqs.forEach(function (seq) {
          return seq.forEach(function (value) {
            return list.push(value);
          });
        });
      });
    };

    List.prototype.setSize = function setSize(size) {
      return setListBounds(this, 0, size);
    }; // @pragma Iteration


    List.prototype.slice = function slice(begin, end) {
      var size = this.size;

      if (wholeSlice(begin, end, size)) {
        return this;
      }

      return setListBounds(this, resolveBegin(begin, size), resolveEnd(end, size));
    };

    List.prototype.__iterator = function __iterator(type, reverse) {
      var index = reverse ? this.size : 0;
      var values = iterateList(this, reverse);
      return new Iterator(function () {
        var value = values();
        return value === DONE ? iteratorDone() : iteratorValue(type, reverse ? --index : index++, value);
      });
    };

    List.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      var index = reverse ? this.size : 0;
      var values = iterateList(this, reverse);
      var value;

      while ((value = values()) !== DONE) {
        if (fn(value, reverse ? --index : index++, this$1) === false) {
          break;
        }
      }

      return index;
    };

    List.prototype.__ensureOwner = function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      if (!ownerID) {
        if (this.size === 0) {
          return emptyList();
        }

        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }

      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
    };

    return List;
  }(IndexedCollection);

  function isList(maybeList) {
    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
  }

  List.isList = isList;
  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';
  var ListPrototype = List.prototype;
  ListPrototype[IS_LIST_SENTINEL] = true;
  ListPrototype[DELETE] = ListPrototype.remove;
  ListPrototype.merge = ListPrototype.concat;
  ListPrototype.setIn = setIn$$1;
  ListPrototype.deleteIn = ListPrototype.removeIn = deleteIn;
  ListPrototype.update = update$$1;
  ListPrototype.updateIn = updateIn$1;
  ListPrototype.mergeIn = mergeIn;
  ListPrototype.mergeDeepIn = mergeDeepIn;
  ListPrototype.withMutations = withMutations;
  ListPrototype.wasAltered = wasAltered;
  ListPrototype.asImmutable = asImmutable;
  ListPrototype['@@transducer/init'] = ListPrototype.asMutable = asMutable;

  ListPrototype['@@transducer/step'] = function (result, arr) {
    return result.push(arr);
  };

  ListPrototype['@@transducer/result'] = function (obj) {
    return obj.asImmutable();
  };

  var VNode = function VNode(array, ownerID) {
    this.array = array;
    this.ownerID = ownerID;
  }; // TODO: seems like these methods are very similar


  VNode.prototype.removeBefore = function removeBefore(ownerID, level, index) {
    if (index === level ? 1 << level : this.array.length === 0) {
      return this;
    }

    var originIndex = index >>> level & MASK;

    if (originIndex >= this.array.length) {
      return new VNode([], ownerID);
    }

    var removingFirst = originIndex === 0;
    var newChild;

    if (level > 0) {
      var oldChild = this.array[originIndex];
      newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);

      if (newChild === oldChild && removingFirst) {
        return this;
      }
    }

    if (removingFirst && !newChild) {
      return this;
    }

    var editable = editableVNode(this, ownerID);

    if (!removingFirst) {
      for (var ii = 0; ii < originIndex; ii++) {
        editable.array[ii] = undefined;
      }
    }

    if (newChild) {
      editable.array[originIndex] = newChild;
    }

    return editable;
  };

  VNode.prototype.removeAfter = function removeAfter(ownerID, level, index) {
    if (index === (level ? 1 << level : 0) || this.array.length === 0) {
      return this;
    }

    var sizeIndex = index - 1 >>> level & MASK;

    if (sizeIndex >= this.array.length) {
      return this;
    }

    var newChild;

    if (level > 0) {
      var oldChild = this.array[sizeIndex];
      newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);

      if (newChild === oldChild && sizeIndex === this.array.length - 1) {
        return this;
      }
    }

    var editable = editableVNode(this, ownerID);
    editable.array.splice(sizeIndex + 1);

    if (newChild) {
      editable.array[sizeIndex] = newChild;
    }

    return editable;
  };

  var DONE = {};

  function iterateList(list, reverse) {
    var left = list._origin;
    var right = list._capacity;
    var tailPos = getTailOffset(right);
    var tail = list._tail;
    return iterateNodeOrLeaf(list._root, list._level, 0);

    function iterateNodeOrLeaf(node, level, offset) {
      return level === 0 ? iterateLeaf(node, offset) : iterateNode(node, level, offset);
    }

    function iterateLeaf(node, offset) {
      var array = offset === tailPos ? tail && tail.array : node && node.array;
      var from = offset > left ? 0 : left - offset;
      var to = right - offset;

      if (to > SIZE) {
        to = SIZE;
      }

      return function () {
        if (from === to) {
          return DONE;
        }

        var idx = reverse ? --to : from++;
        return array && array[idx];
      };
    }

    function iterateNode(node, level, offset) {
      var values;
      var array = node && node.array;
      var from = offset > left ? 0 : left - offset >> level;
      var to = (right - offset >> level) + 1;

      if (to > SIZE) {
        to = SIZE;
      }

      return function () {
        while (true) {
          if (values) {
            var value = values();

            if (value !== DONE) {
              return value;
            }

            values = null;
          }

          if (from === to) {
            return DONE;
          }

          var idx = reverse ? --to : from++;
          values = iterateNodeOrLeaf(array && array[idx], level - SHIFT, offset + (idx << level));
        }
      };
    }
  }

  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
    var list = Object.create(ListPrototype);
    list.size = capacity - origin;
    list._origin = origin;
    list._capacity = capacity;
    list._level = level;
    list._root = root;
    list._tail = tail;
    list.__ownerID = ownerID;
    list.__hash = hash;
    list.__altered = false;
    return list;
  }

  var EMPTY_LIST;

  function emptyList() {
    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
  }

  function updateList(list, index, value) {
    index = wrapIndex(list, index);

    if (index !== index) {
      return list;
    }

    if (index >= list.size || index < 0) {
      return list.withMutations(function (list) {
        index < 0 ? setListBounds(list, index).set(0, value) : setListBounds(list, 0, index + 1).set(index, value);
      });
    }

    index += list._origin;
    var newTail = list._tail;
    var newRoot = list._root;
    var didAlter = MakeRef(DID_ALTER);

    if (index >= getTailOffset(list._capacity)) {
      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
    } else {
      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
    }

    if (!didAlter.value) {
      return list;
    }

    if (list.__ownerID) {
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }

    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
  }

  function updateVNode(node, ownerID, level, index, value, didAlter) {
    var idx = index >>> level & MASK;
    var nodeHas = node && idx < node.array.length;

    if (!nodeHas && value === undefined) {
      return node;
    }

    var newNode;

    if (level > 0) {
      var lowerNode = node && node.array[idx];
      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);

      if (newLowerNode === lowerNode) {
        return node;
      }

      newNode = editableVNode(node, ownerID);
      newNode.array[idx] = newLowerNode;
      return newNode;
    }

    if (nodeHas && node.array[idx] === value) {
      return node;
    }

    SetRef(didAlter);
    newNode = editableVNode(node, ownerID);

    if (value === undefined && idx === newNode.array.length - 1) {
      newNode.array.pop();
    } else {
      newNode.array[idx] = value;
    }

    return newNode;
  }

  function editableVNode(node, ownerID) {
    if (ownerID && node && ownerID === node.ownerID) {
      return node;
    }

    return new VNode(node ? node.array.slice() : [], ownerID);
  }

  function listNodeFor(list, rawIndex) {
    if (rawIndex >= getTailOffset(list._capacity)) {
      return list._tail;
    }

    if (rawIndex < 1 << list._level + SHIFT) {
      var node = list._root;
      var level = list._level;

      while (node && level > 0) {
        node = node.array[rawIndex >>> level & MASK];
        level -= SHIFT;
      }

      return node;
    }
  }

  function setListBounds(list, begin, end) {
    // Sanitize begin & end using this shorthand for ToInt32(argument)
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
    if (begin !== undefined) {
      begin |= 0;
    }

    if (end !== undefined) {
      end |= 0;
    }

    var owner = list.__ownerID || new OwnerID();
    var oldOrigin = list._origin;
    var oldCapacity = list._capacity;
    var newOrigin = oldOrigin + begin;
    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;

    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
      return list;
    } // If it's going to end after it starts, it's empty.


    if (newOrigin >= newCapacity) {
      return list.clear();
    }

    var newLevel = list._level;
    var newRoot = list._root; // New origin might need creating a higher root.

    var offsetShift = 0;

    while (newOrigin + offsetShift < 0) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
      newLevel += SHIFT;
      offsetShift += 1 << newLevel;
    }

    if (offsetShift) {
      newOrigin += offsetShift;
      oldOrigin += offsetShift;
      newCapacity += offsetShift;
      oldCapacity += offsetShift;
    }

    var oldTailOffset = getTailOffset(oldCapacity);
    var newTailOffset = getTailOffset(newCapacity); // New size might need creating a higher root.

    while (newTailOffset >= 1 << newLevel + SHIFT) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
      newLevel += SHIFT;
    } // Locate or create the new tail.


    var oldTail = list._tail;
    var newTail = newTailOffset < oldTailOffset ? listNodeFor(list, newCapacity - 1) : newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail; // Merge Tail into tree.

    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
      newRoot = editableVNode(newRoot, owner);
      var node = newRoot;

      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
        var idx = oldTailOffset >>> level & MASK;
        node = node.array[idx] = editableVNode(node.array[idx], owner);
      }

      node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;
    } // If the size has been reduced, there's a chance the tail needs to be trimmed.


    if (newCapacity < oldCapacity) {
      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
    } // If the new origin is within the tail, then we do not need a root.


    if (newOrigin >= newTailOffset) {
      newOrigin -= newTailOffset;
      newCapacity -= newTailOffset;
      newLevel = SHIFT;
      newRoot = null;
      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin); // Otherwise, if the root has been trimmed, garbage collect.
    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
      offsetShift = 0; // Identify the new top root node of the subtree of the old root.

      while (newRoot) {
        var beginIndex = newOrigin >>> newLevel & MASK;

        if (beginIndex !== newTailOffset >>> newLevel & MASK) {
          break;
        }

        if (beginIndex) {
          offsetShift += (1 << newLevel) * beginIndex;
        }

        newLevel -= SHIFT;
        newRoot = newRoot.array[beginIndex];
      } // Trim the new sides of the new root.


      if (newRoot && newOrigin > oldOrigin) {
        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
      }

      if (newRoot && newTailOffset < oldTailOffset) {
        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
      }

      if (offsetShift) {
        newOrigin -= offsetShift;
        newCapacity -= offsetShift;
      }
    }

    if (list.__ownerID) {
      list.size = newCapacity - newOrigin;
      list._origin = newOrigin;
      list._capacity = newCapacity;
      list._level = newLevel;
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }

    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
  }

  function getTailOffset(size) {
    return size < SIZE ? 0 : size - 1 >>> SHIFT << SHIFT;
  }

  var OrderedMap = function (Map$$1) {
    function OrderedMap(value) {
      return value === null || value === undefined ? emptyOrderedMap() : isOrderedMap(value) ? value : emptyOrderedMap().withMutations(function (map) {
        var iter = KeyedCollection(value);
        assertNotInfinite(iter.size);
        iter.forEach(function (v, k) {
          return map.set(k, v);
        });
      });
    }

    if (Map$$1) OrderedMap.__proto__ = Map$$1;
    OrderedMap.prototype = Object.create(Map$$1 && Map$$1.prototype);
    OrderedMap.prototype.constructor = OrderedMap;

    OrderedMap.of = function of()
    /*...values*/
    {
      return this(arguments);
    };

    OrderedMap.prototype.toString = function toString() {
      return this.__toString('OrderedMap {', '}');
    }; // @pragma Access


    OrderedMap.prototype.get = function get(k, notSetValue) {
      var index = this._map.get(k);

      return index !== undefined ? this._list.get(index)[1] : notSetValue;
    }; // @pragma Modification


    OrderedMap.prototype.clear = function clear() {
      if (this.size === 0) {
        return this;
      }

      if (this.__ownerID) {
        this.size = 0;

        this._map.clear();

        this._list.clear();

        return this;
      }

      return emptyOrderedMap();
    };

    OrderedMap.prototype.set = function set(k, v) {
      return updateOrderedMap(this, k, v);
    };

    OrderedMap.prototype.remove = function remove(k) {
      return updateOrderedMap(this, k, NOT_SET);
    };

    OrderedMap.prototype.wasAltered = function wasAltered() {
      return this._map.wasAltered() || this._list.wasAltered();
    };

    OrderedMap.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      return this._list.__iterate(function (entry) {
        return entry && fn(entry[1], entry[0], this$1);
      }, reverse);
    };

    OrderedMap.prototype.__iterator = function __iterator(type, reverse) {
      return this._list.fromEntrySeq().__iterator(type, reverse);
    };

    OrderedMap.prototype.__ensureOwner = function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      var newMap = this._map.__ensureOwner(ownerID);

      var newList = this._list.__ensureOwner(ownerID);

      if (!ownerID) {
        if (this.size === 0) {
          return emptyOrderedMap();
        }

        this.__ownerID = ownerID;
        this._map = newMap;
        this._list = newList;
        return this;
      }

      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
    };

    return OrderedMap;
  }(Map$1);

  function isOrderedMap(maybeOrderedMap) {
    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
  }

  OrderedMap.isOrderedMap = isOrderedMap;
  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;

  function makeOrderedMap(map, list, ownerID, hash) {
    var omap = Object.create(OrderedMap.prototype);
    omap.size = map ? map.size : 0;
    omap._map = map;
    omap._list = list;
    omap.__ownerID = ownerID;
    omap.__hash = hash;
    return omap;
  }

  var EMPTY_ORDERED_MAP;

  function emptyOrderedMap() {
    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
  }

  function updateOrderedMap(omap, k, v) {
    var map = omap._map;
    var list = omap._list;
    var i = map.get(k);
    var has = i !== undefined;
    var newMap;
    var newList;

    if (v === NOT_SET) {
      // removed
      if (!has) {
        return omap;
      }

      if (list.size >= SIZE && list.size >= map.size * 2) {
        newList = list.filter(function (entry, idx) {
          return entry !== undefined && i !== idx;
        });
        newMap = newList.toKeyedSeq().map(function (entry) {
          return entry[0];
        }).flip().toMap();

        if (omap.__ownerID) {
          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
        }
      } else {
        newMap = map.remove(k);
        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
      }
    } else if (has) {
      if (v === list.get(i)[1]) {
        return omap;
      }

      newMap = map;
      newList = list.set(i, [k, v]);
    } else {
      newMap = map.set(k, list.size);
      newList = list.set(list.size, [k, v]);
    }

    if (omap.__ownerID) {
      omap.size = newMap.size;
      omap._map = newMap;
      omap._list = newList;
      omap.__hash = undefined;
      return omap;
    }

    return makeOrderedMap(newMap, newList);
  }

  var Stack = function (IndexedCollection$$1) {
    function Stack(value) {
      return value === null || value === undefined ? emptyStack() : isStack(value) ? value : emptyStack().pushAll(value);
    }

    if (IndexedCollection$$1) Stack.__proto__ = IndexedCollection$$1;
    Stack.prototype = Object.create(IndexedCollection$$1 && IndexedCollection$$1.prototype);
    Stack.prototype.constructor = Stack;

    Stack.of = function of()
    /*...values*/
    {
      return this(arguments);
    };

    Stack.prototype.toString = function toString() {
      return this.__toString('Stack [', ']');
    }; // @pragma Access


    Stack.prototype.get = function get(index, notSetValue) {
      var head = this._head;
      index = wrapIndex(this, index);

      while (head && index--) {
        head = head.next;
      }

      return head ? head.value : notSetValue;
    };

    Stack.prototype.peek = function peek() {
      return this._head && this._head.value;
    }; // @pragma Modification


    Stack.prototype.push = function push()
    /*...values*/
    {
      var arguments$1 = arguments;

      if (arguments.length === 0) {
        return this;
      }

      var newSize = this.size + arguments.length;
      var head = this._head;

      for (var ii = arguments.length - 1; ii >= 0; ii--) {
        head = {
          value: arguments$1[ii],
          next: head
        };
      }

      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return makeStack(newSize, head);
    };

    Stack.prototype.pushAll = function pushAll(iter) {
      iter = IndexedCollection$$1(iter);

      if (iter.size === 0) {
        return this;
      }

      if (this.size === 0 && isStack(iter)) {
        return iter;
      }

      assertNotInfinite(iter.size);
      var newSize = this.size;
      var head = this._head;

      iter.__iterate(function (value) {
        newSize++;
        head = {
          value: value,
          next: head
        };
      },
      /* reverse */
      true);

      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return makeStack(newSize, head);
    };

    Stack.prototype.pop = function pop() {
      return this.slice(1);
    };

    Stack.prototype.clear = function clear() {
      if (this.size === 0) {
        return this;
      }

      if (this.__ownerID) {
        this.size = 0;
        this._head = undefined;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return emptyStack();
    };

    Stack.prototype.slice = function slice(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }

      var resolvedBegin = resolveBegin(begin, this.size);
      var resolvedEnd = resolveEnd(end, this.size);

      if (resolvedEnd !== this.size) {
        // super.slice(begin, end);
        return IndexedCollection$$1.prototype.slice.call(this, begin, end);
      }

      var newSize = this.size - resolvedBegin;
      var head = this._head;

      while (resolvedBegin--) {
        head = head.next;
      }

      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return makeStack(newSize, head);
    }; // @pragma Mutability


    Stack.prototype.__ensureOwner = function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      if (!ownerID) {
        if (this.size === 0) {
          return emptyStack();
        }

        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }

      return makeStack(this.size, this._head, ownerID, this.__hash);
    }; // @pragma Iteration


    Stack.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;

      if (reverse) {
        return new ArraySeq(this.toArray()).__iterate(function (v, k) {
          return fn(v, k, this$1);
        }, reverse);
      }

      var iterations = 0;
      var node = this._head;

      while (node) {
        if (fn(node.value, iterations++, this$1) === false) {
          break;
        }

        node = node.next;
      }

      return iterations;
    };

    Stack.prototype.__iterator = function __iterator(type, reverse) {
      if (reverse) {
        return new ArraySeq(this.toArray()).__iterator(type, reverse);
      }

      var iterations = 0;
      var node = this._head;
      return new Iterator(function () {
        if (node) {
          var value = node.value;
          node = node.next;
          return iteratorValue(type, iterations++, value);
        }

        return iteratorDone();
      });
    };

    return Stack;
  }(IndexedCollection);

  function isStack(maybeStack) {
    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
  }

  Stack.isStack = isStack;
  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';
  var StackPrototype = Stack.prototype;
  StackPrototype[IS_STACK_SENTINEL] = true;
  StackPrototype.shift = StackPrototype.pop;
  StackPrototype.unshift = StackPrototype.push;
  StackPrototype.unshiftAll = StackPrototype.pushAll;
  StackPrototype.withMutations = withMutations;
  StackPrototype.wasAltered = wasAltered;
  StackPrototype.asImmutable = asImmutable;
  StackPrototype['@@transducer/init'] = StackPrototype.asMutable = asMutable;

  StackPrototype['@@transducer/step'] = function (result, arr) {
    return result.unshift(arr);
  };

  StackPrototype['@@transducer/result'] = function (obj) {
    return obj.asImmutable();
  };

  function makeStack(size, head, ownerID, hash) {
    var map = Object.create(StackPrototype);
    map.size = size;
    map._head = head;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_STACK;

  function emptyStack() {
    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
  }

  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (!isCollection(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)) {
      return false;
    }

    if (a.size === 0 && b.size === 0) {
      return true;
    }

    var notAssociative = !isAssociative(a);

    if (isOrdered(a)) {
      var entries = a.entries();
      return b.every(function (v, k) {
        var entry = entries.next().value;
        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
      }) && entries.next().done;
    }

    var flipped = false;

    if (a.size === undefined) {
      if (b.size === undefined) {
        if (typeof a.cacheResult === 'function') {
          a.cacheResult();
        }
      } else {
        flipped = true;
        var _ = a;
        a = b;
        b = _;
      }
    }

    var allEqual = true;

    var bSize = b.__iterate(function (v, k) {
      if (notAssociative ? !a.has(v) : flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
        allEqual = false;
        return false;
      }
    });

    return allEqual && a.size === bSize;
  }
  /**
   * Contributes additional methods to a constructor
   */


  function mixin(ctor, methods) {
    var keyCopier = function keyCopier(key) {
      ctor.prototype[key] = methods[key];
    };

    Object.keys(methods).forEach(keyCopier);
    Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);
    return ctor;
  }

  function toJS(value) {
    return isDataStructure(value) ? Seq(value).map(toJS).toJSON() : value;
  }

  var Set$1 = function (SetCollection$$1) {
    function Set(value) {
      return value === null || value === undefined ? emptySet() : isSet(value) && !isOrdered(value) ? value : emptySet().withMutations(function (set) {
        var iter = SetCollection$$1(value);
        assertNotInfinite(iter.size);
        iter.forEach(function (v) {
          return set.add(v);
        });
      });
    }

    if (SetCollection$$1) Set.__proto__ = SetCollection$$1;
    Set.prototype = Object.create(SetCollection$$1 && SetCollection$$1.prototype);
    Set.prototype.constructor = Set;

    Set.of = function of()
    /*...values*/
    {
      return this(arguments);
    };

    Set.fromKeys = function fromKeys(value) {
      return this(KeyedCollection(value).keySeq());
    };

    Set.intersect = function intersect(sets) {
      sets = Collection(sets).toArray();
      return sets.length ? SetPrototype.intersect.apply(Set(sets.pop()), sets) : emptySet();
    };

    Set.union = function union(sets) {
      sets = Collection(sets).toArray();
      return sets.length ? SetPrototype.union.apply(Set(sets.pop()), sets) : emptySet();
    };

    Set.prototype.toString = function toString() {
      return this.__toString('Set {', '}');
    }; // @pragma Access


    Set.prototype.has = function has(value) {
      return this._map.has(value);
    }; // @pragma Modification


    Set.prototype.add = function add(value) {
      return updateSet(this, this._map.set(value, value));
    };

    Set.prototype.remove = function remove(value) {
      return updateSet(this, this._map.remove(value));
    };

    Set.prototype.clear = function clear() {
      return updateSet(this, this._map.clear());
    }; // @pragma Composition


    Set.prototype.union = function union() {
      var iters = [],
          len = arguments.length;

      while (len--) iters[len] = arguments[len];

      iters = iters.filter(function (x) {
        return x.size !== 0;
      });

      if (iters.length === 0) {
        return this;
      }

      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
        return this.constructor(iters[0]);
      }

      return this.withMutations(function (set) {
        for (var ii = 0; ii < iters.length; ii++) {
          SetCollection$$1(iters[ii]).forEach(function (value) {
            return set.add(value);
          });
        }
      });
    };

    Set.prototype.intersect = function intersect() {
      var iters = [],
          len = arguments.length;

      while (len--) iters[len] = arguments[len];

      if (iters.length === 0) {
        return this;
      }

      iters = iters.map(function (iter) {
        return SetCollection$$1(iter);
      });
      var toRemove = [];
      this.forEach(function (value) {
        if (!iters.every(function (iter) {
          return iter.includes(value);
        })) {
          toRemove.push(value);
        }
      });
      return this.withMutations(function (set) {
        toRemove.forEach(function (value) {
          set.remove(value);
        });
      });
    };

    Set.prototype.subtract = function subtract() {
      var iters = [],
          len = arguments.length;

      while (len--) iters[len] = arguments[len];

      if (iters.length === 0) {
        return this;
      }

      iters = iters.map(function (iter) {
        return SetCollection$$1(iter);
      });
      var toRemove = [];
      this.forEach(function (value) {
        if (iters.some(function (iter) {
          return iter.includes(value);
        })) {
          toRemove.push(value);
        }
      });
      return this.withMutations(function (set) {
        toRemove.forEach(function (value) {
          set.remove(value);
        });
      });
    };

    Set.prototype.sort = function sort(comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator));
    };

    Set.prototype.sortBy = function sortBy(mapper, comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator, mapper));
    };

    Set.prototype.wasAltered = function wasAltered() {
      return this._map.wasAltered();
    };

    Set.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      return this._map.__iterate(function (k) {
        return fn(k, k, this$1);
      }, reverse);
    };

    Set.prototype.__iterator = function __iterator(type, reverse) {
      return this._map.__iterator(type, reverse);
    };

    Set.prototype.__ensureOwner = function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      var newMap = this._map.__ensureOwner(ownerID);

      if (!ownerID) {
        if (this.size === 0) {
          return this.__empty();
        }

        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }

      return this.__make(newMap, ownerID);
    };

    return Set;
  }(SetCollection);

  function isSet(maybeSet) {
    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
  }

  Set$1.isSet = isSet;
  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';
  var SetPrototype = Set$1.prototype;
  SetPrototype[IS_SET_SENTINEL] = true;
  SetPrototype[DELETE] = SetPrototype.remove;
  SetPrototype.merge = SetPrototype.concat = SetPrototype.union;
  SetPrototype.withMutations = withMutations;
  SetPrototype.asImmutable = asImmutable;
  SetPrototype['@@transducer/init'] = SetPrototype.asMutable = asMutable;

  SetPrototype['@@transducer/step'] = function (result, arr) {
    return result.add(arr);
  };

  SetPrototype['@@transducer/result'] = function (obj) {
    return obj.asImmutable();
  };

  SetPrototype.__empty = emptySet;
  SetPrototype.__make = makeSet;

  function updateSet(set, newMap) {
    if (set.__ownerID) {
      set.size = newMap.size;
      set._map = newMap;
      return set;
    }

    return newMap === set._map ? set : newMap.size === 0 ? set.__empty() : set.__make(newMap);
  }

  function makeSet(map, ownerID) {
    var set = Object.create(SetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_SET;

  function emptySet() {
    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
  }
  /**
   * Returns a lazy seq of nums from start (inclusive) to end
   * (exclusive), by step, where start defaults to 0, step to 1, and end to
   * infinity. When start is equal to end, returns empty list.
   */


  var Range = function (IndexedSeq$$1) {
    function Range(start, end, step) {
      if (!(this instanceof Range)) {
        return new Range(start, end, step);
      }

      invariant(step !== 0, 'Cannot step a Range by 0');
      start = start || 0;

      if (end === undefined) {
        end = Infinity;
      }

      step = step === undefined ? 1 : Math.abs(step);

      if (end < start) {
        step = -step;
      }

      this._start = start;
      this._end = end;
      this._step = step;
      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);

      if (this.size === 0) {
        if (EMPTY_RANGE) {
          return EMPTY_RANGE;
        }

        EMPTY_RANGE = this;
      }
    }

    if (IndexedSeq$$1) Range.__proto__ = IndexedSeq$$1;
    Range.prototype = Object.create(IndexedSeq$$1 && IndexedSeq$$1.prototype);
    Range.prototype.constructor = Range;

    Range.prototype.toString = function toString() {
      if (this.size === 0) {
        return 'Range []';
      }

      return 'Range [ ' + this._start + '...' + this._end + (this._step !== 1 ? ' by ' + this._step : '') + ' ]';
    };

    Range.prototype.get = function get(index, notSetValue) {
      return this.has(index) ? this._start + wrapIndex(this, index) * this._step : notSetValue;
    };

    Range.prototype.includes = function includes(searchValue) {
      var possibleIndex = (searchValue - this._start) / this._step;
      return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);
    };

    Range.prototype.slice = function slice(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }

      begin = resolveBegin(begin, this.size);
      end = resolveEnd(end, this.size);

      if (end <= begin) {
        return new Range(0, 0);
      }

      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
    };

    Range.prototype.indexOf = function indexOf(searchValue) {
      var offsetValue = searchValue - this._start;

      if (offsetValue % this._step === 0) {
        var index = offsetValue / this._step;

        if (index >= 0 && index < this.size) {
          return index;
        }
      }

      return -1;
    };

    Range.prototype.lastIndexOf = function lastIndexOf(searchValue) {
      return this.indexOf(searchValue);
    };

    Range.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      var size = this.size;
      var step = this._step;
      var value = reverse ? this._start + (size - 1) * step : this._start;
      var i = 0;

      while (i !== size) {
        if (fn(value, reverse ? size - ++i : i++, this$1) === false) {
          break;
        }

        value += reverse ? -step : step;
      }

      return i;
    };

    Range.prototype.__iterator = function __iterator(type, reverse) {
      var size = this.size;
      var step = this._step;
      var value = reverse ? this._start + (size - 1) * step : this._start;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }

        var v = value;
        value += reverse ? -step : step;
        return iteratorValue(type, reverse ? size - ++i : i++, v);
      });
    };

    Range.prototype.equals = function equals(other) {
      return other instanceof Range ? this._start === other._start && this._end === other._end && this._step === other._step : deepEqual(this, other);
    };

    return Range;
  }(IndexedSeq);

  var EMPTY_RANGE;

  function getIn$1(collection, searchKeyPath, notSetValue) {
    var keyPath = coerceKeyPath(searchKeyPath);
    var i = 0;

    while (i !== keyPath.length) {
      collection = get$1(collection, keyPath[i++], NOT_SET);

      if (collection === NOT_SET) {
        return notSetValue;
      }
    }

    return collection;
  }

  function getIn$$1(searchKeyPath, notSetValue) {
    return getIn$1(this, searchKeyPath, notSetValue);
  }

  function hasIn$1(collection, keyPath) {
    return getIn$1(collection, keyPath, NOT_SET) !== NOT_SET;
  }

  function hasIn$$1(searchKeyPath) {
    return hasIn$1(this, searchKeyPath);
  }

  function toObject() {
    assertNotInfinite(this.size);
    var object = {};

    this.__iterate(function (v, k) {
      object[k] = v;
    });

    return object;
  } // Note: all of these methods are deprecated.


  Collection.isIterable = isCollection;
  Collection.isKeyed = isKeyed;
  Collection.isIndexed = isIndexed;
  Collection.isAssociative = isAssociative;
  Collection.isOrdered = isOrdered;
  Collection.Iterator = Iterator;
  mixin(Collection, {
    // ### Conversion to other types
    toArray: function toArray() {
      assertNotInfinite(this.size);
      var array = new Array(this.size || 0);
      var useTuples = isKeyed(this);
      var i = 0;

      this.__iterate(function (v, k) {
        // Keyed collections produce an array of tuples.
        array[i++] = useTuples ? [k, v] : v;
      });

      return array;
    },
    toIndexedSeq: function toIndexedSeq() {
      return new ToIndexedSequence(this);
    },
    toJS: function toJS$1() {
      return toJS(this);
    },
    toKeyedSeq: function toKeyedSeq() {
      return new ToKeyedSequence(this, true);
    },
    toMap: function toMap() {
      // Use Late Binding here to solve the circular dependency.
      return Map$1(this.toKeyedSeq());
    },
    toObject: toObject,
    toOrderedMap: function toOrderedMap() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedMap(this.toKeyedSeq());
    },
    toOrderedSet: function toOrderedSet() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
    },
    toSet: function toSet() {
      // Use Late Binding here to solve the circular dependency.
      return Set$1(isKeyed(this) ? this.valueSeq() : this);
    },
    toSetSeq: function toSetSeq() {
      return new ToSetSequence(this);
    },
    toSeq: function toSeq() {
      return isIndexed(this) ? this.toIndexedSeq() : isKeyed(this) ? this.toKeyedSeq() : this.toSetSeq();
    },
    toStack: function toStack() {
      // Use Late Binding here to solve the circular dependency.
      return Stack(isKeyed(this) ? this.valueSeq() : this);
    },
    toList: function toList() {
      // Use Late Binding here to solve the circular dependency.
      return List(isKeyed(this) ? this.valueSeq() : this);
    },
    // ### Common JavaScript methods and properties
    toString: function toString() {
      return '[Collection]';
    },
    __toString: function __toString(head, tail) {
      if (this.size === 0) {
        return head + tail;
      }

      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
    },
    // ### ES6 Collection methods (ES6 Array and Map)
    concat: function concat() {
      var values = [],
          len = arguments.length;

      while (len--) values[len] = arguments[len];

      return reify(this, concatFactory(this, values));
    },
    includes: function includes(searchValue) {
      return this.some(function (value) {
        return is(value, searchValue);
      });
    },
    entries: function entries() {
      return this.__iterator(ITERATE_ENTRIES);
    },
    every: function every(predicate, context) {
      assertNotInfinite(this.size);
      var returnValue = true;

      this.__iterate(function (v, k, c) {
        if (!predicate.call(context, v, k, c)) {
          returnValue = false;
          return false;
        }
      });

      return returnValue;
    },
    filter: function filter(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, true));
    },
    find: function find(predicate, context, notSetValue) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[1] : notSetValue;
    },
    forEach: function forEach(sideEffect, context) {
      assertNotInfinite(this.size);
      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
    },
    join: function join(separator) {
      assertNotInfinite(this.size);
      separator = separator !== undefined ? '' + separator : ',';
      var joined = '';
      var isFirst = true;

      this.__iterate(function (v) {
        isFirst ? isFirst = false : joined += separator;
        joined += v !== null && v !== undefined ? v.toString() : '';
      });

      return joined;
    },
    keys: function keys() {
      return this.__iterator(ITERATE_KEYS);
    },
    map: function map(mapper, context) {
      return reify(this, mapFactory(this, mapper, context));
    },
    reduce: function reduce(reducer, initialReduction, context) {
      // MODIFIED (was `function reduce$1`)
      return _reduce(this, reducer, initialReduction, context, arguments.length < 2, false);
    },
    reduceRight: function reduceRight(reducer, initialReduction, context) {
      return _reduce(this, reducer, initialReduction, context, arguments.length < 2, true);
    },
    reverse: function reverse() {
      return reify(this, reverseFactory(this, true));
    },
    slice: function slice(begin, end) {
      return reify(this, sliceFactory(this, begin, end, true));
    },
    some: function some(predicate, context) {
      return !this.every(not(predicate), context);
    },
    sort: function sort(comparator) {
      return reify(this, sortFactory(this, comparator));
    },
    values: function values() {
      return this.__iterator(ITERATE_VALUES);
    },
    // ### More sequential methods
    butLast: function butLast() {
      return this.slice(0, -1);
    },
    isEmpty: function isEmpty() {
      return this.size !== undefined ? this.size === 0 : !this.some(function () {
        return true;
      });
    },
    count: function count(predicate, context) {
      return ensureSize(predicate ? this.toSeq().filter(predicate, context) : this);
    },
    countBy: function countBy(grouper, context) {
      return countByFactory(this, grouper, context);
    },
    equals: function equals(other) {
      return deepEqual(this, other);
    },
    entrySeq: function entrySeq() {
      var collection = this;

      if (collection._cache) {
        // We cache as an entries array, so we can just return the cache!
        return new ArraySeq(collection._cache);
      }

      var entriesSequence = collection.toSeq().map(entryMapper).toIndexedSeq();

      entriesSequence.fromEntrySeq = function () {
        return collection.toSeq();
      };

      return entriesSequence;
    },
    filterNot: function filterNot(predicate, context) {
      return this.filter(not(predicate), context);
    },
    findEntry: function findEntry(predicate, context, notSetValue) {
      var found = notSetValue;

      this.__iterate(function (v, k, c) {
        if (predicate.call(context, v, k, c)) {
          found = [k, v];
          return false;
        }
      });

      return found;
    },
    findKey: function findKey(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry && entry[0];
    },
    findLast: function findLast(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
    },
    findLastEntry: function findLastEntry(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().findEntry(predicate, context, notSetValue);
    },
    findLastKey: function findLastKey(predicate, context) {
      return this.toKeyedSeq().reverse().findKey(predicate, context);
    },
    first: function first() {
      return this.find(returnTrue);
    },
    flatMap: function flatMap(mapper, context) {
      return reify(this, flatMapFactory(this, mapper, context));
    },
    flatten: function flatten(depth) {
      return reify(this, flattenFactory(this, depth, true));
    },
    fromEntrySeq: function fromEntrySeq() {
      return new FromEntriesSequence(this);
    },
    get: function get(searchKey, notSetValue) {
      return this.find(function (_, key) {
        return is(key, searchKey);
      }, undefined, notSetValue);
    },
    getIn: getIn$$1,
    groupBy: function groupBy(grouper, context) {
      return groupByFactory(this, grouper, context);
    },
    has: function has(searchKey) {
      return this.get(searchKey, NOT_SET) !== NOT_SET;
    },
    hasIn: hasIn$$1,
    isSubset: function isSubset(iter) {
      iter = typeof iter.includes === 'function' ? iter : Collection(iter);
      return this.every(function (value) {
        return iter.includes(value);
      });
    },
    isSuperset: function isSuperset(iter) {
      iter = typeof iter.isSubset === 'function' ? iter : Collection(iter);
      return iter.isSubset(this);
    },
    keyOf: function keyOf(searchValue) {
      return this.findKey(function (value) {
        return is(value, searchValue);
      });
    },
    keySeq: function keySeq() {
      return this.toSeq().map(keyMapper).toIndexedSeq();
    },
    last: function last() {
      return this.toSeq().reverse().first();
    },
    lastKeyOf: function lastKeyOf(searchValue) {
      return this.toKeyedSeq().reverse().keyOf(searchValue);
    },
    max: function max(comparator) {
      return maxFactory(this, comparator);
    },
    maxBy: function maxBy(mapper, comparator) {
      return maxFactory(this, comparator, mapper);
    },
    min: function min(comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
    },
    minBy: function minBy(mapper, comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
    },
    rest: function rest() {
      return this.slice(1);
    },
    skip: function skip(amount) {
      return amount === 0 ? this : this.slice(Math.max(0, amount));
    },
    skipLast: function skipLast(amount) {
      return amount === 0 ? this : this.slice(0, -Math.max(0, amount));
    },
    skipWhile: function skipWhile(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, true));
    },
    skipUntil: function skipUntil(predicate, context) {
      return this.skipWhile(not(predicate), context);
    },
    sortBy: function sortBy(mapper, comparator) {
      return reify(this, sortFactory(this, comparator, mapper));
    },
    take: function take(amount) {
      return this.slice(0, Math.max(0, amount));
    },
    takeLast: function takeLast(amount) {
      return this.slice(-Math.max(0, amount));
    },
    takeWhile: function takeWhile(predicate, context) {
      return reify(this, takeWhileFactory(this, predicate, context));
    },
    takeUntil: function takeUntil(predicate, context) {
      return this.takeWhile(not(predicate), context);
    },
    update: function update(fn) {
      return fn(this);
    },
    valueSeq: function valueSeq() {
      return this.toIndexedSeq();
    },
    // ### Hashable Object
    hashCode: function hashCode() {
      return this.__hash || (this.__hash = hashCollection(this));
    } // ### Internal
    // abstract __iterate(fn, reverse)
    // abstract __iterator(type, reverse)

  });
  var CollectionPrototype = Collection.prototype;
  CollectionPrototype[IS_ITERABLE_SENTINEL] = true;
  CollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.values;
  CollectionPrototype.toJSON = CollectionPrototype.toArray;
  CollectionPrototype.__toStringMapper = quoteString;

  CollectionPrototype.inspect = CollectionPrototype.toSource = function () {
    return this.toString();
  };

  CollectionPrototype.chain = CollectionPrototype.flatMap;
  CollectionPrototype.contains = CollectionPrototype.includes;
  mixin(KeyedCollection, {
    // ### More sequential methods
    flip: function flip() {
      return reify(this, flipFactory(this));
    },
    mapEntries: function mapEntries(mapper, context) {
      var this$1 = this;
      var iterations = 0;
      return reify(this, this.toSeq().map(function (v, k) {
        return mapper.call(context, [k, v], iterations++, this$1);
      }).fromEntrySeq());
    },
    mapKeys: function mapKeys(mapper, context) {
      var this$1 = this;
      return reify(this, this.toSeq().flip().map(function (k, v) {
        return mapper.call(context, k, v, this$1);
      }).flip());
    }
  });
  var KeyedCollectionPrototype = KeyedCollection.prototype;
  KeyedCollectionPrototype[IS_KEYED_SENTINEL] = true;
  KeyedCollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
  KeyedCollectionPrototype.toJSON = toObject;

  KeyedCollectionPrototype.__toStringMapper = function (v, k) {
    return quoteString(k) + ': ' + quoteString(v);
  };

  mixin(IndexedCollection, {
    // ### Conversion to other types
    toKeyedSeq: function toKeyedSeq() {
      return new ToKeyedSequence(this, false);
    },
    // ### ES6 Collection methods (ES6 Array and Map)
    filter: function filter(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, false));
    },
    findIndex: function findIndex(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[0] : -1;
    },
    indexOf: function indexOf(searchValue) {
      var key = this.keyOf(searchValue);
      return key === undefined ? -1 : key;
    },
    lastIndexOf: function lastIndexOf(searchValue) {
      var key = this.lastKeyOf(searchValue);
      return key === undefined ? -1 : key;
    },
    reverse: function reverse() {
      return reify(this, reverseFactory(this, false));
    },
    slice: function slice(begin, end) {
      return reify(this, sliceFactory(this, begin, end, false));
    },
    splice: function splice(index, removeNum
    /*, ...values*/
    ) {
      var numArgs = arguments.length;
      removeNum = Math.max(removeNum || 0, 0);

      if (numArgs === 0 || numArgs === 2 && !removeNum) {
        return this;
      } // If index is negative, it should resolve relative to the size of the
      // collection. However size may be expensive to compute if not cached, so
      // only call count() if the number is in fact negative.


      index = resolveBegin(index, index < 0 ? this.count() : this.size);
      var spliced = this.slice(0, index);
      return reify(this, numArgs === 1 ? spliced : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum)));
    },
    // ### More collection methods
    findLastIndex: function findLastIndex(predicate, context) {
      var entry = this.findLastEntry(predicate, context);
      return entry ? entry[0] : -1;
    },
    first: function first() {
      return this.get(0);
    },
    flatten: function flatten(depth) {
      return reify(this, flattenFactory(this, depth, false));
    },
    get: function get(index, notSetValue) {
      index = wrapIndex(this, index);
      return index < 0 || this.size === Infinity || this.size !== undefined && index > this.size ? notSetValue : this.find(function (_, key) {
        return key === index;
      }, undefined, notSetValue);
    },
    has: function has(index) {
      index = wrapIndex(this, index);
      return index >= 0 && (this.size !== undefined ? this.size === Infinity || index < this.size : this.indexOf(index) !== -1);
    },
    interpose: function interpose(separator) {
      return reify(this, interposeFactory(this, separator));
    },
    interleave: function interleave()
    /*...collections*/
    {
      var collections = [this].concat(arrCopy(arguments));
      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, collections);
      var interleaved = zipped.flatten(true);

      if (zipped.size) {
        interleaved.size = zipped.size * collections.length;
      }

      return reify(this, interleaved);
    },
    keySeq: function keySeq() {
      return Range(0, this.size);
    },
    last: function last() {
      return this.get(-1);
    },
    skipWhile: function skipWhile(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, false));
    },
    zip: function zip()
    /*, ...collections */
    {
      var collections = [this].concat(arrCopy(arguments));
      return reify(this, zipWithFactory(this, defaultZipper, collections));
    },
    zipAll: function zipAll()
    /*, ...collections */
    {
      var collections = [this].concat(arrCopy(arguments));
      return reify(this, zipWithFactory(this, defaultZipper, collections, true));
    },
    zipWith: function zipWith(zipper
    /*, ...collections */
    ) {
      var collections = arrCopy(arguments);
      collections[0] = this;
      return reify(this, zipWithFactory(this, zipper, collections));
    }
  });
  var IndexedCollectionPrototype = IndexedCollection.prototype;
  IndexedCollectionPrototype[IS_INDEXED_SENTINEL] = true;
  IndexedCollectionPrototype[IS_ORDERED_SENTINEL] = true;
  mixin(SetCollection, {
    // ### ES6 Collection methods (ES6 Array and Map)
    get: function get(value, notSetValue) {
      return this.has(value) ? value : notSetValue;
    },
    includes: function includes(value) {
      return this.has(value);
    },
    // ### More sequential methods
    keySeq: function keySeq() {
      return this.valueSeq();
    }
  });
  SetCollection.prototype.has = CollectionPrototype.includes;
  SetCollection.prototype.contains = SetCollection.prototype.includes; // Mixin subclasses

  mixin(KeyedSeq, KeyedCollection.prototype);
  mixin(IndexedSeq, IndexedCollection.prototype);
  mixin(SetSeq, SetCollection.prototype); // #pragma Helper functions

  function _reduce(collection, reducer, reduction, context, useFirst, reverse) {
    assertNotInfinite(collection.size);

    collection.__iterate(function (v, k, c) {
      if (useFirst) {
        useFirst = false;
        reduction = v;
      } else {
        reduction = reducer.call(context, reduction, v, k, c);
      }
    }, reverse);

    return reduction;
  }

  function keyMapper(v, k) {
    return k;
  }

  function entryMapper(v, k) {
    return [k, v];
  }

  function not(predicate) {
    return function () {
      return !predicate.apply(this, arguments);
    };
  }

  function neg(predicate) {
    return function () {
      return -predicate.apply(this, arguments);
    };
  }

  function defaultZipper() {
    return arrCopy(arguments);
  }

  function defaultNegComparator(a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  }

  function hashCollection(collection) {
    if (collection.size === Infinity) {
      return 0;
    }

    var ordered = isOrdered(collection);
    var keyed = isKeyed(collection);
    var h = ordered ? 1 : 0;

    var size = collection.__iterate(keyed ? ordered ? function (v, k) {
      h = 31 * h + hashMerge(hash(v), hash(k)) | 0;
    } : function (v, k) {
      h = h + hashMerge(hash(v), hash(k)) | 0;
    } : ordered ? function (v) {
      h = 31 * h + hash(v) | 0;
    } : function (v) {
      h = h + hash(v) | 0;
    });

    return murmurHashOfSize(size, h);
  }

  function murmurHashOfSize(size, h) {
    h = imul(h, 0xcc9e2d51);
    h = imul(h << 15 | h >>> -15, 0x1b873593);
    h = imul(h << 13 | h >>> -13, 5);
    h = (h + 0xe6546b64 | 0) ^ size;
    h = imul(h ^ h >>> 16, 0x85ebca6b);
    h = imul(h ^ h >>> 13, 0xc2b2ae35);
    h = smi(h ^ h >>> 16);
    return h;
  }

  function hashMerge(a, b) {
    return a ^ b + 0x9e3779b9 + (a << 6) + (a >> 2) | 0; // int
  }

  var OrderedSet = function (Set$$1) {
    function OrderedSet(value) {
      return value === null || value === undefined ? emptyOrderedSet() : isOrderedSet(value) ? value : emptyOrderedSet().withMutations(function (set) {
        var iter = SetCollection(value);
        assertNotInfinite(iter.size);
        iter.forEach(function (v) {
          return set.add(v);
        });
      });
    }

    if (Set$$1) OrderedSet.__proto__ = Set$$1;
    OrderedSet.prototype = Object.create(Set$$1 && Set$$1.prototype);
    OrderedSet.prototype.constructor = OrderedSet;

    OrderedSet.of = function of()
    /*...values*/
    {
      return this(arguments);
    };

    OrderedSet.fromKeys = function fromKeys(value) {
      return this(KeyedCollection(value).keySeq());
    };

    OrderedSet.prototype.toString = function toString() {
      return this.__toString('OrderedSet {', '}');
    };

    return OrderedSet;
  }(Set$1);

  function isOrderedSet(maybeOrderedSet) {
    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
  }

  OrderedSet.isOrderedSet = isOrderedSet;
  var OrderedSetPrototype = OrderedSet.prototype;
  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
  OrderedSetPrototype.zip = IndexedCollectionPrototype.zip;
  OrderedSetPrototype.zipWith = IndexedCollectionPrototype.zipWith;
  OrderedSetPrototype.__empty = emptyOrderedSet;
  OrderedSetPrototype.__make = makeOrderedSet;

  function makeOrderedSet(map, ownerID) {
    var set = Object.create(OrderedSetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_ORDERED_SET;

  function emptyOrderedSet() {
    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
  }
  /**
   * Returns a lazy Seq of `value` repeated `times` times. When `times` is
   * undefined, returns an infinite sequence of `value`.
   */


  var Repeat = function (IndexedSeq$$1) {
    function Repeat(value, times) {
      if (!(this instanceof Repeat)) {
        return new Repeat(value, times);
      }

      this._value = value;
      this.size = times === undefined ? Infinity : Math.max(0, times);

      if (this.size === 0) {
        if (EMPTY_REPEAT) {
          return EMPTY_REPEAT;
        }

        EMPTY_REPEAT = this;
      }
    }

    if (IndexedSeq$$1) Repeat.__proto__ = IndexedSeq$$1;
    Repeat.prototype = Object.create(IndexedSeq$$1 && IndexedSeq$$1.prototype);
    Repeat.prototype.constructor = Repeat;

    Repeat.prototype.toString = function toString() {
      if (this.size === 0) {
        return 'Repeat []';
      }

      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
    };

    Repeat.prototype.get = function get(index, notSetValue) {
      return this.has(index) ? this._value : notSetValue;
    };

    Repeat.prototype.includes = function includes(searchValue) {
      return is(this._value, searchValue);
    };

    Repeat.prototype.slice = function slice(begin, end) {
      var size = this.size;
      return wholeSlice(begin, end, size) ? this : new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
    };

    Repeat.prototype.reverse = function reverse() {
      return this;
    };

    Repeat.prototype.indexOf = function indexOf(searchValue) {
      if (is(this._value, searchValue)) {
        return 0;
      }

      return -1;
    };

    Repeat.prototype.lastIndexOf = function lastIndexOf(searchValue) {
      if (is(this._value, searchValue)) {
        return this.size;
      }

      return -1;
    };

    Repeat.prototype.__iterate = function __iterate(fn, reverse) {
      var this$1 = this;
      var size = this.size;
      var i = 0;

      while (i !== size) {
        if (fn(this$1._value, reverse ? size - ++i : i++, this$1) === false) {
          break;
        }
      }

      return i;
    };

    Repeat.prototype.__iterator = function __iterator(type, reverse) {
      var this$1 = this;
      var size = this.size;
      var i = 0;
      return new Iterator(function () {
        return i === size ? iteratorDone() : iteratorValue(type, reverse ? size - ++i : i++, this$1._value);
      });
    };

    Repeat.prototype.equals = function equals(other) {
      return other instanceof Repeat ? is(this._value, other._value) : deepEqual(other);
    };

    return Repeat;
  }(IndexedSeq);

  var EMPTY_REPEAT;

  function fromJS(value, converter) {
    return fromJSWith([], converter || defaultConverter, value, '', converter && converter.length > 2 ? [] : undefined, {
      '': value
    });
  }

  function fromJSWith(stack, converter, value, key, keyPath, parentValue) {
    var toSeq = Array.isArray(value) ? IndexedSeq : isPlainObj(value) ? KeyedSeq : null;

    if (toSeq) {
      if (~stack.indexOf(value)) {
        throw new TypeError('Cannot convert circular structure to Immutable');
      }

      stack.push(value);
      keyPath && key !== '' && keyPath.push(key);
      var converted = converter.call(parentValue, key, toSeq(value).map(function (v, k) {
        return fromJSWith(stack, converter, v, k, keyPath, value);
      }), keyPath && keyPath.slice());
      stack.pop();
      keyPath && keyPath.pop();
      return converted;
    }

    return value;
  }

  function defaultConverter(k, v) {
    return isKeyed(v) ? v.toMap() : v.toList();
  }

  var _class$2;
  /**
   *
   */


  let IMapping = (_class$2 = class IMapping {
    constructor() {
      this.map = new Map$1();
    }
    /**
     * Add handler for pattern.
     * @param {*} pattern
     * @param {Function|Object} handler
     * @returns {this}
     */


    add(pattern, handler) {
      this.map = addhandler$1(this.map, fromJS(pattern), handler);
    }
    /**
     * Remove handler for pattern.
     * @param {*} pattern
     * @param {Function|Object} handler
     * @returns {this}
     */


    del(pattern, handler) {
      this.map = delhandler$1(this.map, fromJS(pattern), handler);
    }
    /**
     * Has any handlers for pattern (or one specific handler for pattern)?
     * @param {Array|IList} pattern
     * @param {Function|Object} [handler] - Omit to confirm "any handlers"
     * @returns {boolean}
     */


    has(pattern, handler) {
      return hashandler(this.map, fromJS(pattern), handler);
    }
    /**
     * Get handlers for pattern.
     * @param {Array|IList} pattern
     * @returns {ISet<Function|Object>}
     */


    get(pattern) {
      return this.map.get(fromJS(pattern));
    }
    /**
     * Clear the map.
     */


    clear() {
      this.map.clear();
    }
    /**
     * Get the map.
     * @parity {Mapping}
     * @returns {IMap<IList<*>, ISet<Function|Object>>}
     */


    toMap() {
      return this.map;
    }
    /**
     * Get set indexed by key. Always returns an ISet.
     * @param {Array|IList} pattern
     * @returns {ISet<Function|Object>}
     */


    toSet(pattern) {
      return this.has(pattern) ? this.get(pattern) : new Set$1();
    }
    /**
     * Get set indexed by key as array. Always returns an array.
     * @param {Array|IList} pattern
     * @returns {Array<Function|Object>}
     */


    toArray(pattern) {
      return this.toSet(pattern = fromJS(pattern)).toArray();
    }

  }, (_applyDecoratedDescriptor(_class$2.prototype, "add", [chained], Object.getOwnPropertyDescriptor(_class$2.prototype, "add"), _class$2.prototype), _applyDecoratedDescriptor(_class$2.prototype, "del", [chained], Object.getOwnPropertyDescriptor(_class$2.prototype, "del"), _class$2.prototype), _applyDecoratedDescriptor(_class$2.prototype, "clear", [chained], Object.getOwnPropertyDescriptor(_class$2.prototype, "clear"), _class$2.prototype)), _class$2);
  /**
   * Add handler for pattern.
   * @param {IMap} map
   * @param {IList} pattern
   * @param {Function|Object} handler
   * @returns {IMap}
   */

  function addhandler$1(map, pattern, handler) {
    return map.set(pattern, gethandler(map, pattern).add(handler));
  }
  /**
   * Remove handler for pattern.
   * @param {IMap} map
   * @param {IList} pattern
   * @param {Function|Object} handler
   * @returns {IMap}
   */


  function delhandler$1(map, pattern, handler) {
    const set = gethandler(map, pattern).delete(handler);
    return set.size ? map.set(pattern, set) : map.delete(pattern);
  }
  /**
   * Get handlers for pattern (or create a new set to store them).
   * @param {IMap} map
   * @param {IList} pattern
   * @returns {ISet<Function|Object>}
   */


  function gethandler(map, pattern) {
    return map.has(pattern) ? map.get(pattern) : new Set$1();
  }
  /**
   * Has any handlers for pattern (or one specific handler for pattern)?
   * @param {IMap} map
   * @param {IList} pattern
   * @param {Function|Object} [handler]
   * @returns {boolean}
   */


  function hashandler(map, pattern, handler) {
    return map.has(pattern) && (handler ? map.get(pattern).has(handler) : true);
  }
  /**
   * Custom error base class.
   * TODO: How much of this code is needed nowadays?
   */


  class Custom extends Error {
    constructor(message) {
      super(message);

      if (Error.hasOwnProperty('captureStackTrace')) {
        Error['captureStackTrace'](this, this.constructor);
      } else {
        Object.defineProperty(this, 'stack', {
          value: new Error(message).stack
        });
      }

      this.name = this.constructor.name;
    }

  }

  class UnsupportedError extends Custom {}

  class AccessError extends Custom {}

  class ConfigurationError extends Custom {}

  const johnson = 'data-plastique-id';

  const findall = (path, context) => Array.from(context.querySelectorAll(path));

  const getguid = elm => elm.getAttribute(johnson);
  /**
   * @param {Element} elm
   * @param {string} [guid] - The phantom guid associated to root element
   * @returns {Map<string, Element>} - Mapping `guid` value to element
   */


  function mapguids(elm, guid) {
    const all = findall(`[${johnson}]`, elm);

    const set = elm => [getguid(elm), elm];

    const map = new Map(all.map(set));

    if (guid) {
      map.set(guid, elm);
    }

    return map;
  }
  /**
   * Mapping all scopes by key.
   * TODO: Unref scope with no output or handlers.
   * @type {Map<string|Symbol, Scope>}
   */


  const scopes = new Map();
  /**
   * Get scope by key. If not found, a new scope will be created.
   * @param {string|Symbol} key
   * @returns {Array<Map|Mapping>}
   */

  function getscope(key) {
    const scope = scopes.get(key) || scopes.set(key, new Scope()).get(key);
    return [scope.outscope, scope.handlers];
  } // Scoped ......................................................................


  class Scope {
    constructor() {
      this.outscope = new Map();
      this.handlers = new IMapping();
    }

  }
  /**
   * @filedesc
   * Carefully manage all input and output.
   */

  /**
   * Key for public scope (the default scope).
   * @type {Symbol}
   */


  const pubkey = Symbol('Output');
  /**
   * @param {Model} model
   * @param {string|Symbol} [key]
   */

  function output(model, key = pubkey) {
    const C = timestamp(model.constructor);

    const _getscope = getscope(key),
          _getscope2 = _slicedToArray(_getscope, 2),
          outscope = _getscope2[0],
          handlers = _getscope2[1];

    outscope.set(C, model);

    if (handlers.has(C)) {
      handlers.get(C).forEach(handler => {
        handler.oninput(model);
      });
    }
  }
  /**
   * TODO: This methods needs some work.
   * TODO: Make revoke work with function callbacks.
   * @param {Model} model
   * @param {string|Symbol} [key]
   */


  function revoke(model, key = pubkey) {
    const C = model.constructor;

    const _getscope3 = getscope(key),
          _getscope4 = _slicedToArray(_getscope3, 2),
          outscope = _getscope4[0],
          handlers = _getscope4[1];

    if (outscope.get(C) === model) {
      outscope.delete(C);

      if (handlers.has(C)) {
        handlers.get(C).filter(handler => !!handler.onrevoke).forEach(handler => handler.onrevoke(C));
      }
    }
  }
  /**
   * @param {Constructor} C
   * @param {InputHandler} handler
   * @param {string|Symbol} [key]
   */


  function connect(C, handler, key = pubkey) {
    const _getscope5 = getscope(key),
          _getscope6 = _slicedToArray(_getscope5, 2),
          outscope = _getscope6[0],
          handlers = _getscope6[1];

    if (!handlers.has(C, handler)) {
      handlers.add(C, handler);

      if (outscope.has(C)) {
        handler.oninput(outscope.get(C));
      }
    }
  }
  /**
   * @param {Constructor} C
   * @param {InputHandler} handler
   * @param {string|Symbol} [key]
   */


  function disconnect(C, handler, key = pubkey) {
    const _getscope7 = getscope(key),
          _getscope8 = _slicedToArray(_getscope7, 2),
          outscope = _getscope8[0],
          handlers = _getscope8[1];

    handlers.del(C, handler);
  }
  /**
   * Get latest output. Note that the offical API is `MyClass.output()`!
   * @param {Constructor} C
   * @param {string|Symbol} [key]
   * @returns {Model|null}
   */


  function get$2(C, key = pubkey) {
    const _getscope9 = getscope(key),
          _getscope10 = _slicedToArray(_getscope9, 1),
          outscope = _getscope10[0];

    return outscope.get(C) || null;
  } // Scoped ......................................................................

  /**
   * Workaraoundy setup for finding the latest output (elsewhere in the project).
   * We would like to track the output-chronology via some List or something, but
   * how would this structure be accessed and analyzed (elsewhere in the project)?
   * TODO: https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_timing_api
   * @param {Class<Model>} C
   * @returns {Class<Model>}
   */


  function timestamp(C) {
    const now = Environment.isBrowser ? performance.now() : Date.now();
    C[Symbol.for('dataplastique:timestamp')] = now;
    return C;
  }
  /**
   * @filedesc
   * Access management and exception factory.
   */

  /**
   * Reserved field names.
   */


  const ADD = 'addObserver',
        REMOVE = 'removeObserver';
  /**
   * Confirm that object as constructor argument only
   * contains public (non-special) property names.
   * @param {Object} object
   * @returns {boolean}
   */

  function confirm(object) {
    if (object === null) {
      console.log('access confirm null');
      return true;
    }

    const keys = Object.keys(object);
    return keys.every(ispublic) && !keys.some(reserved);
  }
  /**
   * Name looks loke a public key?
   * @param {string} name
   * @returns {boolean}
   */


  function isPublic(name) {
    return ispublic(name);
  }
  /**
   * Name is reserved for internal use?
   * @param {string} name
   * @returns {boolean}
   */


  function isReserved(name) {
    return reserved(name);
  }
  /**
   * Constructor object denied.
   * TODO: report `getOwnPropertySymbols`.
   * @param {Proto} target
   * @param {Object} object
   * @throws {AccessError}
   */


  function badConstructor(target, object) {
    const props = Object.keys(object);
    bad(`Cannot create ${target.constructor.name}: ${problematic(props)}`);
  }
  /**
   * Value denied.
   * @param {Proto|string} target
   * @param {string} name
   * @param {Class<Plugin>} [Plugin]
   * @throws {AccessError}
   */


  function badValue(target, name, Plugin = null) {
    bad(`Cannot assign to ${signature(target, name)}` + (Plugin ? `: Reserved for the ${Plugin.name}` : ''));
  }
  /**
   * Getter denied.
   * @param {Proto} target
   * @param {string} name
   * @throws {AccessError}
   */


  function badGetter(target, name) {
    bad(`Getting a property that only has a setter: ${signature(target, name)}`);
  }
  /**
   * Setter denied.
   * @param {Proto} target
   * @param {string} name
   * @throws {AccessError}
   */


  function badSetter(target, name) {
    bad(`Setting a property that only has a getter: ${signature(target, name)}`);
  }
  /**
   * `definePropery` denied.
   * @param {Proto} target
   * @param {string} name
   * @throws {AccessError}
   */


  function badDefine(target, name) {
    bad(`Cannot redefine ${signature(target, name)}`);
  }
  /**
   * TODO: More elaborate error message.
   * @param {string} cname
   * @param {string} name
   * @throws {AccessError}
   */


  function reportDestructedViolation(cname, name) {
    bad(`Attempt to access "${name}" on destructed ${cname}`);
  } // Scoped ......................................................................

  /**
   * Identified by class name and property name.
   * @param {Proto|string} target
   * @param {string} name
   * @returns {string}
   */


  function signature(target, name) {
    return `${isString(target) ? target : target.constructor.name}.${name}`;
  }
  /**
   * Throw that access error.
   * @param {string} message
   * @throws {AccessError}
   */


  function bad(message) {
    throw new AccessError(message);
  }
  /**
   * Not a strange name?
   * @param {string} name
   * @returns {boolean}
   */


  function ispublic(name) {
    return !special(name);
  }
  /**
   * Private or privileged property name?
   * @param {string} name
   * @returns {boolean}
   */


  function special(name) {
    return typeof name !== 'string' || name[0] === '_' || name[0] === '$';
  }
  /**
   * Is reserved name?
   * @param {string} name
   * @returns {boolean}
   */


  function reserved(name) {
    return name === ADD || name === REMOVE;
  }
  /**
   * Compile error message for problematic names (in constructor scenario)?
   * @param {Array<string>|string} input
   * @returns {boolean}
   */


  function problematic(input) {
    if (Array.isArray(input)) {
      return input.filter(problematic).reduce((message, key) => {
        return message + `  "${key}" is not allowed\n`;
      }, '\n');
    } else {
      return special(input) || reserved(input);
    }
  }
  /**
   * @filedesc
   * Getting and setting properties on {Proto} instances.
   */

  /**
   * Artifacts shared by all {Proto} instances.
   */


  const _ref = [Symbol('plugins'), Symbol('constructed'), Symbol('disposed')],
        plugins = _ref[0],
        constructed = _ref[1],
        disposed = _ref[2];
  /**
   * Special artifacts for proxied {Proto} instances.
   */

  const _ref2 = [Symbol('proxy'), Symbol('normal'), Symbol('special'), Symbol('readonly'), Symbol('locked')],
        proxy = _ref2[0],
        normal = _ref2[1],
        special$1 = _ref2[2],
        readonly = _ref2[3],
        locked = _ref2[4];
  /**
   * Setup artifacts.
   * @param {Object} target
   * @param {Proxy} [theproxy]
   */

  function init(target, theproxy) {
    target[constructed] = false;
    target[disposed] = false; // target.$PROXY = theproxy;

    if (target[proxy] = theproxy) {
      target[normal] = new Map();
      target[special$1] = new Map();
      target[readonly] = new Set();
      target[locked] = new Set();
    }

    $id(target);
  }
  /**
   * Mark the target with a special property upon construction completed.
   * This will make sure that observers are not triggered during newup.
   * @param {Object} target
   */


  function done(target) {
    target[constructed] = true;
  }
  /**
   * Get property.
   * @param {Object} target
   * @param {string} name
   * @returns {*}
   */


  function get$3(target, name) {
    if (target[proxy]) {
      return getmap(target, name).get(name);
    } else {
      return target[name];
    }
  }
  /**
   * Set property.
   * @param {Object} target
   * @param {string} name
   * @param {*} value
   * @param {Object} [desc]
   */


  function set$2(target, name, value, desc) {
    if (target[proxy]) {
      getmap(target, name).set(name, value);
      maybepreserve(target, name, desc);
    } else {
      target[name] = value; // TODO: HANDLE THAT DESCRIPTOR !!!!!!!
    }
  }
  /**
   * Is property readonly or nonconfigurable?
   * @param {Object} target
   * @param {string} name
   * @returns {boolean}
   */


  function isPreserved(target, name) {
    return target[locked].has(name) || target[readonly].has(name);
  }
  /**
   * Is property readonly?
   * @param {Object} target
   * @param {string} name
   * @returns {boolean}
   */


  function isReadonly(target, name) {
    return target[readonly].has(name);
  }
  /**
   * Target is done parsing constructor arguments?
   * @param {Object} target
   * @returns {boolean}
   */


  function isConstructed(target) {
    return target[constructed];
  }
  /**
   * Get target proxy.
   * @param {Object} target
   * @returns {Proxy}
   */


  function getProxy(target) {
    return target[proxy]; // TODO: WHAT IF NOT? CHECK THE USE CASES HERE...
  }
  /**
   * Get instantiated plugins for target.
   * @param {Object} target
   * @returns {Map<string, Plugin|Function>}
   */


  function getPlugins(target) {
    return target[plugins] || (target[plugins] = new Map());
  }
  /**
   * Target has been disposed?
   * @param {Proto} target
   * @returns {boolean}
   */


  function isDisposed(target) {
    return target[disposed];
  }
  /**
   * Get non-special keys (only).
   * @param {Proto} target
   * @returns {Array<string>}
   */


  function publickeys(target) {
    return [...target[normal].keys()];
  }
  /**
   * Recursively dispose the target.
   * TODO: Revoke the proxies here!
   * @param {Object} target
   */


  function dispose(target) {
    target[disposed] = true;
    (target[proxy] || target).ondestruct();

    if (target[plugins]) {
      target[plugins].forEach(dispose);
    }
  } // Scoped ......................................................................

  /**
   * Compute and assign the unique `$id`.
   * @param {Proto} target
   * @param {boolean} proxied
   */


  function $id(target) {
    const id = Key.generate(classname(target));

    if (target[proxy]) {
      target[special$1].set('$id', id);
      target[readonly].add('$id');
      target[locked].add('$id');
    } else {
      Reflect.defineProperty(target, '$id', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: id
      });
    }
  }
  /**
   * Make readonly or nonconfigurable or both.
   * @param {Proto} target
   * @param {string} name
   * @param {Object} [desc]
   */


  function maybepreserve(target, name, desc) {
    if (uppercase(name)) {
      target[locked].add(name);
      target[readonly].add(name);
    } else if (desc) {
      if (!desc.configurable) {
        target[locked].add(name);
      }

      if (!desc.writable) {
        target[readonly].add(name);
      }
    }
  }
  /**
   * Get map for normal or special properties (public or private).
   * @param {Proto} target
   * @param {string} name
   * @returns {Map}
   */


  function getmap(target, name) {
    return isPublic(name) ? target[normal] : target[special$1];
  }
  /**
   * Property name matches a readonly value because UPPERCASE convention?
   * @param {string} name
   * @returns {boolean}
   */


  function uppercase(name) {
    return notsymbol(name) && /^[A-Z0-9_\$]+$/.test(name);
  }
  /**
   * Not a symbol?
   * @param {string|Symbol} name
   * @returns {boolean}
   */


  function notsymbol(name) {
    return !!name.charAt;
  }
  /**
   * Elegantly normalize some classname$$1 that was sanitized by Rollup :/
   * TODO: Perhaps let `displayName` take precedence in case of mangling?
   * @param {Proto} target
   * @returns {string}
   */


  function classname(target) {
    return target.constructor.name.replace(/(\$+)\d+$/, '');
  }
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


  function register(what, name, PluginC, override) {
    {
      registerToClass(...arguments);
    }
  }
  /**
   * Initialize plugins for instance.
   * @param {Proto} target
   */


  function init$1(target) {
    initPlugins(target, target.constructor);
  }
  /**
   * Lookup plugin assigned to property name, if indeed it is.
   * @param {Class<Proto>} ProtoC
   * @param {string} name
   * @returns {Class<Plugin>|null}
   */


  function find(ProtoC, name) {
    return lookupPlugin(ProtoC, name);
  }
  /**
   * Target class has plugin assigned to property name?
   * @param {Proto} target
   * @param {string} name
   * @returns {boolean}
   */


  function has$1(target, name) {
    return !!lookupPlugin(target.constructor, name);
  }
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
        const plugin = new PluginC({
          host: target
        });
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

    if (ProtoC = Object.getPrototypeOf(ProtoC)) {
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
    return plugins && plugins.has(name) ? plugins.get(name) : (ProtoC = Object.getPrototypeOf(ProtoC)).isProtoConstructor ? lookupPlugin(ProtoC, name) : null;
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
   * Mapping target to observers.
   * @type {Map<Set<IObserver>>}
   */


  const locals = new WeakMap();
  /**
   * Listing observers for *all* targets. These are not so
   * easily garbage collected, so please don't linger here.
   * @type {Set<IObserver>}
   */

  const globals = new Set();
  /**
   * Models inspected in current execution stack.
   * @type {Map<Model, Set<string>}
   */

  const peeks = new Map();
  /**
   * Models changed in current execution stack.
   * @type {Map<Model, Map<string, Array>>}
   */

  const pokes = new Map();
  /**
   * Collections mutated in current execution stack: The indexed value is an
   * array of pre-update collection members, a snapshot from before the change.
   * @type {Map<Collection, Array>}
   */

  const mutes = new Map();
  /**
   * While false, suspend observer notification
   * while inspecting properties (internal use).
   */

  let peeking = true;
  /**
   * Observers management studio.
   */

  class Observers {
    /**
     * Add observer for target.
     * @param {Proto} target
     * @param {IObserver} [observer]
     */
    static add(target, observer = target) {
      let set = locals.get(target);

      if (observable(target)) {
        if (!set) {
          locals.set(target, set = new Set());
        }

        set.add(observer);
      } else {
        observererror(target);
      }
    }
    /**
     * Remove observer for target.
     * @param {Proto} target
     * @param {IObserver} [observer]
     */


    static remove(target, observer = target) {
      let set = locals.get(target);

      if (observable(target)) {
        if (set) {
          set.delete(observer);

          if (!set.size) {
            locals.delete(target);
          }
        }
      } else {
        observererror(target);
      }
    }
    /**
     * Add observer for all targets.
     * @param {IObserver} observer
     */


    static addGlobal(observer) {
      globals.add(observer);
    }
    /**
     * Remove observer for all targets.
     * @param {IObserver} observer
     */


    static removeGlobal(observer) {
      globals.delete(observer);
    }
    /**
     * Model property inspected.
     * TODO: For globals, confirm that the property (descriptor) is writable.
     * @param {Proto} target
     * @param {string} name
     */


    static $peek(target, name) {
      if (observable(target) && peeking) {
        if (globals.size) {
          suspendpeeking(() => {
            globals.forEach(observer => {
              if (observer.onpeek) {
                observer.onpeek(getProxy(target), name);
              }
            });
          });
        }

        if (locals.has(target) && ispublic$1(name)) {
          let names = peeks.get(target);

          if (!names) {
            peeks.set(target, names = new Set());
          }

          names.add(name);
          schedule();
        }
      }
    }
    /**
     * TODO: Local observers should NOT be notified about "private"
     * changes (unless they have been proxied by a "public" getter)
     * Model property changed.
     * @param {Proto} target
     * @param {string} name
     * @param {*} newval
     * @param {*} oldval
     */


    static $poke(target, name, newval, oldval) {
      if (observable(target)) {
        if (globals.size || locals.has(target)) {
          let props = pokes.get(target);

          if (props) {
            if (props.has(name)) {
              props.get(name)[0] = newval;
            } else {
              props.set(name, [newval, oldval]);
            }
          } else {
            props = new Map();
            props.set(name, [newval, oldval]);
            pokes.set(target, props);
          }

          schedule();
        }
      }
    }
    /**
     * Collection members changed somehow. This gets called *before* the
     * update operation(s) happens: We'll snapshot the old collection and
     * compare it to the new so that we can figure out what was changed.
     * @param {Collection} target
     */


    static $splice(target) {
      if (observable(target) && (globals.size || locals.has(target))) {
        if (!mutes.has(target)) {
          mutes.set(target, Array.from(target));
          schedule();
        }
      }
    }

  } // Scoped ......................................................................

  /**
   * Target should trigger peeks and pokes?
   * @param {Proto} target
   * @returns {boolean}
   */


  function observable(target) {
    return isConstructed(target) && target.$observable;
  }
  /**
   * Schedule updates async via `requestAnimationFrame`
   * (in the browser) or via `setTimeout` (in the Node).
   */


  function schedule() {
    const id = schedule.id;
    Tick.cancelSchedule(isNaN(id) ? -1 : id);
    schedule.id = Tick.schedule(onschedule);
  }
  /**
   * Run scheduled updates, updating observers.
   */


  function onschedule() {
    snapshot(peeks).forEach(gopeek);
    snapshot(pokes).forEach(gopoke);
    snapshot(mutes).forEach(gomute);
  }
  /**
   * Transfer map contents to an array so that the map can be cleared
   * before we trigger any side effects that might repopulate the map.
   * @param {Map} map
   * @returns {Array<Model, String|Map<string, *>>|Array<*>}
   */


  function snapshot(map) {
    const array = [];
    map.forEach((...mapping) => array.push(mapping));
    map.clear();
    return array;
  }
  /**
   * Update observers for properties inspected.
   * @param {Array<Model|Set>} update
   */


  function gopeek([props, target]) {
    const proxy = getProxy(target);
    const observers = locals.get(target);

    if (observers) {
      suspendpeeking(() => {
        observers.forEach(observer => {
          if (observer.onpeek) {
            props.forEach(name => {
              observer.onpeek(proxy, name);
            });
          }
        });
      });
    }
  }
  /**
   * Update observers for properties changed.
   * @param {Array<Model|Map<string, Array>>} update
   */


  function gopoke([props, target]) {
    const proxy = getProxy(target);

    const poke = (observer, isglobal) => {
      if (observer.onpoke) {
        props.forEach((values, name) => {
          if (isglobal || ispublic$1(name)) {
            observer.onpoke(proxy, name, values[0], values[1]);
          }
        });
      }
    };

    globals.forEach(observer => poke(observer, true));

    if (locals.has(target)) {
      locals.get(target).forEach(observer => poke(observer));
    }
  }
  /**
   * Update observers for collection mutations.
   * @param {Array<Array<Any>, Collection<Any>>} update
   */


  function gomute([source, target]) {
    const proxy = getProxy(target);
    const added = target.filter(any => !source.includes(any));
    const removed = source.filter(any => !target.includes(any));
    allobservers(target).forEach(observer => {
      if (observer.onsplice) {
        observer.onsplice(proxy, added, removed);
      }
    });
  }
  /**
   * Suspend peek notifications for the duration of given action. Note that the
   * business logic here is unfortunate: To save the call stack, we must disable
   * notifications while we notify the observers. This means that we have a
   * blind spot for properties that can be inspected in stealth mode. This will
   * most likely be the observer inspecting it's own properties, so perhaps OK.
   * @param {Function} action
   */


  function suspendpeeking(action) {
    peeking = false;
    action();
    peeking = true;
  }
  /**
   * Get local and global observers for target, avoiding potential duplicates.
   * TODO: Something must optimize, perhaps setup a short-lived cache thingy?
   * @param {Proto} target
   * @returns {Set<IObserver>}
   */


  function allobservers(target) {
    const loc = locals.get(target) || new Set();
    const set = new Set([...globals, ...loc]);
    return set;
  }
  /**
   * Only trigger "public" observers on "public" properties.
   * TODO: Figure this out with getter that proxies private.
   * TODO: If possible, move this function into {Access}
   * @param {string} name
   * @returns {boolean}
   */


  function ispublic$1(name) {
    return notsymbol$1(name) && name[0] !== '_' && name[0] !== '$';
  }
  /**
   * Don't trigger observers on Symbol access.
   * @param {string|Symbol} name
   * @returns {boolean}
   */


  function notsymbol$1(name) {
    return !!name.charAt;
  }
  /**
   * Can't observe that.
   * @param {Proto} target
   * @throws {Error}
   */


  function observererror(target) {
    const classname = target.constructor.name;
    throw new UnsupportedError(`The ${classname} is unfortunately not observable.`);
  }
  /**
   * Default validators.
   * TODO: Perhaps parity https://reactjs.org/docs/typechecking-with-proptypes.html
   * @type {IMap<Constructor|ISet, Function>}
   */


  let validators = new Map$1([[String, isString], [Number, isNumber], [Boolean, isBoolean], [Object, isObject], [Array, isArray], [Function, isFunction], [Date, isDate], [Symbol, isSymbol]]);
  /**
   * Get validator for constructor. Returns function to confirm input data via
   * `instanceOf` test (unless the input is primitive, in which case see above).
   * @param {Constructor|ISet<Constructor>} cons
   * @returns {Function}
   */

  function getvalidator(cons) {
    return validators.has(cons) ? validators.get(cons) : newvalidator(cons);
  } // Scoped ......................................................................


  const simplearray = x => Array.isArray(x) && x.constructor === Array;

  const simplething = x => typeof x === 'object' && x.constructor === Object;
  /**
   * Build function to validate input of complex type.
   * @param {Constructor|ISet<Constructor>} cons
   * @returns {Function}
   */


  function newvalidator(cons) {
    const validator = Set$1.isSet(cons) ? multivalidator(cons) : basicvalidator(cons);
    validators = validators.set(cons, validator);
    return validator;
  }
  /**
   *
   * @param {ISet<Constructor>} set
   * @returns {Function}
   */


  function multivalidator(set) {
    const validators = set.map(getvalidator);
    return input => validators.some(isvalid => isvalid(input));
  }
  /**
   * @param {Class<Proto>} cons
   * @returns {Function}
   */


  function basicvalidator(cons) {
    return input => {
      if (input === null) {
        console.log('TODO: validator null');
        return true;
      }

      return cons.isCollectionConstructor ? cons.is(input) || simplearray(input) : cons.isModelConstructor ? cons.is(input) || simplething(input) : true;
    };
  }
  /**
   * Default converters. Simple values will be passed through unconverted.
   * TODO: Untangle Object and Array!
   * TODO: Special converter for Date
   * @type {IMap<Constructor|ISet, Function>}
   */


  let converters = (id => {
    return new Map$1([[String, id], [Number, id], [Boolean, id], [Function, id], [Object, id], [Array, id], [Symbol, id]]);
  })(input => input);
  /**
   * Get converter for constructor. Returns a function that can upgrade
   * plain objects and arrays to super advanced Models and Collections.
   * @param {Constructor} cons
   * @returns {Function}
   */


  function getconverter(cons) {
    return converters.has(cons) ? converters.get(cons) : newconverter(cons);
  } // Scoped ......................................................................


  const simplearray$1 = x => Array.isArray(x) && x.constructor === Array;
  /**
   * @param {Constructor|ISet<Constructor>} cons
   * @returns {Function}
   */


  function newconverter(cons) {
    const converter = Set$1.isSet(cons) ? multiconverter(cons) : basicconverter(cons);
    converters = converters.set(cons, converter);
    return converter;
  }
  /**
   * TODO Something fancy.
   * @param {ISet} set
   * @returns {Function}
   */


  function multiconverter(set) {
    return input => {
      console.log('TODO: multiconverter');
      return input;
    };
  }
  /**
   * TODO: Handle null and undefined??????????????????????????????????????????????
   * Build function to transform input of complex type.
   * @param {Class<Proto>} cons
   * @returns {Function}
   */


  function basicconverter(cons) {
    return input => {
      if (input === null) {
        console.log('TODO: converter null');
        return input;
      }

      return input instanceof cons ? input : cons.isCollectionConstructor ? simplearray$1(input) ? new cons(...input) : typeerror() : new cons(input);
    };
  }
  /**
   * Throw that TypeError.
   * @param {string} message
   * @throws {TypeError}
   */


  function typeerror(message = 'TODO') {
    throw new TypeError(message);
  } // TODO ........................................................................

  /**
   * Mapping Model constructor to pipe.
   * @type {Map<Class<Proto>, Object>}
   */


  const pipes = new Map();
  /**
   * Get pipe for constructor. This "pipe" is an object with methods to validate
   * and potentially transform properties assigned to the Model (or Collection).
   * TODO: required
   * TODO: enumerable
   * TODO: configurable
   * TODO: default
   * @param {Class<Proto>} Proto
   * @returns {Object}
   */

  function getObjectPipe(Proto) {
    return pipes.has(Proto) ? pipes.get(Proto) : function () {
      const pipe = resolve(Proto);
      pipes.set(Proto, pipe);
      return pipe;
    }();
  } // Scoped ......................................................................


  const isnull = val => val === null;

  const isimap = val => Map$1.isMap(val);

  const islist = val => Array.isArray(val);

  const isobjt = val => typeof val === 'object';

  const toiset = seq => seq.toSet();

  const toimap = seq => seq.toMap();
  /**
   * Mapping Model constructor to IMap derived from `static model()`
   * @type {Map<Class<Proto>, IMap|null>}
   */


  const imaps = new Map();
  /**
   * An empty IMap. There's nothing to it.
   * @type {IMap}
   */

  const blank = new Map$1();
  /**
   * @param {Class<Proto>} Proto
   * @param {IMap|null} [map]
   * @returns {Object|null}
   */

  function resolve(Proto, map = ancestors(Proto).reduce(mapping)) {
    return isnull(map) ? map : isimap(map) ? buildpipe(Proto, map) : failpipe(Proto, map);
  }
  /**
   * List class hierarchy starting from the top (Proto itself).
   * @param {Class<Proto>} Proto
   * @param {Array<Class<Proto>>} [list]
   * @returns {Array<Class<Proto>>}
   */


  function ancestors(Proto, list = [Proto]) {
    return (Proto = Object.getPrototypeOf(Proto)).isProtoConstructor ? ancestors(Proto, list.concat(Proto)) : list.reverse();
  }
  /**
   * @param {IMap|null} oldmap
   * @param {Class<Proto>} Proto
   * @returns {IMap|null}
   */


  function mapping(oldmap, Proto) {
    return imaps.has(Proto) ? imaps.get(Proto) : function () {
      const symbol = Symbol.for('@dataplastique/objectpipe');
      const object = Proto[symbol](oldmap || blank);
      const newmap = deepfreeze(object, oldmap || blank);
      imaps.set(Proto, newmap);
      return newmap;
    }();
  }
  /**
   * Making map values immutable all the way down so subclas cannot accidentally
   * change the parent interface. Object pipes are crated lazily, so this would
   * not become apparent until the parent class was first instantiated (if ever).
   * @param {IMap|Object|null} newmap - Usually this is just a plain JS Object
   * @param {IMap} oldmap
   * @returns {IMap|null}
   */


  function deepfreeze(newmap, oldmap) {
    return isnull(newmap) ? newmap : isimap(newmap) ? newmap.map(frozen) : isobjt(newmap) ? oldmap.merge(newmap).map(frozen) : newmap;
  }
  /**
   * Recursively transform objects and arrays to immutable Maps and Sets.
   * @param {*} js - String, Number, Boolean but also Objects and Arrays.
   * @returns {*} - Returns an immutable structure
   */


  function frozen(js) {
    return !isobjt(js) || isnull(js) || isImmutable(js) ? js : islist(js) ? toiset(Seq(js).map(frozen)) : toimap(Seq(js).map(frozen));
  }
  /**
   * Creates an object, the "pipe", with methods to match every entry in the map.
   * @param {Class<Proto>} Proto
   * @param {IMap} map - The result of calling `static model()`.
   * @returns {Object}
   */


  function buildpipe(Proto, map) {
    return map.reduce((pipe, value, key) => {
      Reflect.set(pipe, key, input => {
        return getvalidator(value)(input) ? getconverter(value)(input) : throwinvalid(Proto, key, input, value);
      });
      return pipe;
    }, {});
  } // Failures ....................................................................

  /**
   * The `static model` method returned something bad.
   * TODO: Method name 'model()' has been hardcoded!
   * @param {Constructor} Proto
   * @param {*} pipe
   * @throws {TypeError}
   */


  function failpipe(Proto, pipe) {
    throw new TypeError(`${Proto.name}.model() returned ${typeOf(pipe)}, expected IMap|Object|null`);
  }
  /**
   * Throw that type error.
   * @param {Class<Proto>} Proto
   * @param {string} key
   * @param {*} input
   * @param {Constructor|ISet<Constructor>} cons (String, Number, Person etc)
   * @throws {TypeError}
   */


  function throwinvalid(Proto, key, input, cons) {
    const name = c => c.name;

    const list = c => [...c.map(name)].join('|');

    const want = Set$1.isSet(cons) ? list(cons) : name(cons);
    const fail = failedtype(input);
    const clas = name(Proto);
    throw new TypeError(`Bad assignment to ${clas}.${key}: Expected ${want}, got ${fail}.`);
  }
  /**
   * Attempt to qualify the exact type of input that failed validation.
   * @param {*} input
   * @returns {string}
   */


  function failedtype(input) {
    let type = typeOf(input);

    switch (type) {
      case 'object':
      case 'array':
        let cons = input.constructor;

        if (cons !== Object && cons !== Array) {
          type = cons.name;
        }

        break;
    }

    return type;
  }

  var _class$3;
  /*
   * Reserved and special field names.
   */


  const CONSTRUCTOR = 'constructor',
        CONSTRUCTED = 'constructed',
        ADD$1 = 'addObserver',
        REMOVE$1 = 'removeObserver',
        DISPOSE = 'dispose',
        DISPOSED = // TODO: Deprecate
  'disposed' // TODO: Deprecate
  ;
  /*
   * Special property that can be checked during testing to confirm that 
   * the target has indeed been successfully hidden behind by the Proxy.
   */

  const CONFIRM_PROXY = '$CONFIRM_PROXY';
  /**
   * Decorator to throw an exception on attempt to access destructed target.
   * TODO: This can become deprecated once we revoke the proxies for good.
   * @param {Object} object
   * @param {string} name
   * @param {Object} descriptor
   * @returns {Object}
   */

  function ok(object, name, descriptor) {
    const base = descriptor.value;

    descriptor.value = function (target, name) {
      if (name !== 'disposed' && isDisposed(target)) {
        reportDestructedViolation(target.constructor.name, name);
      } else {
        return base.apply(this, arguments);
      }
    };

    return descriptor;
  }
  /**
   * Proxytraps for model aspects (object-like properties).
   */


  let ModelHandler = (_class$3 = class ModelHandler {
    /**
     * Create target mapping.
     * @param {Proto} target
     * @param {Object} object
     */
    static init(target, object) {
      Object.entries(object).forEach(([key, value]) => {
        set$2(target, key, piped(target, key, value));
      });
    }
    /**
     * Get property (or method).
     * @param {Proto} target
     * @param {string} name
     * @returns {*}
     */


    static get(target, name) {
      const value = special$2(target, name) || normal$1(target, name);
      return value === undefined ? uniget(target, name) : value;
    }
    /**
     * Set property.
     * @param {Proto} target
     * @param {string} name
     * @param {*} value
     * @returns {boolean}
     */


    static set(target, name, value) {
      if (!uniset(target, name, value)) {
        const val = piped(target, name, value);
        const old = get$3(target, name);

        if (old !== val) {
          set$2(target, name, val);
          Observers.$poke(target, name, val, old);
        }
      }

      return true;
    }
    /**
     * Get non-special keys (only).
     * @param {Proto} target
     * @returns {Array<string>}
     */


    static keys(target) {
      return publickeys(target);
    }

  }, (_applyDecoratedDescriptor(_class$3, "get", [ok], Object.getOwnPropertyDescriptor(_class$3, "get"), _class$3), _applyDecoratedDescriptor(_class$3, "set", [ok], Object.getOwnPropertyDescriptor(_class$3, "set"), _class$3), _applyDecoratedDescriptor(_class$3, "keys", [ok], Object.getOwnPropertyDescriptor(_class$3, "keys"), _class$3)), _class$3);
  /**
   * Step 0:
   * Special methods and properties that require access to the
   * `target` that is hidden behind the proxy event horizon.
   * The `constructor` apparently needs a fix in V8 (at least).
   * @param {Proto} target
   * @param {string} name
   * @returns {*}
   */

  function special$2(target, name) {
    switch (name) {
      case ADD$1:
        return observer => Observers.add(target, observer);

      case REMOVE$1:
        return observer => Observers.remove(target, observer);

      case DISPOSE:
        return () => dispose(target);

      case DISPOSED:
        return isDisposed(target);

      case CONSTRUCTOR:
        return target.constructor;

      case CONSTRUCTED:
        return isConstructed(target);

      case CONFIRM_PROXY:
        return true;
    }
  }
  /**
   * Attempt to assign the property via "universal setter".
   * @param {Proto} target
   * @param {string|Symbol} name
   * @param {*} value
   * @returns {truthy} - `true` if the unversal setter handled it.
   */


  function uniset(target, name, value) {
    if (target.uniset && uniok(target, name)) {
      return universal(target, name, value);
    }
  }
  /**
   * Attempt to retrieve the property via "universal getter".
   * @param {Proto} target
   * @param {string|Symbol} name
   * @returns {truthy} - `undefined` unless the unversal getter handled it.
   */


  function uniget(target, name) {
    if (target.uniget && uniok(target, name)) {
      return universal(target, name);
    }
  }
  /**
   * OK to evalute "universal" setter or getter?
   * @param {Proto} target
   * @param {string|Symbol} name
   * @returns {boolean}
   */


  function uniok(target, name) {
    return notsymbol$2(name) && isConstructed(target) && !universal.suspended;
  }
  /**
   * To save the callstack, suspend interception
   * while calling "universal" getter or setter.
   * @param {Proto} target
   * @param {string} name
   * @param {*} [value]
   * @returns {*}
   */


  function universal(target, name, value) {
    universal.suspended = true;
    const proxy = getProxy(target);
    const getit = arguments.length === 2;
    const returnval = getit ? proxy.uniget(name) : proxy.uniset(name, value);
    universal.suspended = false;
    return returnval;
  }
  /**
   * Get normal property.
   * @param {Proto} target
   * @param {string} name
   * @returns {*}
   */


  function normal$1(target, name) {
    Observers.$peek(target, name);
    return get$3(target, name);
  }
  /**
   * @param {Proto} target
   * @param {string} key
   * @param {*} val
   * @returns {*}
   */


  function piped(target, key, val) {
    const cons = target.constructor;
    const pipe = getObjectPipe(cons);
    return pipe ? pipeline(cons, pipe, key, val) : val;
  }
  /**
   * Potentially "upgrade" the value to an advanced type. If type definitions
   * have been declared, this will also validate the correct type of the value.
   * @param {Constructor} cons
   * @param {Object} pipe
   * @param {string} key
   * @param {*} val
   * @throws {TypeError}
   * @throws {Error}
   * @returns {*}
   */


  function pipeline(cons, pipe, key, val) {
    return pipe.hasOwnProperty(key) ? pipe[key](val) : badValue(cons.name, key);
  }
  /**
   * Just while Type.isSymbol is not exactly the fastest implementation.
   * @param {string|Symbol} name
   * @returns {boolean}
   */


  function notsymbol$2(name) {
    return !!name.charAt;
  }
  /**
   * Mapping Collection constructors to ArrayPipes.
   * @type {Map<constructor, function>}
   */


  const pipes$1 = new Map();
  /**
   * Get pipe for constructor. This "pipe" is a function that can be
   * used validate and transform elements added to the {Collection}.
   * TODO: required
   * TODO: enumerable
   * TODO: configurable
   * TODO: default
   * @param {Class<Collection>} cons
   * @returns {Function}
   */

  function getArrayPipe(cons) {
    return pipes$1.has(cons) ? pipes$1.get(cons) : function () {
      const name = Symbol.for('@dataplastique/arraypipe');
      const type = cons[name]();
      const pipe = createpipe(cons, type);
      pipes$1.set(cons, pipe);
      return pipe;
    }();
  } // Scoped ......................................................................

  /**
   * Primitive and strangely exotic types.
   * @type {Set<Constructor>}
   */


  const primitives = new Set([String, Number, Boolean, Symbol]);
  /**
   * This pipe simply outputs the input untransformed.
   * @param {*} input
   * @returns {*}
   */

  const identitypipe = input => input;
  /**
   * Create new pipe.
   * @param {Collection} col
   * @param {Constructor|Function|null} pipe
   * @returns {Function}
   */


  function createpipe(col, pipe) {
    if (pipe) {
      return primitives.has(pipe) ? identitypipe : isClass(pipe) ? constructorpipe(col, pipe) : isFunction(pipe) ? functionpipe(col, pipe) : typeerror$1();
    } else {
      return pipe === null ? identitypipe : typeerror$1();
    }
  }
  /**
   * The pipe is a model constructor.
   * @param {Collection} col
   * @param {constructor} pipe
   * @returns {Function}
   */


  function constructorpipe(col, pipe) {
    const validator = getvalidator(pipe);
    const converter = getconverter(pipe);
    return input => {
      return validator(input) ? converter(input) : fail(col, pipe, input);
    };
  }
  /**
   * The pipe is a function that evaluates the input and returns a constructor.
   * @param {Collection} col
   * @param {Function} pipe
   * @returns {Function}
   */


  function functionpipe(col, pipe) {
    return input => {
      const constructor = pipe(input);
      return constructor.isModelConstructor ? getconverter(constructor)(input) : typeerror$1(`Expected constructor, got ${typeOf(constructor)}`);
    };
  }
  /**
   * @param {Collection} col
   * @param {Constructor} pipe
   * @param {Object} input
   * @throws {TypeError}
   */


  function fail(col, pipe, input) {
    const _ref = [col.name || 'Anonymous', typeOf(input)],
          name = _ref[0],
          type = _ref[1];
    typeerror$1(`Bad input for ${name}: Expected ${pipe.name}, got ${type}.`);
  }
  /**
   * Throw that TypeError.
   * @param {string} message
   * @throws {TypeError}
   */


  function typeerror$1(message) {
    throw new TypeError(message);
  }

  var _class$4;
  /**
   * String that would resolve to integer when used in square bracket notation.
   * TODO: This regular expressions appears over-engineered: Something simpler.
   * @type {RegExp}
   */


  const INTEGER = /^-*(?:[1-9]\d*|\d)$/; // ... but this would then need to parse back to a string to make sure :/
  // const isinteger = string => Number.isInteger(parseInt(string, 10));

  /**
   * Proxytraps for collection aspects (array-like properties).
   */

  let CollectionHandler = (_class$4 = class CollectionHandler {
    /**
     * TODO: Investigate if `array` can be a number somehow? Need validate much?
     * @param {Proto} target
     * @param {Array} [array]
     */
    static init(target, array) {
      if (Array.isArray(target)) {
        getProxy(target).push(...array);
      }
    }
    /**
     * Attempting to set uniquely array-related properties on an actual array?
     * @param {Proto} target
     * @param {string} name
     * @returns {boolean}
     */


    static match(target, name) {
      return Array.isArray(target) && notsymbol$3(name) && (name === 'length' || INTEGER.test(name));
    }
    /**
     * Just FYI: `match` was called before this wass called and therefore we
     * already know that the property is either `length` or a numeric index.
     * @param {Proto} target
     * @param {string\number} name
     * @returns {*}
     */


    static get(target, name) {
      Observers.$peek(target, name);
      return target[name];
    }
    /**
     * Just FYI: `match` was called before this gets called and therefore,
     * we already know that the property is either `length` or an index.
     * If the value is undefined, it usually implies that this index was
     * deleted, so we will not attempt to pipe that into a model (seems
     * that we really cannot distinguish `push(undefined)` from a delete?)
     * @param {Proto} target
     * @param {string} name
     * @param {*} value
     * @returns {boolean}
     */


    static set(target, name, value) {
      Observers.$splice(target);

      if (name === 'length') {
        // TODO: observers when *manually* setting this: `mycol.length = 0`
        target[name] = value;
      } else {
        target[name] = value !== undefined ? resolve$1(target, value) : value;
      }

      return true;
    }

  }, (_applyDecoratedDescriptor(_class$4, "get", [ok], Object.getOwnPropertyDescriptor(_class$4, "get"), _class$4), _applyDecoratedDescriptor(_class$4, "set", [ok], Object.getOwnPropertyDescriptor(_class$4, "set"), _class$4)), _class$4);
  /**
   * Given key is not a symbol?
   * @param {string|Symbol} name
   * @returns {boolean}
   */

  function notsymbol$3(name) {
    return !!name.charAt;
  }
  /**
   * @param {Proto} target
   * @param {*} value
   * @returns {*}
   */


  function resolve$1(target, value) {
    const cons = target.constructor;
    const pipe = getArrayPipe(cons);
    return pipe ? pipe(value) : value;
  }
  /**
   * First level proxy traps. Validate and analyze getter and setter operations,
   * then forward reponsibility to either {ModelHandler} or {CollectionHandler}
   * unless the property is reserved for use in any of the registered {Plugins}.
   */


  class ProxyHandler {
    /**
     * Getter trap.
     * @param {Proto} target
     * @param {string} name
     * @returns {*}
     */
    static get(target, name) {
      const desc = getaccessor(target, name);
      return desc ? getter(target, desc, name) : isFunction(target[name]) ? target[name] : CollectionHandler.match(target, name) ? CollectionHandler.get(target, name) : ModelHandler.get(target, name);
    }
    /**
     * Setter trap.
     * @param {Proto} target
     * @param {string} name
     * @param {*} value
     * @param {object} [desc] - (used internally)
     * @returns {boolean} Return success
     */


    static set(target, name, value) {
      const desc = getaccessor(target, name);
      return desc ? setter(target, desc, name, value) : CollectionHandler.match(target, name) ? CollectionHandler.set(target, name, value) : illegal(target, name, target[name]) ? badset(target, name, true) : ModelHandler.set(target, name, value);
    }
    /**
     * Trap for ownKeys must implement for Chrome
     * to respect property enumerability setting.
     * https://bugs.chromium.org/p/v8/issues/detail?id=1543#c153
     * @param {Object} target
     * @returns {Array<string>}
     */


    static ownKeys(target) {
      const keys = ModelHandler.keys(target);
      return Reflect.ownKeys(target).concat(keys);
    }
    /**
     * Make `Object.keys` work more or less like expected.
     * TODO: Revise for redesigned Plugins infrastructure!
     * TODO: Revise ad-hoc descriptor sometime later on!
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1110332
     * http://mdn.io/Proxy/handler/getOwnPropertyDescriptor
     * @param {Object} target
     * @param {string} name
     * @returns {Object} - Property descriptor
     */


    static getOwnPropertyDescriptor(target, name) {
      const desc = getdescriptor(target, name);
      return has$1(target, name) ? desc : desc ? desc : isPublic(name) ? {
        value: ModelHandler.get(target, name),
        configurable: true,
        enumerable: true
      } : null;
    }
    /**
     * Trap `definePropety`.
     * @param {Object} target
     * @param {string} name
     * @param {Object} desc
     * @returns {boolean}
     */


    static defineProperty(target, name, desc) {
      const old = get$3(target, name);
      const val = desc.value;
      return desc.get || desc.set ? badDefine(target, name) : old !== val ? isPreserved(target, name) ? badset(target, name) : (set$2(target, name, val, desc), Observers.$poke(target, name, val, old), true) : true;
    }
    /**
     * Delete trap.
     * TODO: Actually go ahead and remove the key value
     * pair instead of just setting key to `undefined`
     * (observers could still call `onpoke` undefined).
     * @param {Proto} target
     * @param {string} name
     * @returns {boolean} Return success
     */


    static deleteProperty(target, name) {
      return this.set(target, name, undefined);
    }

  } // Scoped ......................................................................

  /**
   * Get descriptor on target (not scanning the prototype chain).
   * @param {Proto} target
   * @param {string|Symbol} name
   * @returns {Object|undefined}
   */


  function getdescriptor(target, name) {
    return Reflect.getOwnPropertyDescriptor(target, name);
  }
  /**
   * Get accessor for property (scanning the prototype chain).
   * @param {Proto} target
   * @param {string|Symbol} name
   * @returns {Object|undefined}
   */


  function getaccessor(target, name) {
    const desc = getdescriptor(target, name);
    return isSymbol(name) ? undefined : desc && (desc.get || desc.set) ? desc : (target = Object.getPrototypeOf(target)) ? getaccessor(target, name) : undefined;
  }
  /**
   * Resolve getter.
   * @param {Proto} target
   * @param {*} desc
   * @param {string} name
   * @param {boolean} safe
   * @returns {*}
   * @throws {Error}
   */


  function getter(target, desc, name, safe) {
    return desc.get ? has$1(target, name) ? target[name] : function () {
      const pro = getProxy(target);
      const res = desc.get.call(pro);
      Observers.$peek(target, name);
      return res;
    }() : safe ? undefined : badGetter(target, name);
  }
  /**
   * Resolve setter.
   * @param {Proto} target
   * @param {*} desc
   * @param {string} name
   * @param {*} value
   * @returns {boolean} Survive the proxy trap
   * @throws {Error}
   */


  function setter(target, desc, name, value) {
    return desc.set ? function () {
      const oldval = getter(target, desc, name, true);
      desc.set.call(getProxy(target), value);
      Observers.$poke(target, name, value, oldval);
      return true;
    }() : badSetter(target, name);
  }
  /**
   * @param {Proto} target
   * @param {string} name
   * @param {*} field
   * @returns {boolean}
   *
   */


  function illegal(target, name, field) {
    return isFunction(field) || isReadonly(target, name) || isReserved(name);
  }
  /**
   * @param {Proto} target
   * @param {string} name
   * @param {boolean} [isplugin]
   * @throws {AccessError}
   * @returns {boolean} false
   */


  function badset(target, name, isplugin = false) {
    const plugin = isplugin ? find(target.constructor, name) : null;
    badValue(target, name, plugin);
    return false;
  }
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


  function approximate(target, object, array) {
    return Array.isArray(target) || confirm(object) ? target.$observable ? proxify(...arguments) : natural(...arguments) : badConstructor(target, object);
  }
  /**
   * Register plugin to prefix.
   * @param {Class<Proto>|Proto} ModelC
   * @param {string} prefix
   * @param {Constructor} PluginC
   * @param {boolean} [override]
   */


  function registerPlugin(ModelC, prefix, PluginC, override) {
    register(...arguments);
  }
  /**
   * Add some kind of global observer.
   * @param {boolean} on
   * @param {IObserver} obs
   */


  function observe(on, obs) {
    on ? Observers.addGlobal(obs) : Observers.removeGlobal(obs);
  } // Scoped ......................................................................

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
    init(target, proxy);
    ModelHandler.init(target, object);
    CollectionHandler.init(target, array);
    init$1(target);
    done(target);
  }
  /**
   * @param {Function} [superclass] Constructor
   * @returns {Proxy}
   */


  function mixin$1(superclass = class {}) {
    var _class;

    return _class = class Proto extends superclass {
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


      pluginOverride(prefix, Plugin) {
        registerPlugin(this, prefix, Plugin, true);
      }
      /**
       * Output this instance.
       * @param {string|Symbol} [scope]
       * @returns {this}
       */


      output(scope) {
        output(this, scope);
      }
      /**
       * Revoke this instance.
       * @param {string|Symbol} [scope]
       * @returns {this}
       */


      revoke(scope) {
        revoke(this, scope);
      } // Static ..................................................................

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
        return get$2(this);
      }
      /**
       * @returns {number}
       */


      static timestamp() {
        return undefined(this);
      }
      /**
       * TODO: confirm interface.
       * @param {InputHandler} handler
       * @returns {Constructor}
       */


      static connect(handler) {
        connect(this, handler);
      }
      /**
       * TODO: confirm interface.
       * @param {InputHandler} handler
       * @returns {Constructor}
       */


      static disconnect(handler) {
        disconnect(this, handler);
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

    }, (_applyDecoratedDescriptor(_class.prototype, "plugin", [chained], Object.getOwnPropertyDescriptor(_class.prototype, "plugin"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "pluginOverride", [chained], Object.getOwnPropertyDescriptor(_class.prototype, "pluginOverride"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "output", [chained], Object.getOwnPropertyDescriptor(_class.prototype, "output"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "revoke", [chained], Object.getOwnPropertyDescriptor(_class.prototype, "revoke"), _class.prototype), _applyDecoratedDescriptor(_class, "connect", [chained], Object.getOwnPropertyDescriptor(_class, "connect"), _class), _applyDecoratedDescriptor(_class, "disconnect", [chained], Object.getOwnPropertyDescriptor(_class, "disconnect"), _class)), _class;
  }
  /**
   *
   */


  class Model extends mixin$1() {
    /**
     * @param {Object} [object]
     * @returns {Proxy}
     */
    constructor(object = Object.create(null)) {
      return approximate(super(), object);
    }
    /**
     * Identification.
     * @type {String}
     */


    get [Symbol.toStringTag]() {
      return 'Model';
    }
    /**
     * More identification.
     * @returns {string}
     */


    toString() {
      return `[model ${this.constructor.name}]`;
    } // Static ....................................................................

    /**
     * Model type interface.
     * TODO: Perhaps look at [Vue](https://vuejs.org/v2/guide/components.html#Prop-Validation)
     * to finalize the syntax for required status and default value.
     * @param {IMap} map
     * @returns {Imap|null}
     */


    static model(map) {
      return null;
    }
    /**
     * Framework internal.
     * @param {IMap} map
     * @returns {IMap|null}
     */


    static [Symbol.for('@dataplastique/objectpipe')](map) {
      return this.model(...arguments);
    }
    /**
     * Identification for ducks.
     * @type {boolean}
     */


    static get isModelConstructor() {
      return true;
    }
    /**
     * TODO: Is this used???
     * @param {*} thing
     * @returns {*}
     */


    static cast(thing) {
      return thing;
    }

  }

  const simple = {};
  const dimmed = {
    style: 'opacity: 0.5'
  };
  const indent = {
    style: 'margin-left: 14px'
  };
  const double = {
    style: 'margin-left: 28px'
  };
  /**
   * @param {Class<Proto>} Model
   * @param {Object} [config]
   * @returns {Array}
   */

  function head(Model, config) {
    return ['div', simple, `class ${Model.name}`];
  }
  /**
   * @param {Class<Proto>} Model
   * @returns {Array}
   */


  function body(Model) {
    const objectpipe = Symbol.for('@dataplastique/objectpipe');
    return ['div', simple, ...resolveAll(Model[objectpipe]())];
  } // Scoped ......................................................................

  /**
   * @param {Object} model
   * @returns {Array}
   */


  function resolveAll(model) {
    return Object.entries(model).map(resolveOne);
  }
  /**
   * @param {Array<string, *>} entry
   * @returns {Array}
   */


  function resolveOne([key, value]) {
    return ['div', double, ['span', simple, `${key}: `], ['span', simple, format(value)]];
  }
  /**
   * @param {*} value
   * @returns {string}
   */


  function format(value) {
    if (typeof value === 'function') {
      if (native(value) || value.isModelConstructor) {
        return value.name;
      } else {
        return '? function';
      }
    } else {
      return String(value);
    }
  }
  /**
   * TODO: More goes here!
   * @param {*} value
   * @returns {boolean}
   */


  function native(value) {
    switch (value) {
      case String:
      case Number:
      case Boolean:
      case Object:
      case Array:
      case Function:
        return true;
    }

    return false;
  }
  /**
   * @param {Object|Array|Model} object
   * @param {string|number} key
   * @returns {Array}
   */


  function head$1(object, key) {
    const name = getTitle(object, key);
    const guid = object.$id ? ` (${object.$id})` : '';
    return ['div', simple, ['span', simple, name], ['span', dimmed, guid]];
  }
  /**
   * @param {Object|Array|Model} object
   * @returns {Array}
   */


  function body$1(object) {
    return ['div', simple].concat(Array.isArray(object) ? arrayMembers(object) : instanceProps(object));
  } // Scoped ......................................................................

  /**
   * TODO: Color coding goes here!
   * @param {string|number} key
   * @param {*} value
   * @returns {string}
   */


  function asattrib(key, value) {
    return `${key}: ${value}`;
  }
  /**
   * @param {Object|Array|Model} object
   * @param {string|number} key
   * @returns {string}
   */


  function getTitle(object, key) {
    return key !== undefined ? asattrib(key, getTitle(object)) : getName(object, object.constructor);
  }
  /**
   * @param {Object|Array|Model} object
   * @param {Class<Object|Array|Model>} constructor
   * @returns {string}
   */


  function getName(object, constructor) {
    switch (constructor) {
      case Object:
        return Object.keys(object).length ? '{…}' : '{}';

      case Array:
        return object.length ? '[…]' : '[]';

      default:
        return constructor.name;
    }
  }
  /**
   * Resolve array arrayMembers.
   * @param {Array} array
   * @returns {Array}
   */


  function arrayMembers(array) {
    return array.map((value, index) => {
      return dennis(index, value);
    });
  }
  /**
   * Resolve instance (own) properties.
   * @param {Object} object
   * @returns {Array}
   */


  function instanceProps(object) {
    return Object.entries(object).map(([key, value]) => {
      return dennis(key, value);
    });
  }
  /**
   * @param {string|number} key
   * @param {*} value
   * @returns {Array}
   */


  function dennis(key, value) {
    const output = hans(key, value);
    const simple$$1 = typeof output === 'string';
    return ['div', simple$$1 ? double : indent, output];
  }
  /*
   * @param {string|number} key
   * @param {*} value
   * @returns {Array}
   */


  function hans(key, value) {
    if (typeof value === 'object') {
      return asobject(key, value);
    } else {
      return asattrib(key, format$1(value));
    }
  }
  /**
   * Format quotes on strings.
   * @param {*} value
   * @returns {*}
   */


  function format$1(value) {
    return typeof value === 'string' ? `"${value}"` : value;
  }
  /**
   * @param {string|number} key
   * @param {Object|Array} value
   * @returns {Array}
   */


  function asobject(key, value) {
    return ['object', {
      object: value,
      config: {
        dataplastique: true,
        key: key
      }
    }];
  }
  /**
   * Render the header.
   * @param {*} object
   * @param {Object} [config]
   * @returns {Object|null}
   */


  function header(object, config) {
    return config && config.dataplastique ? head$1(object, config.key) : definez(object) ? head(object) : extendz(object) ? head$1(object) : null;
  }
  /**
   * Should display a tree-twisty to expand either type defs or instance props?
   * @param {*} object
   * @returns {boolean}
   */


  function hasBody(object) {
    return definez(object) ? haspipe(object) : lengthy(object);
  }
  /**
   * Render the body, either type definitions or instance props.
   * @param {*} object
   * @param {Object} [config]
   * @returns {Object|null}
   */


  function body$2(object, config) {
    return config && config.dataplastique ? body$1(object) : definez(object) ? body(object) : extendz(object) ? body$1(object) : null;
  } // Scoped ......................................................................


  const objpipe = Symbol.for('@dataplastique/objectpipe');
  const arrpipe = Symbol.for('@dataplastique/arraypipe');

  const isfuncz = o => typeof o === 'function';

  const objectz = o => typeof o === 'object';

  const extendz = o => objectz(o) && Model.is(o);

  const definez = o => isfuncz(o) && o.isModelConstructor;

  const haspipe = o => !!(o[objpipe]() || o[arrpipe] && o[arrpipe]());

  const lengthy = o => !!(Object.keys(o).length || o.length);

  var Formatter =
  /*#__PURE__*/
  Object.freeze({
    header: header,
    hasBody: hasBody,
    body: body$2
  });
  /**
   * Install custom console debug formatters.
   * @param {Window|GlobalContext} [context]
   */

  function installdevtools(context = window) {
    formatters(context).push(Formatter);
  } // Scoped ......................................................................

  /**
   * Formatters live inside a bizarre array that doesn't exist.
   * @param {Window|GlobalContext} context
   * @returns {Array<Object>}
   */


  function formatters(context) {
    return context.devtoolsFormatters || (context.devtoolsFormatters = []);
  }
  /**
   * Decorator to assign plugins for a Proto constructor (so a class decorator).
   * TODO: Support some `override` arg to bypass previous assignment to same key.
   * @param {string} key
   * @param {Class<Plugin>} PluginC
   * @returns {Function}
   */


  function plugin(key, PluginC) {
    return function plugged(ProtoC) {
      registerPlugin(ProtoC, key, PluginC);
    };
  }
  /**
   * Plugin.
   */


  class Plugin extends mixin$1() {
    /**
     * Plugins are by default not observable. Make sure to toggle this property
     * if the plugins primary function is to store some kind of observable state.
     * Also, the plugin cannot enforce type safety before this is toggled `true`,
     * although this behavior should probably be controlled by a saparate flag.
     * TODO: Separate flag!
     * @type {boolean}
     */
    get $observable() {
      return false;
    }
    /**
     * @param {Object} [object]
     * @returns {Proxy}
     */


    constructor(object = Object.create(null)) {
      const proxy = approximate(super(), object);
      confirmhost(proxy, proxy.host);
      return proxy;
    }
    /**
     * Identification.
     * @type {String}
     */


    get [Symbol.toStringTag]() {
      return 'Plugin';
    }
    /**
     * More identification.
     * @returns {string}
     */


    toString() {
      return `[plugin ${this.constructor.name}]`;
    } // Static ....................................................................

    /**
     * Return a constructor here to make the Plugin only accept this type of host.
     * @returns {Class<Proto>|null} - use `null` to simply bypass this restriction
     */


    static host() {
      return null;
    }
    /**
     * Plugin is lazy? It will then not be instantiated until it is accessed.
     * @returns {boolean} - If `false`, the Plugin is newed up with the host.
     */


    static lazy() {
      return true;
    }
    /**
     * Plugin type interface. Equivalent to `static model` on {Model} classes.
     * Note that the plugin must be toggled `$observable` for this to work out.
     * @param {IMap} map
     * @returns {Imap|null}
     */


    static plugin(map) {
      return null;
    }
    /**
     * Framework internal.
     * @param {IMap} map
     * @returns {IMap|null}
     */


    static [Symbol.for('@dataplastique/objectpipe')](map) {
      return this.plugin(...arguments);
    }
    /**
     * Identification for ducks.
     * @type {boolean}
     */


    static get isPluginConstructor() {
      return true;
    }

  } // Scoped ......................................................................

  /**
   * @param {Plugin} plugin
   * @param {Proto} inputhost
   * @throws {TypeError}
   * @returns {Proto}
   */


  function confirmhost(plugin, inputhost) {
    const accepthost = plugin.constructor.host();
    return accepthost === null || accepthost.is(inputhost) ? inputhost : badhost(plugin, accepthost, inputhost);
  }
  /**
   * @throws {TypeError}
   * @param {Plugin} plugin
   * @param {Constructor} accepthost
   * @param {*} inputhost
   */


  function badhost(plugin, accepthost, inputhost) {
    throw new TypeError(`${plugin.constructor.name} 
		expected a ${accepthost.name} host, got: ${inputhost}`);
  }
  /**
   *
   */


  class Collection$1 extends mixin$1(class extends Array {}) {
    /**
     * @param {...*} args
     * @returns {Proxy}
     */
    constructor(...args) {
      return approximate(super(), Object.create(null), args);
    }
    /**
     * Identification.
     * @type {string}
     */


    get [Symbol.toStringTag]() {
      return 'Collection';
    }
    /**
     * More identification.
     * @returns {string}
     */


    toString() {
      return `[collection ${this.constructor.name}]`;
    } // Static ....................................................................

    /**
     * Create anonymous collection of given type.
     * TODO: Via symbol so that `import { Collection, of } from 'dataplastique'`
     * @param {Proto|Function|null} cons
     * @returns {Class<Collection>}
     */


    static $of(cons) {
      return class extends this {
        static collection() {
          return cons;
        }

      };
    }
    /**
     * Model type interface.
     * @param {IMap} map
     * @returns {Imap|null}
     */


    static model(map) {
      return null;
    }
    /**
     * Collection type interface.
     * @returns {Proto|Function|null}
     */


    static collection() {
      return null;
    }
    /**
     * Framework internal.
     * @param {IMap} map
     * @returns {IMap|null}
     */


    static [Symbol.for('@dataplastique/objectpipe')](map) {
      return this.model(...arguments);
    }
    /**
     * Framework internal.
     * @returns {Proto|Function|null}
     */


    static [Symbol.for('@dataplastique/arraypipe')]() {
      return this.collection();
    }
    /**
     * Should `map` and `reduce` to simple array (and not Collection).
     * @type {Array}
     */


    static get [Symbol.species]() {
      return Array;
    }
    /**
     * Identification for ducks: Identify as Model.
     * @type {boolean}
     */


    static get isModelConstructor() {
      return true;
    }
    /**
     * Identification for ducks: Identify as Collection.
     * @type {boolean}
     */


    static get isCollectionConstructor() {
      return true;
    }

  }

  if (Environment.browser) {
    installdevtools();
  }
  /**
   * TODO: How to expose this?
   * @param {Observer} obs - TODO: Define `Observer` interface somewhere
   */


  function addGlobalObserver(obs) {
    observe(true, obs);
  }
  /**
   * TODO: How to expose this?
   * @param {Observer} obs
   */


  function removeGlobalObserver(obs) {
    observe(false, obs);
  }

  let config = null;
  /**
   * TODO: Figure out a way to make this thing universally accessible!
   * General configuration via `boot(options)`. We'll define this as a
   * Model in orer to automatically catch any typos and invalid properties.
   */

  class Config extends Model {
    /**
     * Configuration interface. The desciption of these props are given down below.
     * @param {IMap} map
     * @returns {Object}
     */
    static model(map) {
      return {
        debug: Boolean,
        // TODO: default `false`
        xhtml: Boolean // TODO: default `false`

      };
    }
    /**
     * Initialize configuration.
     * @param {Object} object
     */


    static init(object) {
      if (config) {
        throw new ConfigurationError('Configuration dysfunction');
      } else {
        config = new Config(object);
      }
    }
    /**
     * Development mode enabled? Rarely the case in production, that is.
     * @type {boolean}
     */


    static get debug() {
      return config.debug;
    }
    /**
     * Expect all EDBML scripts to return well-formed XHTML markup?
     * This has no practical implications unless `debug` is enabled.
     * @type {boolean}
     */


    static get xhtml() {
      return config.xhtml;
    }

  }
  /**
   * Tracking spirits by element.
   * @type {WeakMap<Element, Spirit>}
   */


  const spirits = new WeakMap();
  /**
   * @type {WeakMap<Element, Set<Function>>}
   */

  const expects = new WeakMap();
  /**
   * TODO: `dataset.plastiqueId` not reliable in Firefox, remove this all over!
   * TODO: This should be configurable, must read from the config.
   * @type {string}
   */

  const ID = 'data-plastique-id';
  /**
   * Register spirit for element.
   * @param {Element} elm
   * @param {Spirit} spirit
   * @returns {Spirit}
   */

  function set$3(elm, spirit) {
    spirits.set(elm, spirit);
    stamp(elm, spirit.$id);
    return spirit;
  }
  /**
   * Get spirit for element.
   * @param {Element} elm
   * @param {Function} [cb]
   * @returns {Spirit}
   */


  function get$4(elm, cb) {
    cb = cb && typeof cb === 'function' ? cb : undefined;
    const spirit = stamped(elm) ? spirits.get(elm) || null : null;
    return cb ? applyOrDefer(spirit, elm, cb) : spirit;
  }
  /**
   * Element has spirit?
   * @param {Element} elm
   * @returns {boolean}
   */


  function has$2(elm) {
    return stamped(elm) && spirits.has(elm);
  }
  /**
   * Invoked after the spirits `onready` callback to evaluate whether
   * or not any callbacks has been registed for the spirits element.
   * @see {Cycle#ready}
   * @param {Spirit} spirit
   * @param {Element} elm
   */


  function applyDeferred(spirit, elm = spirit.element) {
    if (expects.has(elm)) {
      const cbs = expects.get(elm);
      expects.delete(elm);
      cbs.forEach(cb => cb(spirit));
    }
  } // Scoped ......................................................................

  /**
   * Stamp the element with the spirit `$id` mostly so that the developer can
   * confirm that the spirit has been initialized. Note that the `data-plastique-id`
   * attribute will not always be identical to the spirit `$id` property (when for
   * example the element was created with the `data-plastique-id` in some EDBML).
   * @param {Element} elm
   * @param {string|null} guid
   */


  function stamp(elm, guid) {
    guid ? stamped(elm) ? void 0 : elm.setAttribute(ID, guid) : elm.removeAttribute(ID);
  }
  /**
   * Quickly test if element could be assoicated to
   * a spirit before we confirm it via the WeakMap.
   * @param {Element} elm
   * @returns {boolean}
   */


  function stamped(elm) {
    return elm.hasAttribute(ID);
  }
  /**
   * @param {Spirit|null} spirit
   * @param {Element} elm
   * @param {Function} cb
   * @returns {Spirit|null}
   */


  function applyOrDefer(spirit, elm, cb) {
    if (cb) {
      spirit ? cb(spirit) : expects.has(elm) ? expects.get(elm).add(cb) : expects.set(elm, new Set([cb]));
    }

    return spirit;
  } // lifecycle stuff


  const LIFE_ATTACH = 'gui-life-attach';
  const LIFE_ENTER = 'gui-life-enter';
  const LIFE_READY = 'gui-life-ready';
  const LIFE_DETACH = 'gui-life-detach'; // export const LIFE_EXIT = 'gui-life-exit';

  const DATA_PLASTIQUE_ID = 'data-plastique-id';
  const EVENT_ATTRIBUTE_CHANGED = 'dataplastique-attribute-change';
  /**
   * @classdesc
   * Attempting to manage the spirit lifecycle as much as possible in a single file.
   */

  /**
   * Construct spirit for element. Note that the spirits `onconstruct` call
   * will be performed by the {Model} class that the spirit extends from.
   * @param {Element} elm
   * @param {Class<Spirit>} SpiritC
   * @returns {Spirit}
   */

  function possess(elm, SpiritC) {
    return register$1(elm, SpiritC);
  }
  /**
   * Attach spirit for element.
   * @param {Spirit} spirit
   * @returns {Spirit}
   */


  function attach(spirit) {
    if (!spirit.life.attached) {
      spirit.life.attached = true;
      spirit.onattach();
      spirit.life.dispatch(LIFE_ATTACH);

      if (spirit.johnson && spirit.johnson.onattach) {
        spirit.johnson.onattach();
      }
    }

    return spirit;
  }
  /**
   * Enter spirit for element (attach for the first time).
   * @param {Spirit} spirit
   * @returns {Spirit}
   */


  function enter(spirit) {
    if (!spirit.life.entered) {
      spirit.life.entered = true;
      spirit.onenter();
      spirit.life.dispatch(LIFE_ENTER);

      if (spirit.johnson && spirit.johnson.onenter) {
        spirit.johnson.onenter();
      }
    }

    return spirit;
  }
  /**
   * Ready spirit for element.
   * @param {Spirit} spirit
   * @returns {Spirit}
   */


  function ready(spirit) {
    if (!spirit.life.ready) {
      spirit.life.ready = true;
      spirit.onready();
      spirit.life.dispatch(LIFE_READY);
      applyDeferred(spirit);
    }

    return spirit;
  }
  /**
   * Detach spirit for element. This will also mark the spirit for
   * destruction unless it is reinserted more or less immediately.
   * @param {Spirit} spirit
   * @returns {Spirit}
   */


  function detach(spirit) {
    if (spirit.life.attached) {
      spirit.life.attached = false;
      spirit.ondetach();
      spirit.life.dispatch(LIFE_DETACH);
    }

    return spirit;
  }
  /**
   * TODO!
   */


  function exorcize() {
    console.warn('TODO: exorcize'); // spirit.life.dispatch(DESTRUCT); // First!
  }
  /**
   * Newup spirit and register to element.
   * @param {Element} elm
   * @param {Class<Spirit>} SpiritC
   * @returns {Spirit}
   */


  function register$1(elm, SpiritC) {
    return set$3(elm, new SpiritC({
      element: elm
    }));
  }
  /**
   * @type {Map<string, Class<Spirit>}
   */


  const channelings = new Map();
  /**
   * @param {string} tag
   * @param {Class<Spirit>} SpiritC
   */

  function channel(tag, SpiritC) {
    channelings.set(tag, SpiritC);
  }
  /**
   * TODO: Spawn with parameter tagname (and assign the `is` attribute).
   * @param {Class<Spirit>} SpiritC
   * @returns {Spirit}
   */


  function spawn(SpiritC) {
    const tag = gettag(SpiritC);

    if (tag) {
      return possess(document.createElement(tag), SpiritC);
    } else {
      throw new Error(`${SpiritC.name} has not been channeled`);
    }
  }
  /**
   * Boot the shebang.
   * @param {Node} root
   * @returns {Node}
   */


  function bootstrap(root = document) {
    startobserver(root);
    treeupdate([root]);
    return root;
  } // Scoped ......................................................................


  const iselm = node => node.nodeType === Node.ELEMENT_NODE,
        entries = () => Array.from(channelings.entries()),
        specialtag = elm => elm.localName.includes('-'),
        special$3 = elm => specialtag(elm) || elm.hasAttribute('is'),
        channeltag = elm => elm.getAttribute('is') || elm.localName,
        channeled = elm => iselm(elm) && special$3(elm) && channelings.has(channeltag(elm)),
        channeling = elm => channelings.get(channeltag(elm)),
        elements = nodes => Array.from(nodes).filter(iselm),
        headless = added => spirit => !added.includes(spirit.element),
        possession = elm => get$4(elm) || possess(elm, channeling(elm));
  /**
   * @param {Node} node
   */


  function startobserver(node) {
    const handler = list => list.forEach(handle);

    new MutationObserver(handler).observe(node, {
      attributeOldValue: true,
      attributes: true,
      childList: true,
      subtree: true
    });
  }
  /**
   * Handle mutations.
   * @param {MutationRecord} record
   * @using {NodeList} addedNodes
   * @using {NodeList} removedNodes
   */


  function handle({
    type,
    target,
    addedNodes,
    removedNodes,
    attributeName,
    oldValue
  }) {
    type === 'childList' ? treeupdate(elements(addedNodes), elements(removedNodes)) : attsupdate(target, attributeName, oldValue);
  }
  /**
   * Update elements.
   * @param {Array<Element>} added
   * @param {Array<Element>} [removed]
   */


  function treeupdate(added, removed = []) {
    collectall(removed).filter(has$2).map(get$4).map(detach).filter(headless(added)).forEach(exorcize);
    collectall(added).map(possession).map(attach).map(enter).reverse().map(ready);
  }
  /**
   * Attribute changes are interesting for entities that will evolve much later
   * in the ecosystem and so we will avoid hard and circular dependencies here
   * by dispatching the attribute update information via a regular DOM event.
   * @param {Element} target
   * @param {string} name
   * @param {string} oldval
   * @param {string} newval
   */


  function attsupdate(target, name, oldval, newval = target.getAttribute(name)) {
    if (has$2(target) && name !== DATA_PLASTIQUE_ID) {
      target.dispatchEvent(new CustomEvent(EVENT_ATTRIBUTE_CHANGED, {
        detail: {
          name,
          oldval,
          newval
        },
        bubbles: false
      }));
    }
  }
  /**
   * Collect from list all elements with existing or potential spirits.
   * @param {Array<Element>} elms
   * @returns {Array<Element>}
   */


  function collectall(elms) {
    return elms.reduce((all, elm) => all.concat(collect(elm)), []);
  }
  /**
   * Find in subtree all elements that should be or could already be possessed.
   * @param {Element} elm
   * @param {Array<Spirit>} [all]
   * @returns {Array<Spirit>}
   */


  function collect(elm, all = []) {
    if (elm) {
      channeled(elm) ? all.push(elm) : void 0;
      collect(elm.firstElementChild, all);
      collect(elm.nextElementSibling, all);
    }

    return all;
  }
  /**
   * Get tag for possessor (get key for value).
   * @param {Class<Spirit>} SpiritC
   * @returns {string}
   */


  function gettag(SpiritC) {
    return entries().reduce((result, [tag, klass]) => {
      return result || (klass === SpiritC ? tag : null);
    }, null);
  }
  /**
   * That's the spirit.
   * TODO: `uniget` and `uniset` should also be documented in here somehow,
   * these static methods are currently only documented in the {CSSPlugin}.
   * @extends {Model}
   */


  class Spirit extends Model {
    /**
     * Identification.
     * @type {boolean}
     */
    get isSpirit() {
      return true;
    }
    /**
     * Identification.
     * @type {String}
     */


    get [Symbol.toStringTag]() {
      return 'Spirit';
    }
    /**
     * Identification.
     * @returns {string}
     */


    toString() {
      return `[spirit ${this.constructor.name}]`;
    } // Lifecycle .................................................................

    /**
     * Note that the element may not be positioned in the DOM at this point.
     */


    onconstruct() {}
    /**
     * `onenter` gets called when the spirit element is first
     * encounted in the page DOM. This is only called once in
     * the lifecycle of a spirit (unlike `attach`, see below).
     */


    onenter() {}
    /**
     * `onattach` gets called whenever
     *
     * 1. The spirit element is already in DOM when the page loads
     * 2. The spirit element is later on attached to the main DOM
     */


    onattach() {}
    /**
     * `onready` gets called (only once) when all descendant spirits
     * are attached and ready. From a DOM tree perspective, this fires
     * in reverse order, innermost first.
     */


    onready() {}
    /**
     * `ondetach` gets callend whenever the spirit element is about to
     * be detached from the DOM tree. Unless the element is appended
     * somewhere else, this will schedule the spirit for destruction.
     */


    ondetach() {}
    /**
     * Note that the element may not be positioned in the DOM at this point.
     */


    ondestruct() {} // Runtime ...................................................................

    /**
     * @deprecated (?)
     * Handle crawler.
     * @param {Crawler} crawler
     * @returns {number}
     */


    oncrawler(crawler) {
      return 0;
    } // Static ....................................................................

    /**
     * Get spirit for argument.
     * @param {Element|string} arg
     * @param {Function} [cb]
     * @returns {Spirit}
     */


    static get(arg, cb) {
      if (isElement(arg)) {
        return get$4(arg, cb);
      } else if (isString(arg)) {
        console.warn('TODO: Support CSS selectors scoped from document root');
        return null;
      } else {
        throw new TypeError('Well, that was unexpected');
      }
    }
    /**
     * Something has a spirit?
     * @param {Element|string} arg
     * @returns {boolean}
     */


    static has(arg) {
      return !!Spirit.get(arg);
    }
    /**
     * Official factory method for spirit creation. The spirit subclasses may
     * overwrite this to support various arguments and configuration options.
     * @returns {Spirit}
     */


    static summon() {
      return this.spawn();
    }
    /**
     * Spawn an appropriate element and return the spirit. If an element is
     * provided, the channeling will be confirmed to exist. If a string is
     * provided, an element of that tagname will be created and validated.
     * @param {string|Element} [arg]
     * @returns {Spirit}
     */


    static spawn(arg) {
      if (arguments.length) {
        console.error('TODO');
      }

      return spawnInferred(this);
    }
    /**
     * Experimental!
     * @param {Class<HTMLElement>} Elm
     * @param {Spirit} spirit
     * @returns {Class<HTMLElement>}
     */


    static api(Elm, spirit) {
      return class extends Elm {};
    }
    /**
     * Spirit type interface. Equivalent to `static model` on {Model} classes.
     * TODO: Implement type system support at least for `Element` so this can work!
     * @param {IMap} map
     * @returns {Imap|null}
     */


    static spirit(map) {
      return null;
    }
    /**
     * Identification for ducks.
     * TODO: Rename this somehow
     * @type {boolean}
     */


    static get isSpiritConstructor() {
      return true;
    } // Privileged ................................................................

    /**
     * Framework internal.
     * @param {IMap} map
     * @returns {IMap|null}
     */


    static [Symbol.for('@dataplastique/objectpipe')](map) {
      return this.spirit(...arguments);
    }

  }
  /**
   * Channeling the spirit. Optionally to be used as a class decorator.
   * @param {string} tag
   * @param {Class<Spirit>} [SpiritC]
   * @returns {Function}
   */


  function channeling$1(tag, SpiritC) {
    const decorates = arguments.length === 1;

    if (decorates) {
      return function decorated(SpiritC) {
        channel(tag, SpiritC);
      };
    } else {
      channel(tag, SpiritC);
    }
  } // Scoped ......................................................................

  /**
   * Create a spirit based on the channeling for given constructor.
   * @param {Class<Spirit>} SpiritC
   * @returns {Spirit}
   */


  function spawnInferred(SpiritC) {
    return spawn(SpiritC);
  }
  /**
   * boot the entire shebang. We'll return a promise here in case we later
   * find something promising to return. Note that this causes an async break,
   * se consider an alternative (callback) if the initial rendering flashes.
   * @param {Object} [config] - TODO: parse this into {Config}
   * @returns {Promise}
   */


  function boot(config = {}) {
    return new Promise((resolve, reject) => {
      boot.done ? resolve() : document.readyState === 'loading' ? reject(`Premature boot: Await DOMContentLoaded`) : (Config.init(config), bootstrap(document), boot.done = true, resolve());
    });
  }
  /**
   * Activate the mutation observer system for given node, most likely
   * some `shadowRoot` since otherwise it would otherwise already work.
   * @param {Node} node
   * @returns {Node}
   */


  function reboot(node) {
    return bootstrap(node);
  }
  /**
   * Class-mixin for tracking callbacks associated to "patterns" that are really
   * just arrays of anything. The host class is expected to define some behavior.
   * @param {Class<Plugin>} [superclass]
   * @returns {Class<Plugin>}
   */


  function Tracker(superclass = Plugin) {
    var _class;
    /**
     * Tracking patterns and associated handlers.
     * @type IMapping<IList, ISet<Function|Object>>
     */


    const handlers = new IMapping();
    return _class = class Tracker extends superclass {
      constructor(...args) {
        super(...args);
        this.chained = void 0;
        this.chained = void 0;
        this.chained = void 0;
      }

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


      once(pattern, handler = this.host) {
        console.log('TODO!'); // this.on(pattern, handler);
      }
      /**
       * Add or remove all based on truthy first param.
       * @param {truthy} on
       * @param {Array} pattern
       * @param {Function|Object} handler
       * @returns {this}
       */


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
      } // Privileged ..............................................................

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
      } // Static ..................................................................

      /**
       * Get the map of patterns and handlers.
       * @returns {IMap<IList, ISet<Function>>}
       */


      static map() {
        return handlers.map;
      }

    }, _applyDecoratedDescriptor(_class.prototype, "shift", [chained], Object.getOwnPropertyDescriptor(_class.prototype, "shift"), _class.prototype), _class;
  } // Scoped ......................................................................

  /**
   * @param {string|Array} pattern
   * @returns {IList}
   */


  function normalize(pattern) {
    return fromJS(flatten(asarray(pattern)));
  }
  /**
   * A required method was not defined in the subclass.
   * TODO: Create some kind of ES7 decorator for this.
   * @param {Plugin} plugin
   * @throws {Error}
   */


  function implementationError(plugin$$1) {
    throw new Error(`${plugin$$1} expected an implementation`);
  }
  /**
   * Workaroundy timestamp thing.
   * @type {Symbol}
   */


  const timestamp$1 = Symbol.for('dataplastique:timestamp');
  /**
   *
   */

  class IOPlugin extends Tracker() {
    /**
     * @param {IList<Function|IMap<Function, Function>>} pattern
     * @param {Function} handler
     * @param {boolean} [one]
     */
    $on(pattern, handler, one) {
      connect$1(pattern);
    }
    /**
     * @param {IList<Function|IMap<Function, Function>>} pattern
     * @param {Function} handler
     */


    $off(pattern, handler) {
      disconnect$1(pattern);
    }
    /**
     * @param {Model} model
     */


    static oninput(model) {
      const target = model.constructor;
      this.map().filter((handlers, pattern) => matches(pattern, target)).forEach((handlers, pattern) => {
        trigger(handlers, collect$1(pattern, target));
      });
    }

  } // Scoped ......................................................................


  const notnull = input => input !== null;

  const isclass = input => typeof input === 'function';

  const tomodel = input => isclass(input) ? input : input.toList();

  const outside = klass => !!klass.output();

  const gettime = klass => klass[timestamp$1];
  /**
   * Connect plugin to models.
   * @param {IList<Function|IMap<Function, Function>>} types
   */


  function connect$1(types) {
    const models = types.map(tomodel).flatten();
    models.forEach(model => model.connect(IOPlugin));
  }
  /**
   * TODO: Compare with flattened map and only disconnect if model is one entry
   * @param {Array<Function|Object<Function, Function>>} types
   */


  function disconnect$1(types) {
    console.error('TODO!');
  }
  /**
   * @param {IList} pattern
   * @param {Class<Model>} target
   * @returns {boolean}
   */


  function matches(pattern, target) {
    return pattern.reduce((does, next) => {
      return does || (Map$1.isMap(next) ? next.includes(target) : next === target);
    }, false);
  }
  /**
   * If all expected output has been collected, poke the associated handlers.
   * @param {Set<Function>} set
   * @param {Array<Class<Model>>} args
   */


  function trigger(set, args) {
    if (args.every(notnull)) {
      set.forEach(handler => handler(...args));
    }
  }
  /**
   * Collect output.
   * @param {IList} pattern
   * @param {Class<Model>} target
   * @returns {Array<Class<Model>>}
   */


  function collect$1(pattern, target) {
    return pattern.reduce((args, next) => {
      return args.concat(output$1(Map$1.isMap(next) ? latest(next) : next));
    }, []);
  }
  /**
   * From types in map, get the one that was output most recently (if any).
   * @param {IMap<Class<Model>, Class<Model>>} map
   * @returns {Class<Model>|null}
   */


  function latest(map) {
    return map.toList().filter(outside).maxBy(gettime);
  }
  /**
   * Get output of given type (or `null` if not).
   * @param {Class<Model>|undefined} C
   * @returns {Model|null}
   */


  function output$1(C) {
    return C ? C.output() : null;
  }
  /**
   *
   */


  class SpiritPlugin extends Plugin {
    /**
     * Identification.
     * @type {String}
     */
    get [Symbol.toStringTag]() {
      return `[plugin ${this.constructor.name}]`;
    }
    /**
     * @type {Spirit}
     */


    get spirit() {
      return this.host;
    }
    /**
     * @type {Element}
     */


    get element() {
      return this.host.element;
    }
    /**
     * Plugin will accept any Spirit host (at least by default).
     * TODO: Allow multiple?
     * @returns {Spirit}
     */


    static host() {
      return Spirit;
    }

  }
  /**
   * @returns {Function}
   */


  function plugin$1() {
    return plugin(...arguments);
  }

  var _class$5;
  /**
   * TODO: Move this thing over to `@dataplastique/util/Immutable` (IMapping?)
   * Plugin that needs to keep track of things, let's say the arguments for
   * `addEventListener`, so that the listener is never registered twice with
   * the same arguments and can be cleanup up for garbage collection later on.
   */


  let TrackerPlugin = (_class$5 = class TrackerPlugin extends SpiritPlugin {
    /**
     * Add handler for type of event.
     * The subclass will implement this.
     * @param {string} type
     */
    on(type) {
      implementationError$1(this);
    }
    /**
     * Remove handler for type of event.
     * The subclass will implement this.
     * @param {string} type
     */


    off(type) {
      implementationError$1(this);
    }
    /**
     * Remove handler for type of event
     * whenever the event is registered.
     * The subclass will implement this.
     * @param {string} type
     */


    one(type) {
      implementationError$1(this);
    }
    /**
     * Add or remove handlers based on truthy first param.
     * @param {truthy|falsy} on
     * @param {string|Array<string>} type
     * @param {BroadcastHandler} [handler]
     * @returns {this}
     */


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
    } // Privileged ................................................................

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
        console.log(this.constructor.name, this.spirit.toString(), 'no checklist :/');
      }

      this._checklist = null;
      super.ondestruct();
    } // Private ...................................................................

    /**
     * Can add checks for type? If so, do it now.
     * @param {string} type
     * @param {Array<object>} checks
     * @returns {boolean} - Was added?
     */


    _addchecks(type, checks) {
      const list = this._checklist;
      {
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

      if (checks = list.getSimilar(type, checks)) {
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

  }, _applyDecoratedDescriptor(_class$5.prototype, "shift", [chained], Object.getOwnPropertyDescriptor(_class$5.prototype, "shift"), _class$5.prototype), _class$5);
  /**
   * A required method was not defined in the subclass.
   * TODO: Create some kind of ES7 decorator for this.
   * @param {Plugin} plugin
   * @throws {Error}
   */

  function implementationError$1(plugin) {
    throw new Error(`${plugin} expected an implementation`);
  }

  var _class$6;
  /**
   * Broadcast.
   * TODO: Rename `add/remove` `on/off`
   * TODO: Move to `dataplastique-util` project (sans global stuff)
   * TODO: Support array arguments (batched broadcasts).
   * TODO: Pool broadcasts.
   */


  let Broadcast = (_class$6 = class Broadcast {
    /**
     * Use static methods `dispatch` and `dispatchGlobal` to create broadcasts.
     * @param {string} type
     * @param {Object} [data]
     * @param {boolean} [isglobal]
     */
    constructor(type, data = null, isglobal = false) {
      /**
       * Broadcast type.
       * @type {string}
       */
      this.type = type;
      /**
       * Broadcast data.
       * @type {Object}
       */

      this.data = data;
      /**
       * Global broadcast?
       * @type {boolean}
       */

      this.global = isglobal;
    }
    /**
     * Subscribe handler to type.
     * @param {string|Array<string>} type
     * @param {object|constructor} handler
     * @returns {Constructor}
     */


    static add(type, handler) {
      add(type, handler);
    }
    /**
     * Unsubscribe handler from broadcast.
     * @param {string|Array<string>} type
     * @param {object|constructor} handler
     * @returns {Constructor}
     */


    static remove(type, handler) {
      remove$1(type, handler);
    }
    /**
     * Subscribe handler to type globally.
     * @param {string|Array<string>} type
     * @param {object|constructor} handler
     * @returns {Constructor}
     */


    static addGlobal(type, handler) {
      add(type, handler, true);
    }
    /**
     * Unsubscribe handler from global broadcast.
     * @param {string|Array<string>} type
     * @param {object|constructor} handler
     * @returns {Constructor}
     */


    static removeGlobal(type, handler) {
      remove$1(type, handler, true);
    }
    /**
     * Publish broadcast in local scope (this window).
     * TODO: queue for incoming dispatch (finish current type first).
     * @param {string} type
     * @param {Object} data
     */


    static dispatch(type, data) {
      dispatch$1(type, data, false);
    }
    /**
     * Dispatch broadcast in global scope (all windows).
     * TODO: queue for incoming dispatch (finish current first).
     * TODO: Handle remote domain iframes ;)
     * @param {string} type
     * @param {Object} data
     * @returns {gui.Broadcast}
     */


    static dispatchGlobal(type, data) {
      dispatch$1(type, data, true);
    }

  }, (_applyDecoratedDescriptor(_class$6, "add", [chained], Object.getOwnPropertyDescriptor(_class$6, "add"), _class$6), _applyDecoratedDescriptor(_class$6, "remove", [chained], Object.getOwnPropertyDescriptor(_class$6, "remove"), _class$6), _applyDecoratedDescriptor(_class$6, "addGlobal", [chained], Object.getOwnPropertyDescriptor(_class$6, "addGlobal"), _class$6), _applyDecoratedDescriptor(_class$6, "removeGlobal", [chained], Object.getOwnPropertyDescriptor(_class$6, "removeGlobal"), _class$6), _applyDecoratedDescriptor(_class$6, "dispatch", [chained], Object.getOwnPropertyDescriptor(_class$6, "dispatch"), _class$6), _applyDecoratedDescriptor(_class$6, "dispatchGlobal", [chained], Object.getOwnPropertyDescriptor(_class$6, "dispatchGlobal"), _class$6)), _class$6);
  const LOCALS = new Mapping();
  const GLOBALS = new Mapping();
  /**
   * Subscribe handler to type(s).
   * confirmed('array|string', 'object|function')
   * @param {Array<string>|string} type
   * @param {IBroadcastHandler} handler
   * @param {boolan} isglobal
   */

  function add(type, handler, isglobal) {
    let handlers = isglobal ? GLOBALS : LOCALS;
    asarray(type, t => handlers.add(t, handler));
  }
  /**
   * @param {Array<string>|string} type
   * @param {IBroadcastHandler} handler
   * @param {boolan} isglobal
   */


  function remove$1(type, handler, isglobal) {
    let handlers = isglobal ? GLOBALS : LOCALS;
    asarray(type, t => handlers.remove(t, handler));
  }
  /**
   * Dispatch broadcast.
   * TODO: cache broadcasts while booting and redispatch on bootstrap done.
   * @param {string|Array<string>} type
   * @param {*} data
   * @param {boolan} isglobal
   */


  function dispatch$1(type, data, isglobal) {
    asarray(type, t => {
      let b = new Broadcast(t, data, isglobal);
      let handlers = isglobal ? GLOBALS : LOCALS;

      if (handlers.has(t)) {
        handlers.toArray(t).forEach(handler => {
          handler.onbroadcast(b);
        });
      }
    });
  }

  var _class$7;
  /**
   * Tracking and dispatching broadcasts.
   */


  let BroadcastPlugin = (_class$7 = class BroadcastPlugin extends TrackerPlugin {
    /**
     * Add one or more broadcast handlers.
     * @param {string|Array<string>} type
     * @param {BroadcastHandler} [handler]
     * @returns {BroadcastPlugin}
     */
    on(type, handler = this.spirit) {
      asarray(type, t => {
        if (this._addchecks(t, [handler, this._global])) {
          if (this._global) {
            Broadcast.addGlobal(t, handler);
          } else {
            Broadcast.add(t, handler);
          }
        }
      });
    }
    /**
     * Remove one or more broadcast handlers.
     * @param {string|Array<string>} type
     * @param {BroadcastHandler} [handler]
     * @returns {BroadcastPlugin}
     */


    off(type, handler = this.spirit) {
      asarray(type, t => {
        if (this._addchecks(t, [handler, this._global])) {
          if (this._global) {
            Broadcast.addGlobal(t, handler);
          } else {
            Broadcast.add(t, handler);
          }
        }
      });
    }
    /**
     * Dispatch type(s).
     * @param {string|Array<string>} type
     * @param {Object} [data]
     * @returns {BroadcastPlugin}
     */


    dispatch(type, data) {
      let global = this._global;
      this._global = false;
      asarray(type, t => {
        if (global) {
          Broadcast.dispatchGlobal(t, data);
        } else {
          Broadcast.dispatch(t, data);
        }
      });
    }
    /**
     * Add one or more global broadcast handlers.
     * @param {string|Array<string>} type
     * @param {BroadcastHandler} [handler]
     * @returns {BroadcastPlugin}
     */


    onGlobal(type, handler) {
      this._globalize(() => this.on(type, handler));
    }
    /**
     * Rempve one or more broadcast handlers.
     * @param {string|Array<string>} type
     * @param {BroadcastHandler} [handler]
     * @returns {BroadcastPlugin}
     */


    offGlobal(type, handler) {
      this._globalize(() => this.off(type, handler));
    } // TODO: confirm truthy instead!

    /**
     * Shift one or more global broadcast handlers based on truthy first param.
     * @param {string|Array<string>} type
     * @param {BroadcastHandler} [handler]
     * @returns {BroadcastPlugin}
     */


    shiftGlobal(on, type, handler) {
      this._globalize(() => this.shift(on, type, handler));
    }
    /**
     * Dispatch on or more broadcasts globally.
     * @param {string|Array<string>} type
     * @param {Object} [data]
     * @returns {gui.Broadcast}
     */


    dispatchGlobal(type, data) {
      this._globalize(() => this.dispatch(type, data));
    } // Private ...................................................................

    /**
     * Remove broadcast handlers when the plugin destructs.
     * @param {string} type
     * @param {Array<object>} checks
     */


    _cleanupchecks(type, checks) {
      let handler = checks[0];
      let isglobal = checks[1];

      if (isglobal) {
        Broadcast.removeGlobal(type, handler);
      } else {
        Broadcast.remove(type, handler);
      }
    }

  }, (_applyDecoratedDescriptor(_class$7.prototype, "on", [chained], Object.getOwnPropertyDescriptor(_class$7.prototype, "on"), _class$7.prototype), _applyDecoratedDescriptor(_class$7.prototype, "off", [chained], Object.getOwnPropertyDescriptor(_class$7.prototype, "off"), _class$7.prototype), _applyDecoratedDescriptor(_class$7.prototype, "dispatch", [chained], Object.getOwnPropertyDescriptor(_class$7.prototype, "dispatch"), _class$7.prototype), _applyDecoratedDescriptor(_class$7.prototype, "onGlobal", [chained], Object.getOwnPropertyDescriptor(_class$7.prototype, "onGlobal"), _class$7.prototype), _applyDecoratedDescriptor(_class$7.prototype, "offGlobal", [chained], Object.getOwnPropertyDescriptor(_class$7.prototype, "offGlobal"), _class$7.prototype), _applyDecoratedDescriptor(_class$7.prototype, "shiftGlobal", [chained], Object.getOwnPropertyDescriptor(_class$7.prototype, "shiftGlobal"), _class$7.prototype), _applyDecoratedDescriptor(_class$7.prototype, "dispatchGlobal", [chained], Object.getOwnPropertyDescriptor(_class$7.prototype, "dispatchGlobal"), _class$7.prototype)), _class$7);
  /*
   * Creates a basic (UNSAFE) map for escaping 
   * text that goes into HTML attribute context.
   */

  const safemap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  /*
   * (UNSAFE) regular expression to figure out some basic 
   * entities that should be escaped in HTML attributes.
   */

  const unsafexp = /[&<>'"]/g;
  /**
   * Escape potentially unsafe string for use in HTML attribute context.
   * TODO(jmo@): This is UNSAFE! We'll need to look at the attribute name!
   * @see https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.232_-_Attribute_Escape_Before_Inserting_Untrusted_Data_into_HTML_Common_Attributes
   * @param {string} name TODO: This should determine how to escape the value!
   * @param {string} value
   * @returns {string}
   */

  function safeattr(name, value) {
    return String(value).replace(unsafexp, c => safemap[c]);
  }
  /**
   * @param {string} value
   * @param {Array<string>} unsafe
   * @param {Array<sSpirit|Node|NodeList>} nodes
   * @returns {string}
   */


  function fixvalue(value, unsafe, nodes) {
    if (value) {
      if (isnode(value)) {
        const marker = `{node:${nodes.length}}`;
        nodes.push(value);
        return marker;
      } else {
        const marker = `{unsafe:${unsafe.length}}`;
        unsafe.push(value);
        return marker;
      }
    }

    return '';
  }
  /**
   * Note that this simply returns the unsafe value.
   * It only becomes safe with further manhandling!
   * @param {string} data
   * @param {Array<string>} unsafe
   * @returns {string}
   */


  function fixtext(data, unsafe) {
    return fix(data, unsafe);
  }
  /**
   * @param {string} name
   * @param {string} value
   * @param {Array<string>} unsafe
   * @returns {string}
   */


  function fixattr(name, value, unsafe) {
    return safeattr(name, fix(value, unsafe));
  } // Scoped ......................................................................

  /**
   * TODO: Test for non-primitive might be faster.
   * @param {*} value
   * @returns {boolean}
   */


  function isnode(value) {
    return !!value.nodeType || value.isModel || value.isSpirit;
  }
  /**
   * @param {string} data
   * @param {Array<string>} unsafe
   * @param {Function} pipe
   * @returns {string}
   */


  function fix(data, unsafe) {
    return data.split(/{unsafe:(\d+)}/).map((string, index) => {
      return index % 2 === 0 ? string : unsafe[parseInt(string, 10)];
    }).join('');
  }
  /**
   * @param {Object} state
   * @returns {Function}
   */


  function runnable({
    markup
  }) {
    const elm = template(markup);
    const map = index(elm.content);
    return function run({
      unsafe,
      others
    }) {
      resolve$2(map, unsafe); // return elm.cloneNode(true); nope, this nukes the `content` prop in Edge :/

      return template(elm.innerHTML); // instead, we will clone the template manually
    };
  } // Scoped ......................................................................

  /**
   * Initially creates the `template` element with unresolved content.
   * TODO: Now also used to "clone" the template with resolved content because Edge
   * @param {string} markup
   * @returns {HTMLTemplateElement}
   */


  function template(markup) {
    const elm = document.createElement('template');
    elm.innerHTML = markup;
    return elm;
  }
  /**
   * Mapping text and attribute nodes with dynamic value.
   * @param {Node} node
   * @param {Map} [map]
   * @returns {Map}
   */


  function index(node, map = new Map()) {
    if (node) {
      index(node.firstChild, map);
      index(node.nextSibling, map);

      switch (node.nodeType) {
        case Node.TEXT_NODE:
          if (node.data.trim() !== '') {
            if (node.data.includes('{unsafe:')) {
              map.set(node, node.data);
            }
            /*
            if (others && node.data.includes('{node:')) {
            	const frag = build(node, others);
            	const elem = node.parentNode;
            	elem.replaceChild(frag, node);
            }
            */

          }

          break;

        case Node.ELEMENT_NODE:
          Array.from(node.attributes).filter(att => att.value.includes('{unsafe:')).forEach(att => map.set(att, att.value));
          break;
      }
    }

    return map;
  }
  /**
   * @param {Map<Node, string>} map
   * @param {Array} unsafe
   */


  function resolve$2(map, unsafe) {
    map.forEach((data, node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.data = fixtext(data, unsafe);
      } else {
        node.value = fixattr(node.name, data, unsafe);
      }
    });
  }
  /**
   * Get one or more attribute declarations.
   * @param {Function} target
   * @param {string} name
   * @param {*} value
   * @param {string} [type]
   * @returns {string}
   */


  function htmlattribute(target, name, value, type = gettype(value)) {
    switch (type) {
      case 'null':
      case 'undefined':
        return '';

      case 'object':
        return getall(target, Object.entries(value));

      case 'array':
        return getall(value);
      // TODO: confirm [name, value] here!

      default:
        return getone(target, name, value, type);
    }
  } // Scoped ......................................................................

  /**
   * Declare single HTML attribute.
   * @param {Function} target
   * @param {string} name
   * @param {*} val
   * @param {string} [type]
   * @returns {string}
   */


  function getone(target, name, val, type) {
    const unsafe = encode(val, type || gettype(val));
    return name + `="${target.guargh(unsafe)}"`;
  }
  /**
   * Bulk declare HTML attributes.
   * @param {Function} target
   * @param {Array<Array<string, Any>>} entries
   * @returns {string}
   */


  function getall(target, entries) {
    return entries.map(entry => getone(target, ...entry)).join(' ').trim();
  }
  /**
   * Get string type of something (somewhat better than typeof).
   * That regexp matches 'Array' in '[object Array]' and so on.
   * @param {Object} val
   * @returns {string}
   */


  function gettype(val) {
    const stringify = Object.prototype.toString;
    const typematch = /\s([a-zA-Z]+)/;
    return stringify.call(val).match(typematch)[1].toLowerCase();
  }
  /**
   * Stringify stuff to be used as HTML attribute values.
   * TODO: in 'string' case, support simple/handcoded JSON object/array.
   * @param {*} val
   * @param {string} type
   * @returns {string}
   */


  function encode(val, type) {
    switch (type) {
      case 'string':
        return val;

      case 'number':
      case 'boolean':
        return String(val);
        break;

      case 'date':
        throw new Error('TODO: Encode standard date format?');

      default:
        throw new Error('Could not create HTML attribute from: ' + type);
    }
  }
  /**
   * Normalize template. This basically means that we replace the `guid`
   * attribute with the (hardcoded for now) `data-plastique-id` attribute.
   * @param {HTMLTemplateElement} temp
   * @param {string} guid
   * @returns {HTMLTemplateElement}
   */


  function normalize$1(temp, guid) {
    const frag = temp.content;
    expand(first(frag), guid);
    return temp;
  }
  /**
   * Canonize template to always contain a root level `this` element.
   * @param {HTMLTemplateElement} temp
   * @param {string} guid
   * @returns {HTMLTemplateElement}
   */


  function canonize(temp, guid) {
    temp = normalize$1(temp, guid);
    rootguid(temp.content, guid);
    return temp;
  } // Scoped ......................................................................


  const first = node => node.firstElementChild,
        next = node => node.nextElementSibling,
        iselm$1 = node => node && node.nodeType === Node.ELEMENT_NODE,
        isroot = elm => iselm$1(elm) && elm.localName === 'this',
        newelm = name => document.createElement(name),
        append = (n1, n2) => n1.appendChild(n2),
        hasguid = elm => elm.hasAttribute('guid'),
        getguid$1 = elm => elm.getAttribute('guid'),
        delguid = elm => elm.removeAttribute('guid');
  /**
   * Replace all `guid` with `data-plastique-id`.
   * TODO: We do that in the EDBML `Parser.js` now, so skip this for performance?
   * @param {Element|null} elm
   * @param {string} guid The root guid
   */


  function expand(elm, guid) {
    if (elm) {
      expand(first(elm), guid);
      expand(next(elm), guid);

      if (hasguid(elm)) {
        setguid(elm, guid, getguid$1(elm));
        delguid(elm);
      }
    }
  }
  /**
   * If the root element `this` doesn't exist, we'll go ahead and create it.
   * Assigning the root `guid` to the `this` element so that all attribute
   * and callback updates can be handled by the standard business logic
   * (the `this` element represents the spirits element, just to clarify).
   * @param {DocumentFragment} frag
   * @param {string} guid The root guid
   * @returns {DocumentFragment}
   */


  function rootguid(frag, guid) {
    const root = first(frag);

    if (isroot(root)) {
      delguid(root);
      setguid(root, guid);
      return frag;
    } else {
      return rootguid(createroot(frag), guid);
    }
  }
  /**
   * Enclose fragment members in a root level element.
   * @param {DocumentFragment} frag
   * @returns {DocumentFragment}
   */


  function createroot(frag) {
    let node;
    const root = newelm('this');

    while (node = frag.firstChild) {
      append(root, node);
    }

    append(frag, root);
    return frag;
  }
  /**
   * The `data-plastique-id` is a combo of the root guid and, if
   * the element is not the root element, the element guid itself.
   * @param {Element} elm
   * @param {string} rootguid The root (Spirit) guid
   * @param {string} elemguid The local element guid
   */


  function setguid(elm, rootguid, elemguid) {
    elm.dataset.plastiqueId = rootguid + (elemguid ? `-${elemguid}` : '');
  }
  /*
   * The EDBML compiler has converted all the "namespace prefixed" attributes 
   * to these other attributes so we don't have to deal with the lack of HTML 
   * case sensitivity (and can skip proper namespace declarations in XHTML).
   */


  const EVENTS = 'data-plastique-on',
        ELEMENTS = // matches `on:type`
  'data-plastique-elm',
        SPIRITS = // matches `do:elm`
  'data-plastique-gui' // matches `do:gui`
  ;
  /**
   * Map deferred calls into separate domains based on element attributes.
   * TODO: Return more `null` instead of these empty Maps when not needed!
   * @param {Map<string, Element>} guids - Elements with a specified `guid`
   * @param {Map<string, Function>} defers - All the deferred functions we know
   * @returns {Array<Map>} - mapping events, elements and spirits in that order
   */

  function mapdefer(guids, defers) {
    guids = translate(guids);
    return [isolateevents(isolate(EVENTS, guids), defers), isolate(ELEMENTS, guids, defers), isolate(SPIRITS, guids, defers)];
  } // Scoped ......................................................................

  /**
   * Quickly identifies reserved HTML attributes.
   * @type {Set<string>}
   */


  const reserved$1 = new Set([EVENTS, ELEMENTS, SPIRITS]);
  /**
   * Remove from element all reserved attributes and transfer them to a Map.
   * @param {Map<string, Element>} guids
   * @returns {Map<string, Map<string, string>>}
   */

  function translate(guids) {
    const result = new Map();
    guids.forEach((elm, guid) => extractall(elm, guid, result));
    return result;
  }
  /**
   * Transfer reserved attribute of given type to unique Map.
   * @param {string} type - Reserved attribute name
   * @param {Map<string, Map<string, string>>} guids
   * @param {Map<string, Function>} [defers]
   * @returns {Map<string, Function|string>}
   */


  function isolate(type, guids, defers) {
    const result = new Map();
    guids.forEach((map, guid) => {
      if (map.has(type)) {
        const key = map.get(type);
        const val = defers ? defers.get(key) : key;
        result.set(guid, val);
      }
    });
    return result;
  }
  /**
   * @param {Element} elm
   * @param {string} guid
   * @param {Map<string, Map>} result
   */


  function extractall(elm, guid, result) {
    const atts = elm.attributes;

    for (let i = atts.length - 1; i >= 0; i--) {
      extractone(elm, guid, result, atts.item(i));
    }
  }
  /**
   * @param {Element} elm
   * @param {string} guid
   * @param {Map<string, Map>} result
   * @param {Attr} att
   */


  function extractone(elm, guid, result, {
    name,
    value
  }) {
    if (reserved$1.has(name)) {
      recordone(guid, result, name, value);
      elm.removeAttribute(name);
    }
  }
  /**
   * @param {string} guid
   * @param {Map<string, Map>} result
   * @param {string} name
   * @param {string} value
   */


  function recordone(guid, result, name, value) {
    getrecord(guid, result).set(name, value);
  }
  /**
   * @param {string} guid
   * @param {Map<string, Map>} result
   * @returns {Map}
   */


  function getrecord(guid, result) {
    return result.get(guid) || result.set(guid, new Map()).get(guid);
  } // Event callbacks .............................................................

  /**
   * From the map of elements with deferred callbacks, find the
   * ones that deal with events and transfer them to a new map.
   * Note that the `data-plastique-on` attribute may index more
   * than one event, so we will need to parse them individually.
   * @param {Map<string, string>} guids
   * @param {Map<string, Function>} defers
   * @returns {Map<string, Map<string, Function>>}
   */


  function isolateevents(guids, defers) {
    if (guids.size) {
      const lookup = ([type, key]) => [type, change(key)];

      const change = key => changefun(defers.get(key));

      guids.forEach((key, guid) => {
        guids.set(guid, new Map(splitup(key, defers, lookup)));
      });
    }

    return guids;
  }
  /**
   * The attribute is indexing multiple events separated by `;`.
   * @param {string} string
   * @param {Map<string, Function>} defers
   * @param {Function} lookup
   * @returns {Array<Array<string, Function>>}
   */


  function splitup(string, defers, lookup) {
    return string.split(';').map(sliceup).map(lookup);
  }
  /**
   * The event listeners type and key are separated by `:`.
   * @param {string} part
   * @returns {Array<string, string>}
   */


  function sliceup(part) {
    const i = part.lastIndexOf(':');
    return [part.substring(0, i), part.substring(i + 1)];
  }
  /**
   * Create callback function with special business logic for form elements.
   * Note that this special business logic is dependant on some supporting
   * code going on inside the project `dataplastique-edbml` (so at build time).
   * TODO: The `Parser.js` should figure out if this is a form field
   * TODO: always relay the (potential) CustomEvent data
   * TODO: Further special business logic for select elements
   * @param {Function} fun
   * @returns {Function}
   */


  function changefun(fun) {
    return function (e) {
      if (/input|textarea/.test(this.localName)) {
        fun(e, this.value, this.checked);
      } else {
        fun(e);
      }
    };
  }
  /**
   * Tracking properties to generate HTML attributes.
   * @type {Map<string, *>}
   */


  const props = new Map();
  /**
   * Keeping dependency injections private.
   * @type {Symbol}
   */

  const state = Symbol('state');
  /**
   *
   */

  class Out {
    /**
     * Tracking things that might be injected via constructor or methods calls.
     * @type {Object}
     */

    /**
     * @param {string} [markup]
     * @param {Array} [unsafe]
     * @param {Array} [others]
     * @param {Map<string, Function>} [defers]
     */
    constructor(markup = '', unsafe = [], others = [], defers = []) {
      this[state] = null;
      this._run = null;
      this[state] = {
        markup,
        unsafe,
        others,
        defers
      };
      props.clear();
    }
    /**
     * @param {string} guid
     * @returns {string}
     */


    toString(guid) {
      return resolve$3(this, guid).innerHTML;
    }
    /**
     * TODO: Apply event listeners and such!
     * @param {string} guid
     * @returns {DocumentFragment}
     */


    toFragment(guid) {
      return resolve$3(this, guid).content;
    }
    /**
     * Returns a list of aspects that can used to compare two instances of {Out}
     * in order to support incremental DOM updates (the "virtual DOM" use case).
     * @param {string} guid
     * @returns {Array}
     */


    toAspects(guid) {
      const cloned = resolve$3(this, guid, true);
      const defers = this[state].defers;
      return aspects(cloned, guid, defers);
    }
    /**
     * @returns {Map<string, Function>}
     */


    deferred() {
      return this[state].defers;
    }
    /**
     * @deprecated
     * That {Out} is structurally identical (given unresolved values)?
     * In that case, it it safe to call method `update` with that {Out}.
     * TODO: Whenever this returns `true`, we can attempt to candidate
     * the local `_ownmap` as reusable by all other instances of {Out}.
     * This might however require an extra argument? Remember to mark
     * this as a failure in case the template changes DOM structure.
     * @param {Out} out
     * @returns {boolean}
     */


    similar(out) {
      return out[state].markup === this[state].markup;
    }
    /**
     * @deprecated
     * That {Out} would produce that exact same output as this {Out}?
     * This implies that both structure and state are identical
     * except for all the deferred callbacks which are always unique.
     * @param {Out} out
     * @returns {boolean}
     */


    identical(out) {
      const mine = this[state];
      const other = out[state];
      return this.similar(out) && equals(mine.unsafe, other.unsafe) && equals(mine.others, other.others);
    }
    /**
     * Assimilate state from another {Out}, making them identical.
     * @param {Out} out
     * @returns {this}
     */


    update(out) {
      if (this.similar(out)) {
        Object.assign(this[state], out[state]);
      } else {
        throw new Error('Output must be structurally similar.');
      }

      return this;
    } // Private ...................................................................

    /**
     * Temporarily store the template resolver here to avoid creating new ones.
     * TODO: Global pool of runnables that can be shared between instances of `Out`.
     * @type {Function}
     */
    // Proxy traps ...............................................................

    /**
     * The getter trap will expose all assigned properties in the form of
     * HTML attribute declarations. For example, when you set the property
     * `proxy.title = 'john' you will see the string `title="john"` whenever
     * you attempt to `alert(proxy.title)`. This allows for a syntax that will
     * make it easy to maintain the generated script by hand in case the devs
     * decide to abandon EDBML at some point, note however that this implies
     * that it's not safe in EDBML to concatenate properties via the syntax
     * `@class += ' newclass' (since this operation will read the property).
     * @param {Function} out
     * @param {String} name
     * @returns {string}
     */


    static get(out, name) {
      switch (name) {
        case 'guargh':
        case 'blargh':
        case 'arrghs':
          return out[name];
          break;

        default:
          return out.blargh(htmlattribute(out, name, props.get(name)));
          break;
      }
    }
    /**
     * Setter trap.
     * @param {Function} out
     * @param {String} name
     * @param {*} value
     * @returns {boolean}
     */


    static set(out, name, value) {
      props.set(name, value);
      return true;
    }
    /**
     * Apply trap.
     * @param {Function} out
     * @param {Object} that
     * @param {Array<*>} args
     * @returns {*}
     */


    static apply(out, that, args) {
      return out.apply(that, args);
    }

  } // Scoped ......................................................................

  /**
   * Creates a normalized and potentially canonical template with resolved values.
   * @param {Out} out
   * @param {String} guid
   * @param {boolean} [canon]
   * @returns {HTMLTemplateElement}
   */


  function resolve$3(out, guid, canon = false) {
    const clone = collapse(out, out[state]);
    return canon ? canonize(clone, guid) : normalize$1(clone, guid);
  }
  /**
   * Clone template and resolve with current state.
   * @param {Out} out
   * @param {Object} state
   * @returns {HTMLTemplateElement}
   */


  function collapse(out, state) {
    return (out._run || (out._run = runnable(state)))(state);
  }
  /**
   * TODO: We'll need less aspects (and only keys in some maps) when diffing old!
   * @param {HTMLTemplateElement} canonical
   * @param {string} guid
   * @param {Map<string, function>} defers
   * @returns {Array}
   */


  function aspects(canonical, guid, defers) {
    const fragment = canonical.content;
    const rootelem = fragment.firstElementChild;
    const elements = mapguids(rootelem, guid);
    const deferred = mapdefer(elements, defers);
    return [fragment, elements, ...deferred];
  } // TODO: Deprecate this? .......................................................

  /**
   * Array members are identical?
   * @param {Array} a1
   * @param {Array} a2
   * @returns {boolean}
   */


  function equals(a1, a2) {
    const same = (value, idx) => a2[idx] === value;

    return a1.length === a2.length && a1.every(same);
  }
  /**
   * Mapping (root) element to Handler.
   * @type {WeakMap<Element, EventListener>}
   */


  const handlers$1 = new WeakMap();
  /**
   * For elements that were removed in the DOM update, remove all assigned
   * listeners. For elements that remain, we only remove the listeners that
   * will not eventually be reassigned by method `newcalls` below.
   * TODO: Mechanism to flush the WeakMap when the `root` gets disconnected
   * @param {Element} root - The root element
   * @param {string} guid - The root guid (which may not be a real attribute)
   * @param {Map<string, Element>} ofun - Callbacks found in old VDOM
   * @param {Map<string, Element>} nfun - Callbacks found in new VDOM
   * @param {Map<string, Element>} oids - Guid elements in old VDOM
   * @param {Map<string, Element>} nids - Guid elements in new VDOM
   * @param {Map<string, Element>} nmap - Guid elements in new real DOM
   * @param {Map<string, Element>} omap - Guid elements in old real DOM
   */

  function updateevents(root, guid, ofun, nfun, oids, nids, nmap, omap) {
    let handler = handlers$1.get(root);

    if (handler) {
      removeevents(ofun, nfun, oids, nids, nmap, omap, handler);
      handler.map = nfun;
    } else {
      handler = new Handler(nfun, guid);
      handlers$1.set(root, handler);
    }

    addevents(nfun, nmap, handler);
  } // Scoped ......................................................................

  /**
   * A handler to handle events.
   * @implements {EventListener}
   */


  class Handler {
    constructor(map, guid) {
      this.map = null;
      this.map = map;
      this.guid = guid;
    }

    handleEvent(e) {
      const elem = e.currentTarget;
      const guid = elem.dataset.plastiqueId;
      const type = this.map.get(guid || this.guid);
      const func = type.get(e.type);

      if (func) {
        func.call(elem, e);
      }
    }

  }
  /**
   * For elements that were removed in the DOM update, remove all assigned
   * listeners. For elements that remain, we only remove the listeners that
   * will not eventually be reassigned by method `addevents` down below.
   * @param {Map<string, Element>} ofun - Callbacks found in old VDOM
   * @param {Map<string, Element>} nfun - Callbacks found in new VDOM
   * @param {Map<string, Element>} oids - Guid elements in old VDOM
   * @param {Map<string, Element>} nids - Guid elements in new VDOM
   * @param {Map<string, Element>} nmap - Guid elements in new real DOM
   * @param {Map<string, Element>} omap - Guid elements in old real DOM
   * @param {Handler} handler
   */


  function removeevents(ofun, nfun, oids, nids, nmap, omap, handler) {
    omap.forEach((elm, guid) => {
      if (ofun.has(guid)) {
        const oats = ofun.get(guid);
        const nats = nfun.get(guid);
        const gone = !nmap.has(guid);
        oats.forEach((value, type) => {
          if (gone || !nats || !nats.has(type)) {
            elm.removeEventListener(type, handler);
          }
        });
      }
    });
  }
  /**
   * When DOM updates are done, refresh and assign all the event listeners.
   * @param {Map<string, Element>} nfun - Callbacks found in new VDOM
   * @param {Map<string, Element>} nmap - Guid elements in new real DOM
   * @param {Handler} handler
   */


  function addevents(nfun, nmap, handler) {
    nmap.forEach((elm, guid) => {
      if (nfun.has(guid)) {
        nfun.get(guid).forEach((func, type) => {
          elm.addEventListener(type, handler);
        });
      }
    });
  }
  /**
   * Get the focused element, either by element reference or by selector
   * scoped from the root element. Since the first option is less error
   * prone, it is advised to always fit focusable elements with a `guid`.
   * @param {Element|ShadowRoot} root
   * @returns {Element|string}
   */


  function snapshotbefore(root) {
    const elm = root.activeElement || document.activeElement;

    if (elm && root.contains(elm)) {
      return elm.dataset.plastiqueId ? elm : selector(root, elm);
    }
  }
  /**
   * Restore the focus while noting that the patch operation might have changed
   * the DOM in such a way that a CSS selector will now target the wrong element.
   * We supress potential `onfocus` event listeners since they were most likely
   * intended for user instigated focus. TODO: Restore selection range!!!
   * @param {Element|ShadowRoot} root
   * @param {Element|string} elm
   */


  function restoreafter(root, elm) {
    const now = root.activeElement || document.activeElement;

    if (elm && (elm = elm.nodeType ? elm : root.querySelector(elm))) {
      if (root.contains(elm) && elm !== now) {
        elm.focus();
      }
    }
  } // Scoped ......................................................................

  /**
   * Compute selector for focused element.
   * @param {Element|ShadowRoot} root
   * @param {Element} elm
   * @returns {string}
   */


  function selector(root, elm) {
    const parts = [];
    const _ref = [Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE],
          ELEM = _ref[0],
          FRAG = _ref[1];

    while (elm && (elm.nodeType === ELEM || elm.nodeType === FRAG)) {
      if (elm.id) {
        parts.push('#' + elm.id);
        elm = null;
      } else {
        if (elm === root) {
          parts.push(':scope ');
          elm = null;
        } else {
          parts.push(` > ${elm.localName}:nth-child(${ordinal(elm)})`);
          elm = elm.parentNode;
        }
      }
    }

    return parts.reverse().join('');
  }
  /**
   * Get ordinal position of element within container. The index is
   * one-based (and not zero-based) to conform with CSS conventions.
   * Note: Bugs fixed here should be synchronized with {DOMPlugin}.
   * @param {Element} elm
   * @returns {number}
   */


  function ordinal(elm) {
    let result = 1;
    let parent = elm.parentNode;

    if (parent) {
      let node = parent.firstElementChild;

      while (node && node !== elm) {
        node = node.nextElementSibling;
        result++;
      }
    }

    return result;
  }
  /**
   * Remove element childnodes.
   * @param {Range} range
   * @param {Element} elm
   */


  function removekids(range, elm) {
    range.selectNodeContents(elm);
    range.deleteContents();
  }
  /**
   * Swap node with other node.
   * @param {Node} oldn The node to replace.
   * @param {Node} newn The node to insert.
   * @returns {Node} Returns the new node.
   */


  function replacenode(oldn, newn) {
    const parent = oldn.parentNode;
    parent.replaceChild(newn, oldn);
    return newn;
  }
  /**
   * Replace element childnodes with other childnodes.
   * @param {Range} range
   * @param {Element} elm
   * @param {Element} other
   */


  function replacekids(range, elm, other) {
    removekids(range, elm);
    range.selectNodeContents(other);
    elm.appendChild(range.extractContents());
  }

  const istype = (node, type) => node && node.nodeType === type;

  const istext = node => istype(node, Node.TEXT_NODE);

  const iswhite = node => istext(node) && node.data.trim() === '';

  const unwhite = node => !iswhite(node);
  /**
   * Get first child node which is not a whitespace-only textnode.
   * (so to avoid triggering updates on simple formatting changes).
   * @param {Node} node
   * @returns {Node}
   */


  const childnode = node => node ? purge(node.firstChild) : null;
  /**
   * Get follwong sibling node which is not a whitespace-only textnode.
   * @param {Node} node
   * @returns {Node}
   */


  const nextnode = node => node ? purge(node.nextSibling) : null;
  /**
   * Get first element child, ignoring this whole whitespace issue.
   * @param {Element|DocumentFragment} node
   * @returns {Element}
   */


  const childelm = node => node ? firstElementChild(node) : null;
  /**
   * Get array of childnodes exluding whitespace-only textnodes.
   * @param {Element|DocumentFragment} node
   * @returns {Array<Node>}
   */


  const children = node => [...node.childNodes].filter(unwhite); // Scoped ......................................................................

  /**
   * Crawl the DOM until you find something other than a whitespace textnode.
   * @param {Node} n
   * @returns {Node}
   */


  function purge(n) {
    return n && iswhite(n) ? purge(n.nextSibling) : iswhite(n) ? null : n;
  }
  /**
   * It appears that method `firstElementChild` hasn't worked out so well in Edge.
   * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11342645/
   * @param {Node} node - at least not when this node here is a documentFragment.
   * @returns {Element}
   */


  function firstElementChild(node) {
    const elm = node => node.nodeType === Node.ELEMENT_NODE;

    return Array.from(node.childNodes).find(elm) || null;
  }

  const iselm$2 = node => node && node.nodeType === Node.ELEMENT_NODE,
        istext$1 = node => node && node.nodeType === Node.TEXT_NODE,
        clean = string => string ? Key.removeKeys(string, 'cb') : null,
        getatts = elm => iselm$2(elm) ? Array.from(elm.attributes) : [],
        getguid$2 = node => iselm$2(node) ? node.getAttribute('data-plastique-id') : null,
        matchatt = (elm, att) => clean(elm.getAttribute(att.name)) === clean(att.value),
        compatts = (elm1, elm2) => getatts(elm1).every(att => matchatt(elm2, att)),
        sametype = (node1, node2) => node1.nodeType === node2.nodeType,
        samename = (elm1, elm2) => elm1.localName === elm2.localName,
        sametext = (txt1, txt2) => txt1.data === txt2.data;
  /**
   * @param {Node} oldn
   * @param {Node} newn
   * @returns {boolean}
   */


  function similar(oldn, newn) {
    if (oldn && newn && samenode(oldn, newn)) {
      return istext$1(oldn) || samesize(oldn, newn) && samekids(oldn, newn);
    }

    return false;
  }
  /**
   * TODO: Purge this!
   * @param {Element} elm1
   * @param {Element} elm2
   * @returns {boolean}
   */


  function samesize(elm1, elm2) {
    return elm1.childNodes.length === elm2.childNodes.length;
  }
  /**
   * TODO: Rename this!
   * @param {Node} n1
   * @param {Node} n2
   * @returns {boolean}
   */


  function samenode(n1, n2) {
    if (sametype(n1, n2)) {
      if (iselm$2(n1)) {
        return samename(n1, n2) && getguid$2(n1) ? sameguid(n1, n2) : sameatts(n1, n2);
      } else {
        return sametext(n1, n2);
      }
    }

    return false;
  }
  /**
   * Direct children of two nodes appear to be similar?
   * @param {Element|DocumentFragment} node1
   * @param {Element|DocumentFragment} node2
   * @returns {boolean}
   */


  function samekids(node1, node2) {
    const kids1 = children(node1);
    const kids2 = children(node2);
    return kids1.every((kid1, i) => samenode(kid1, kids2[i]));
  }
  /**
   * Same guid?
   * @param {Element} elm1
   * @param {Element} elm2
   * @returns {boolean}
   */


  function sameguid(elm1, elm2) {
    return getguid$2(elm1) === getguid$2(elm2);
  }
  /**
   * Same attributes?
   * @param {Element} elm1
   * @param {Element} elm2
   * @returns {boolean}
   */


  function sameatts(elm1, elm2) {
    return compatts(elm1, elm2) && compatts(elm2, elm1);
  }
  /**
   * @param {Element} root - The root element
   * @param {string} guid - The root `$id`
   * @param {Out} newout
   * @param {Out|null} oldout
   * @returns {Array<function>}
   */


  function getdiffs(root, guid, newout, oldout) {
    const _newout$toAspects = newout.toAspects(guid),
          _newout$toAspects2 = _slicedToArray(_newout$toAspects, 5),
          ndoc = _newout$toAspects2[0],
          nids = _newout$toAspects2[1],
          nfun = _newout$toAspects2[2],
          doelm = _newout$toAspects2[3],
          dogui = _newout$toAspects2[4];

    const _oldout$toAspects = oldout.toAspects(guid),
          _oldout$toAspects2 = _slicedToArray(_oldout$toAspects, 3),
          odoc = _oldout$toAspects2[0],
          oids = _oldout$toAspects2[1],
          ofun = _oldout$toAspects2[2];

    return [...treestructurediffs(root, guid, odoc, ndoc, oids, nids), ...miscellaneousdiffs(root, guid, oids, nids, ofun, nfun, doelm, dogui)];
  }
  /**
   * @param {Element} root - The root element
   * @param {string} guid - The root guid
   * @param {Array<function>} diffs
   * @returns {Object} - TODO: More info!
   */


  function patchdiffs(root, guid, diffs) {
    const log = Object.create(null);

    if (diffs.length) {
      const range = document.createRange();
      const focus = snapshotbefore(root);
      const guids = mapguids(root, guid);
      diffs.forEach(diff => diff(range, guids));
      restoreafter(root, focus);
      range.detach();
    }

    return log;
  } // Scoped ......................................................................


  const asarray$1 = alike => Array.from(alike),
        istype$1 = (node, type) => node && node.nodeType === type,
        getatt = (elm, name) => elm ? elm.getAttribute(name) : null,
        setatt = (elm, name, val) => elm.setAttribute(name, val),
        delatt = (elm, name) => elm.removeAttribute(name),
        getatts$1 = elm => iselm$3(elm) ? asarray$1(elm.attributes) : [],
        hasatts = elm => elm ? !!elm.attributes.length : false,
        mapatts = elm => new Map(getatts$1(elm).map(att => [att.name, att.value])),
        getguid$3 = node => iselm$3(node) ? getatt(node, 'data-plastique-id') : null,
        subguids = elm => Array.from(elm.children).map(getguid$3),
        hasclass = elm => elm ? !!elm.className : false,
        classes = elm => elm ? elm.classList : null,
        iselm$3 = node => istype$1(node, Node.ELEMENT_NODE),
        unique = (list1, list2) => list1.filter(entry => !list2.includes(entry)); // Diffing elements and attributes .............................................

  /**
   * @param {Element} root - The root element
   * @param {string} guid - The root guid
   * @param {DocumentFragment} odoc - The old VDOM
   * @param {DocumentFragment} ndoc - The new VDOM
   * @param {Map<string, Element>} oids - Guid elements in old VDOM
   * @param {Map<string, Element>} nids - Guid elements in new VDOM
   * @returns {Array<Function>}
   */


  function treestructurediffs(root, guid, odoc, ndoc, oids, nids) {
    const nestedguids = oids.size > 1;

    if (nestedguids && odoc.hasChildNodes()) {
      if (samesize(odoc, ndoc) && samekids(odoc, ndoc)) {
        const list = index$1([], [], childelm(odoc), childelm(ndoc), guid);
        return compileupdates(oids, nids, ...list);
      } else {
        return [range => patchstart(range, root, ndoc, oids, nids)];
      }
    } else {
      return [range => {
        const olde = oids.get(guid);
        const newe = nids.get(guid);
        replacekids(range, root, newe);
        syncattribs(root, olde, newe);
      }];
    }
  }
  /**
   * @param {Array<string>} hard
   * @param {Array<string>} soft
   * @param {Node} oldn
   * @param {Node} newn
   * @param {string} [guid]
   * @returns {Array<Array>}
   */


  function index$1(hard, soft, oldn, newn, guid) {
    const child = childnode,
          next = nextnode;

    if (oldn || newn) {
      if (similar(oldn, newn)) {
        if (sameguid(oldn, newn) && !sameatts(oldn, newn)) {
          soft.push(getguid$3(oldn));
        }

        index$1(hard, soft, child(oldn), child(newn), getguid$3(oldn) || guid);
        index$1(hard, soft, next(oldn), next(newn), guid);
      } else {
        hard.push(guid);
      }
    }

    return [hard, soft];
  }
  /**
   * @param {Map<string, Element>} oids
   * @param {Map<string, Element>} nids
   * @param {Array<string>} hard
   * @param {Array<string>} soft
   * @returns {Array<Function>}
   */


  function compileupdates(oids, nids, hard, soft) {
    const isunique = guid => !hard.includes(guid); // TODO: is this needed?


    return [...hardupdates(oids, nids, hard), ...softupdates(oids, nids, soft.filter(isunique))];
  }
  /**
   * @param {Map<string, Element>} oids
   * @param {Map<string, Element>} nids
   * @param {Array<string>} hard
   * @returns {Array<Function>}
   */


  function hardupdates(oids, nids, hard) {
    const update = (range, xids, guid) => {
      const xelm = xids.get(guid);
      const olde = oids.get(guid);
      const newe = nids.get(guid);

      if (xelm) {
        patchstart(range, xelm, newe, oids, nids);
        syncattribs(xelm, olde, newe);
      }
    };

    return hard.map(guid => (range, xids) => update(range, xids, guid));
  }
  /**
   * @param {Map<string, Element>} oids
   * @param {Map<string, Element>} nids
   * @param {Array<string>} soft
   * @returns {Array<Function>}
   */


  function softupdates(oids, nids, soft) {
    const update = (xids, guid) => {
      const xelm = xids.get(guid);
      const olde = oids.get(guid);
      const newe = nids.get(guid);

      if (xelm) {
        syncattribs(xelm, olde, newe);
      }
    };

    return soft.map(guid => (range, xids) => update(xids, guid));
  } // Diffing more stuff! .........................................................


  function miscellaneousdiffs(root, guid, oids, nids, ofun, nfun, doelm, dogui) {
    return [(range, oldmap) => {
      const newmap = mapguids(root, guid);
      [...getcallbackdiffs(root, guid, ofun, nfun, oids, nids), ...getsetandcall(root, guid, doelm, dogui)].forEach(diff => diff(newmap, oldmap));
    }];
  } // Diffing callbacks ...........................................................

  /**
   * Remove old event callbaks and assign new callbacks.
   * @param {Element} root - The root element
   * @param {string} guid - The root guid
   * @param {Map<string, string>} ofun - Callbacks found in old VDOM
   * @param {Map<string, string>} nfun - Callbacks found in new VDOM
   * @param {Map<string, Element>} oids - Guid elements in old VDOM
   * @param {Map<string, Element>} nids - Guid elements in new VDOM
   * @returns {Array<function>}
   */


  function getcallbackdiffs(root, guid, ofun, nfun, oids, nids) {
    return [(newmap, oldmap) => {
      updateevents(root, guid, ofun, nfun, oids, nids, newmap, oldmap);
    }];
  }
  /**
   * @param {Element} root - The root element
   * @param {string} guid - The root guid
   * @param {Map<string, Map<string, Function>>} doelm
   * @param {Map<string, Map<string, Function>>} dogui
   * @param {Map<string, Element>} nids - Guid elements in new VDOM
   * @returns {Array<Function>}
   */


  function getsetandcall(root, guid, doelm, dogui) {
    const proplist = [...doelm.entries()];
    const calllist = [...dogui.entries()];

    const update = (newmap, [guid, action], iselm) => {
      const xelm = newmap.get(guid);
      iselm ? action(xelm) : console.warn('TODO: do:gui');
    };

    return [...proplist.map(up => newmap => update(newmap, up, true)), ...calllist.map(up => newmap => update(newmap, up, false))];
  } // Patching elements ...........................................................

  /**
   * TODO: Consider using a temporary document fragment for this operation.
   * @param {Range} range
   * @param {Element} elm
   * @param {Element|DocumentFragment} newn
   * @param {Map<string, Element>} oids Guid elements in the old VDOM
   * @param {Map<string, Element>} nids Guid elements in the new VDOM
   */


  function patchstart(range, elm, newn, oids, nids) {
    const originals = mapguids(elm);
    gentlyreplacekids(range, elm, newn, oids, nids, originals);
    restoreoriginals(range, elm, oids, nids, originals);
  }

  function gentlyreplacekids(range, elm, newn, oids, nids, xids) {
    if (gentlecandidates(elm, newn)) {
      console.log('gentlecandidates!', subguids(elm), subguids(newn));

      const _gentleoperations = gentleoperations(elm, newn),
            _gentleoperations2 = _slicedToArray(_gentleoperations, 2),
            outset = _gentleoperations2[0],
            addmap = _gentleoperations2[1];

      console.log('    outset', outset);
      console.log('    addmap', addmap);
      replacekids(range, elm, newn);
      /*
      console.log('oldguids', String(subguids(elm)));
      console.log('newguids', String(subguids(newn)));
      	const [outset, addmap] = gentleoperations(elm, newn);
      outset.forEach(guid => {
      	xids.get(guid).remove();
      	console.log('removed', guid);
      });
      	addmap.forEach((newguid, oldguid) => {
      	const xelm = xids.get(oldguid);
      	const newe = nids.get(newguid);
      	xelm.parentNode.insertBefore(newe, xelm.nextSibling);
      	console.log('inserted', newguid, 'after', oldguid);
      	//swapchangeling(range, newe, xelm, oids, nids);
      	// restoreoriginals(range, elm, oids, nids, originals) {
      });
      	// syncattribs(original, olde, newe);
      */
    } else {
      replacekids(range, elm, newn);
    }
  }
  /**
   * @param {Node} oldn
   * @param {Node} newn
   * @returns {boolean}
   */


  function gentlecandidates(oldn, newn) {
    return iselm$3(oldn) && iselm$3(newn) ? function () {
      const oldkids = subguids(oldn);
      const newkids = subguids(newn);

      const notnull = guid => guid !== null;

      const qualify = list => list.every(notnull);

      return qualify(oldkids) && qualify(newkids) ? function () {
        const addlist = unique(newkids, oldkids);
        const outlist = unique(oldkids, newkids);
        const thelist = oldkids.filter(guid => !addlist.includes(guid) && !outlist.includes(guid));
        return String(thelist) === String(oldkids);
      }() : false;
    }() : false;
  }
  /**
   * @param {Node} oldn
   * @param {Node} newn
   * @returns {Array<Set|Map>}
   */


  function gentleoperations(oldn, newn) {
    const _ref = [subguids(oldn), subguids(newn)],
          oldkids = _ref[0],
          newkids = _ref[1];
    const _ref2 = [unique(newkids, oldkids), unique(oldkids, newkids)],
          addlist = _ref2[0],
          outlist = _ref2[1];
    return [new Set(outlist), new Map(addlist.reduce((entries, newguid, index) => {
      const oldguid = oldkids[index];

      if (oldguid !== newguid && addlist.includes(newguid)) {
        entries.push([oldguid, newguid]);
        oldkids.splice(index, 0, newguid);
      }

      return entries;
    }, []))];
  }
  /**
   * @param {Range} range
   * @param {Element|DocumentFragment} elm
   * @param {Map<string, Element>} oids Guid elements in the old VDOM
   * @param {Map<string, Element>} nids Guid elements in the new VDOM
   * @param {Map<string, Element>} originals Guid elements removed from real DOM
   */


  function restoreoriginals(range, elm, oids, nids, originals) {
    const changelings = mapguids(elm);
    changelings.forEach((changeling, guid) => {
      if (originals.has(guid)) {
        const original = originals.get(guid);

        if (changeling !== original) {
          swapchangeling(range, changeling, original, oids, nids);
        } else {
          console.log('SAME');
        }
      }
    });
  }
  /**
   * @param {Range} range
   * @param {Element} changeling
   * @param {Element} original
   * @param {Map<string, Element>} oids Guid elements in the old VDOM
   * @param {Map<string, Element>} nids Guid elements in the new VDOM
   */


  function swapchangeling(range, changeling, original, oids, nids) {
    const guid = getguid$3(original);
    const olde = oids.get(guid);
    const newe = nids.get(guid);
    removekids(range, original);
    replacenode(changeling, original);
    replacekids(range, original, changeling);
    syncattribs(original, olde, newe);
  } // Patching attributes .........................................................

  /**
   * Synchronize attributes.
   * @param {Element} elm The DOM element as seen on stage
   * @param {Element} oldn The equivalent element in old VDOM
   * @param {Element} newn The equivalent element in new VDOM
   */


  function syncattribs(elm, oldn, newn) {
    if (hasatts(oldn) || hasatts(newn)) {
      const oatts = mapatts(oldn);
      const natts = mapatts(newn);
      const names = ['class', 'data-plastique-id'];

      const skips = name => names.some(n => name === n);

      natts.forEach((v, n) => skips(n) ? void 0 : setatt(elm, n, v));
      oatts.forEach((v, n) => skips(n) || natts.has(n) ? void 0 : delatt(elm, n));

      if (hasclass(oldn) || hasclass(newn)) {
        syncclass(classes(elm), classes(oldn), classes(newn));
      }
    }
  }
  /**
   * Synchronize class list.
   * @param {ClassList} list current
   * @param {ClassList} olist before
   * @param {ClassList} nlist after
   */


  function syncclass(list, olist, nlist) {
    const added = c => !olist || !olist.contains(c);

    const nuked = c => !nlist.contains(c);

    asarray$1(nlist).filter(added).forEach(c => list.add(c));

    if (olist) {
      asarray$1(olist).filter(nuked).forEach(c => list.remove(c));
    }
  }
  /**
   * Function to collects markup during EDBML rendering phase. It works like this:
   * When the initial EDBML function is called, it will render directly via this
   * function. All subsequent (nested) function calls will render indirectly via
   * another function. Only the first function (this function) has the ability to
   * produce the HTML result and this operation will also reset the whole setup.
   * This way, any public (exported) function can become the rendering entry point
   * even though they all have the same basic code structure.
   * @type {Function} - this function is refered to as `out` in the generated JS.
   */


  let first$1 = null;
  /**
   * TODO: Make this stuff run in Node and Workers. Could JSDOM help us?
   * @param {Function} [defer]
   * @returns {Function}
   */

  function output$2() {
    return first$1 ? nextout : first$1 = firstout();
  }
  /**
   * @param {Element} root - The root element
   * @param {string} guid - The root guid
   * @param {Out} newout
   * @param {Out|null} [oldout]
   * @returns {Array<function>}
   */


  function diff(root, guid, newout, oldout) {
    return getdiffs(root, guid, newout, oldout || new Out());
  }
  /**
   * TODO: Advanced render summary goes here!
   * @param {Element} root The root element
   * @param {string} guid The root guid
   * @param {Array<function>} diffs
   * @param {Map<string, Function>} calls
   * @returns {Object}
   */


  function patch(root, guid, diffs, calls) {
    return patchdiffs(root, guid, diffs, calls);
  } // Scoped ......................................................................

  /**
   * Creates the entry point `out` to be used via some tagged template string.
   * @param {Function} [defer] - collecting callbacks for `on:click` type events.
   * @returns {Function}
   */


  function firstout(defer) {
    let markup = '';
    let unsafe = [];
    let others = [];
    let defers = new Map();
    let bypass = new Set();

    function out(arg, ...args) {
      if (arguments.length) {
        markup += replace(arg, args, unsafe, others, bypass);
        bypass.clear();
      } else {
        return finalize(markup, unsafe, others, defers);
      }
    }

    return proxy$1(out, {
      defer: defer,
      blargh: dec => {
        bypass.add(dec);
        return dec;
      },
      guargh: val => {
        unsafe.push(val);
        return fixvalue(val, unsafe, others);
      },
      arrghs: fun => {
        const key = `cb${generatekey()}`;
        defers.set(key, fun);
        return key;
      }
    });
  }
  /**
   * Nested `out` will simply delegate to the entry point `out`
   * except nothing will happen when called without arguments.
   * @param {string} arg
   * @param {...string} args
   * @returns {string}
   */


  const nextout = function (out) {
    return proxy$1(out, {
      blargh: dec => first$1 ? first$1.blargh(dec) : '',
      guargh: val => first$1 ? first$1.guargh(val) : '',
      arrghs: fun => first$1 ? first$1.arrghs(fun) : ''
    });
  }(function out(arg, ...args) {
    if (arguments.length) {
      first$1(...arguments);
    } else {
      return '';
    }
  });
  /**
   * @param {Function} out
   * @param {Object} expandos
   * @returns {Proxy}
   */


  function proxy$1(out, expandos) {
    return new Proxy(Object.assign(out, expandos), Out);
  }
  /**
   * Generate random key for historic reasons.
   * TODO: Attempt to simply increment counter.
   * @param {string} [fix]
   * @returns {string}
   */


  function generatekey(fix = 'cb') {
    return String(Math.random()).slice(2, 11);
  }
  /**
   * If `out` is used as a tagged template, we replace all these `${strings}`
   * with an intermediary value that can be evaluated for XSS safety later on.
   * If `oout` is called directly, we bypass this step and output the argument.
   * IDEA: ENABLE AND DISABLE `$att` PROXY STUFF WITHIN THIS METHOD (?)
   * @param {string|Array<string>} strings
   * @param {Array<string>} values
   * @param {Array<string>} unsafe
   * @param {Array<Node>} others
   * @param {Set<String>} bypass
   * @returns {string}
   */


  function replace(strings, values, unsafe, others, bypass) {
    return Array.isArray(strings) && strings.raw ? strings.raw.reduce((result, string, i) => {
      return result + string + johnson$2(values[i], unsafe, others, bypass);
    }, '') : String(strings);
  }
  /**
   * @param {*} value
   * @param {Array<string>} unsafe
   * @param {Array<Node>} others
   * @param {Set<String>} bypass
   * @returns {string}
   */


  function johnson$2(value, unsafe, others, bypass) {
    return bypass.has(value) && value.includes('=') ? value : fixvalue(value, unsafe, others);
  }
  /**
   * Finally reset and return an {Out} which can be converted to HTML or DOM.
   * @param {string} markup
   * @param {Array} unsafe
   * @param {Array} others
   * @param {Map<string, Function>} defers
   * @returns {Out}
   */


  function finalize(markup, unsafe, others, defers) {
    first$1 = null;
    nextout.defer = null;
    return new Out(markup, unsafe, others, defers);
  }

  var _class$8;
  /**
   * Script plugin.
   * TODO: General purpose decorator to `bind` methods ('run', 'one', 'stop').
   */


  let ScriptPlugin = (_class$8 = class ScriptPlugin extends SpiritPlugin {
    constructor(...args) {
      super(...args);
      this._script = null;
      this._props = new Mapping();
      this._watch = false;
      this._params = [];
      this._output = '';
      this._running = false;
      this._scheduleid = -1;
    }
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


    load(script) {
      if (this._script = script) {
        this._params = [];
      }
    }
    /**
     * Run the script and watch for future model updates.
     * TODO: Consider (and test) always running this on a micro schedule
     * @returns {this}
     */


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
    } // Private ...................................................................

    /**
     * Currently loaded script.
     * @type {Function}
     */

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

  }, (_applyDecoratedDescriptor(_class$8.prototype, "load", [chained], Object.getOwnPropertyDescriptor(_class$8.prototype, "load"), _class$8.prototype), _applyDecoratedDescriptor(_class$8.prototype, "run", [chained], Object.getOwnPropertyDescriptor(_class$8.prototype, "run"), _class$8.prototype), _applyDecoratedDescriptor(_class$8.prototype, "stop", [chained], Object.getOwnPropertyDescriptor(_class$8.prototype, "stop"), _class$8.prototype), _applyDecoratedDescriptor(_class$8.prototype, "one", [chained], Object.getOwnPropertyDescriptor(_class$8.prototype, "one"), _class$8.prototype)), _class$8);
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
    spirit.life.rendered = true; // spirit.life.dispatch(Const.LIFE_RENDER);

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
    return new Error(`Don't update the ${offender} while the script is being evaluated.` + ` The update will cause the rendering to run in an endless loop.`);
  }

  var _class$9;

  let ShadowPlugin = (_class$9 = class ShadowPlugin extends ScriptPlugin {
    /**
     * Returns and potentially creates the `shadowRoot`.
     * Note that `element.shadowRoot` becomes `null` if we change the mode to `closed` here.
     * @returns {ShadowRoot}
     */
    root() {
      return this.element.shadowRoot || this.element.attachShadow({
        mode: 'open'
      });
    }
    /**
     * Activate the mutation observer system within the Shadow DOM.
     * Make sure to call this method if shadow spirits are expected!
     * TODO: Rebooted observer should power off upon plugin disposal!
     * @returns {this}
     */


    live() {
      reboot(this.root());
    }

  }, _applyDecoratedDescriptor(_class$9.prototype, "live", [chained], Object.getOwnPropertyDescriptor(_class$9.prototype, "live"), _class$9.prototype), _class$9);

  var _class$a;
  /**
   * Tracking and dispatching DOM events.
   */


  let EventPlugin = (_class$a = class EventPlugin extends TrackerPlugin {
    /**
     * Add one or more event handlers.
     * TODO: Support config via object
     * @param {string|Array<string>} type
     * @param {Element|Spirit} [target]
     * @param {EventHandler} [handler]
     * @param {boolean|Object} [capture]
     * @returns {this}
     */
    on(type, target = this.element, handler = this.spirit, capture = false) {
      let checks = [target = qualify(target), handler, capture];
      asarray(type, t => {
        if (this._addchecks(t, checks)) {
          this._shiftEventListener(true, target, t, handler, capture);
        }
      });
    }
    /**
     * Remove one or more event handlers.
     * TODO: Support config via object
     * @param {string|Array<string>} arg
     * @param {Element|Spirit} [target]
     * @param {EventHandler} [handler]
     * @param {boolean} [capture]
     * @returns {this}
     */


    off(type, target = this.element, handler = this.spirit, capture = false) {
      let checks = [target = qualify(target), handler, capture];
      asarray(type, t => {
        if (this._removechecks(t, checks)) {
          this._shiftEventListener(false, target, t, handler, capture);
        }
      });
    } // Private .................................................................

    /**
     * Actual event registration has been isolated so that
     * one may overwrite or overload this particular part.
     * @param {boolean} add
     * @param {Node} target
     * @param {string} type
     * @param {Object} handler
     * @param {boolean} capture
     */


    _shiftEventListener(add, target, type, handler, capture) {
      const args = [type, handler, capture];
      add ? target.addEventListener(...args) : target.removeEventListener(...args);
    }
    /**
     * Remove event listeners.
     * @see {TrackerPlugin}
     * @param {string} type
     * @param {Array<object>} checks
     */


    _cleanupchecks(type, checks) {
      this.off(type, ...checks);
    }

  }, (_applyDecoratedDescriptor(_class$a.prototype, "on", [chained], Object.getOwnPropertyDescriptor(_class$a.prototype, "on"), _class$a.prototype), _applyDecoratedDescriptor(_class$a.prototype, "off", [chained], Object.getOwnPropertyDescriptor(_class$a.prototype, "off"), _class$a.prototype)), _class$a);
  /**
   * Qualify target.
   * TODO: XMLHttpRequest can for example also be a target.
   * @param {Spirit|Node|Window} target
   * @returns {Node|Window}
   * @throws {TypeError}
   */

  function qualify(target) {
    if (Spirit.is(target)) {
      target = target.element;
    }

    if (target && (target.nodeType || isWindow(target))) {
      return target;
    } else {
      throw new TypeError('Unqualified event target', target);
    }
  }

  var _class$b;
  /**
   * Task scheduling and time micro management.
   */


  let TickPlugin = (_class$b = class TickPlugin extends TrackerPlugin {
    /**
     * Add one or more tick handlers.
     * @param {string|Array<string>} arg
     * @param {Object} [handler]
     * @returns {this}
     */
    on(type, handler = this.spirit) {
      asarray(type, t => {
        if (this._addchecks(t, [handler])) {
          Tick.add(t, handler);
        }
      });
    }
    /**
     * Add one or more tick handlers.
     * @param {string|Array<string>} arg
     * @param {Object} [handler]
     * @returns {this}
     */


    off(type, handler = this.spirit) {
      asarray(type, t => {
        if (this._removechecks(t, [handler])) {
          Tick.remove(t, handler);
        }
      });
    }
    /**
     * Add one or more self-removing tick handlers.
     * TODO: Think about this for a while.
     * @param {string|Array<string>} arg
     * @param {Object} [handler]
     * @returns {this}
     */


    one(type, handler = this.spirit) {
      asarray(type, t => {
        this._removechecks(t, [handler]);

        Tick.remove(t, handler).one(t, handler);
      });
    }
    /**
     * Execute action in next available tick. We don't return anything
     * because we'd like at one point to make the tick cancellable
     * and that actually is supported here in the browser (not in Node).
     * UPDATE: This is actually supported now in Node via `setImmediate`
     * @param {Function} action
     */


    next(action) {
      Tick.next(action);
    }
    /**
     * Execute action in next animation frame.
     * @param {Function} action
     * @returns {number}
     */


    nextFrame(action) {
      return Tick.nextFrame(action);
    }
    /**
     * Cancel scheduled animation frame.
     * @param {number} n
     * @returns {this}
     */


    cancelFrame(n) {
      Tick.cancelFrame(n);
    }
    /**
     * Schedule timeout.
     * @param {Function} action
     * @param {number} time in milliseconds
     * @returns {number}
     */


    time(action, time) {
      return Tick.time(action, time);
    }
    /**
     * Cancel scheduled timeout.
     * @param {number} n
     */


    cancelTime(n) {
      Tick.cancelTime(n);
    }
    /**
     * Start tick of type (if not already started).
     * @param {string} type
     */


    start(type) {
      Tick.start(type);
    }
    /**
     * Stop tick of type. This will stop the tick for all
     * listeners, so perhaps you're looking for `remove`?
     * @param {string} type
     */


    stop(type) {
      Tick.stop(type);
    }
    /**
     * Dispatch tick after given time.
     * @param {string} type
     * @param {number} time Milliseconds (omit for nextTick)
     * @returns {this}
     */


    dispatch(type, time) {
      Tick.dispatch(type, time);
    } // Private ...................................................................

    /**
     * Abort ticks when plugin disposes.
     * @param {string} type
     * @param {Array<object>} checks
     */


    _cleanupchecks(type, checks) {
      Tick.remove(type, checks[0]);
    }

  }, (_applyDecoratedDescriptor(_class$b.prototype, "on", [chained], Object.getOwnPropertyDescriptor(_class$b.prototype, "on"), _class$b.prototype), _applyDecoratedDescriptor(_class$b.prototype, "off", [chained], Object.getOwnPropertyDescriptor(_class$b.prototype, "off"), _class$b.prototype), _applyDecoratedDescriptor(_class$b.prototype, "one", [chained], Object.getOwnPropertyDescriptor(_class$b.prototype, "one"), _class$b.prototype), _applyDecoratedDescriptor(_class$b.prototype, "cancelFrame", [chained], Object.getOwnPropertyDescriptor(_class$b.prototype, "cancelFrame"), _class$b.prototype), _applyDecoratedDescriptor(_class$b.prototype, "cancelTime", [chained], Object.getOwnPropertyDescriptor(_class$b.prototype, "cancelTime"), _class$b.prototype), _applyDecoratedDescriptor(_class$b.prototype, "start", [chained], Object.getOwnPropertyDescriptor(_class$b.prototype, "start"), _class$b.prototype), _applyDecoratedDescriptor(_class$b.prototype, "stop", [chained], Object.getOwnPropertyDescriptor(_class$b.prototype, "stop"), _class$b.prototype), _applyDecoratedDescriptor(_class$b.prototype, "dispatch", [chained], Object.getOwnPropertyDescriptor(_class$b.prototype, "dispatch"), _class$b.prototype)), _class$b);
  /**
   * A non-bubbling kind of event that
   * exposes the lifecycle of a spirit.
   * TODO: Fountain of Life (optimize)
   */

  class Life {
    /**
     * @param {string} type
     * @param {Spirit} target
     */
    constructor(type, target) {
      this.target = target;
      this.type = type;
    }

  }

  var _class$c; // TODO! DON'T !!!!!!!!!!!!!!!!!!!!!!!!!!!!!


  const LIFE_CONFIGURE = 'gui-life-configure';
  const LIFE_READY$1 = 'gui-life-ready';
  const LIFE_DESTRUCT = 'gui-life-destruct';
  /**
   * Tracking the spirit lifecycle.
   * TODO: Prevent one-offs from changing state twice
   */

  let LifePlugin = (_class$c = class LifePlugin extends TrackerPlugin {
    constructor(...args) {
      super(...args);
      this.configured = false;
      this.entered = false;
      this.attached = false;
      this.ready = false;
      this.async = false;
      this.destructed = false;
      this.rendered = false;
    } // ???

    /**
     * Add handler for life event(s).
     * @param {string|Array<string>} type
     * @param {LifeHandler} [handler]
     * @returns {this}
     */


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

  }, (_applyDecoratedDescriptor(_class$c.prototype, "on", [chained], Object.getOwnPropertyDescriptor(_class$c.prototype, "on"), _class$c.prototype), _applyDecoratedDescriptor(_class$c.prototype, "off", [chained], Object.getOwnPropertyDescriptor(_class$c.prototype, "off"), _class$c.prototype), _applyDecoratedDescriptor(_class$c.prototype, "dispatch", [chained], Object.getOwnPropertyDescriptor(_class$c.prototype, "dispatch"), _class$c.prototype)), _class$c);
  /**
   * These may happen only once.
   * @type {Set<string>}
   */

  const singlerun = new Set([LIFE_CONFIGURE.LIFE_ENTER, LIFE_READY$1, LIFE_DESTRUCT]);
  /**
   * Dispatch life event.
   * @param {string} type
   * @param {Spirit} target
   * @param {Array<LifeHandler>} checklist
   */

  function godispatch(type, target, checklist) {
    let life = new Life(type, target);
    checklist.toArray(type).map(checks => checks[0]).forEach(handler => {
      handler.onlife(life);
    });

    if (singlerun.has(type)) {
      checklist.delete(type);
    }
  }

  var _class$d;
  /**
   * Managing the spirits (element) attributes.
   */


  let AttPlugin = (_class$d = class AttPlugin extends SpiritPlugin {
    /**
     * Set attribute value (always as a string).
     * TODO: Support a hashmap (object) to set multiple attributes.
     * @param {string} name
     * @param {*} value - Use `null` to delete the attribute
     * @returns {this}
     */
    set(name, value) {
      value === null ? this.delete(name) : this.element.setAttribute(name, String(value));
    }
    /**
     * Get attribute value as an inferred primitive type.
     * TODO: support an array of names to return a hashmap (object).
     * TODO: support *no* argument to return all the attributes (object).
     * @param {string} name
     * @returns {string|number|boolean|null}
     */


    get(name) {
      return cast(this.element.getAttribute(name));
    }
    /**
     * Has attribute(s) name declared?
     * TODO: Support a list of names to check for multiple attributes.
     * @param {string} name
     * @returns {boolean}
     */


    has(name) {
      return this.element.hasAttribute(name);
    }
    /**
     * Delete attribute.
     * @param {string} name
     * @returns {this}
     */


    delete(name) {
      this.element.removeAttribute(name);
    }
    /**
     * Delete attribute (via short method name).
     * @alias {delete}
     * @param {string} name
     * @returns {this}
     */


    del(name) {
      this.delete(name);
    }
    /**
     * Set or remove attribute depending on the first argument.
     * @param {truthy} truthy
     * @param {string} name
     * @param {*} [value]
     */


    shift(truthy, name, value = name) {
      !!truthy ? this.set(name, value) : this.delete(name);
    }

  }, (_applyDecoratedDescriptor(_class$d.prototype, "set", [chained], Object.getOwnPropertyDescriptor(_class$d.prototype, "set"), _class$d.prototype), _applyDecoratedDescriptor(_class$d.prototype, "delete", [chained], Object.getOwnPropertyDescriptor(_class$d.prototype, "delete"), _class$d.prototype), _applyDecoratedDescriptor(_class$d.prototype, "del", [chained], Object.getOwnPropertyDescriptor(_class$d.prototype, "del"), _class$d.prototype)), _class$d);

  var _class$e;

  const COMMA = ',';
  const FLOAT = 'float';
  const BEFIX = '-beta-';
  const AGENT = ['', '-webkit-', '-moz-', '-ms-'];
  const DOCEL = Environment.browser ? document.documentElement : null;
  const MATCH = Environment.browser ? matchmethod(DOCEL) : null;
  /**
   * Until we figure out something better, we'll manually track props that can or
   * must be assigned as simple numbers (without a unit). Props not in this list
   * will be suffixed with `px` when assigned as numbers via `this.css.xxxname`.
   * TODO: Read all the specs and add more properties :/
   * @type {Set<string>}
   */

  const numbers = new Set(['fontWeight', 'opacity', 'zIndex']);
  /**
   * Working with CSS.
   */

  let CSSPlugin = (_class$e = class CSSPlugin extends SpiritPlugin {
    /**
     * Hm. We don't need to "observe" this, we just need the proxy setter...
     * @returns {boolean}
     */
    $observable() {
      return true;
    }
    /**
     * This is the "universal getter" method. Whenever the Proxy cannot
     * find a looked-up property, and if this method is declared, it
     * will expose the property value via this methods return value.
     * @param {string} name
     * @returns {string|number}
     */


    uniget(name) {
      if (name in this.element.style) {
        const val = this.get(name);
        const num = parseInt(val, 10);
        return isNaN(num) ? val : num;
      }
    }
    /**
     * This is the "universal setter" method. When declared, the Proxy
     * will call this method before (and not after!) it attempts to
     * set the property. Return `true` to *not* assign the JS property.
     * TODO: Should most likely return `false` to abort the JS setter :/
     * @param {string} name
     * @param {*} value
     * @returns {truthy} - The property was handled here?
     */


    uniset(name, value) {
      if (name in this.element.style) {
        this.set(name, value);
        return true;
      }
    }
    /**
     * Add classname(s).
     * confirmed('string|array')
     * @param {string|Array<string>} name
     * @returns {CSSPlugin}
     */


    add(name) {
      asarray(name, n => CSSPlugin.add(this.element, n));
    }
    /**
     * Remove classname(s).
     * confirmed('string|array')
     * @param {string} name
     * @returns {CSSPlugin}
     */


    delete(name) {
      asarray(name, n => CSSPlugin.delete(this.element, n));
    }
    /**
     * Add or remove classname(s) according to truthy first param.
     * confirmed('*', 'string|array')
     * @param {truthy|falsy} on
     * @param {string} name
     * @returns {CSSPlugin}
     */


    shift(on, name) {
      asarray(name, n => CSSPlugin.shift(this.element, !!on, n));
    }
    /**
     * Contains classname?
     * confirmed('string')
     * @param {string} name
     * @returns {boolean}
     */


    has(name) {
      return CSSPlugin.has(this.element, name);
    }
    /**
     * Set single element.style.
     * @param {string} prop
     * @param {string} val
     * @returns {CSSPlugin}
     */


    set(prop, val) {
      CSSPlugin.set(this.element, prop, val);
    }
    /**
     * Set multiple styles via key value map (object).
     * @param {Object<string,string>} map
     * @returns {CSSPlugin}
     */


    style(map) {
      CSSPlugin.style(this.element, map);
    }
    /**
     * Get single element.style (see also `compute` method).
     * @param {string} prop
     * @returns {string}
     */


    get(prop) {
      return CSSPlugin.get(this.element, prop);
    }
    /**
     * Compute runtime style.
     * @param {string} prop
     * @returns {string}
     */


    compute(prop) {
      return CSSPlugin.compute(this.element, prop);
    }
    /**
     * Get or set (full) className.
     * @param {string} [name]
     * @returns {string|CSSPlugin}
     */


    name(n) {
      if (arguments.length) {
        this.element.className = n;
      } else {
        return this.element.className;
      }
    }
    /**
     * Spirit element mathes selector?
     * @TODO: move to DOMPlugin!
     * @param {string} selector
     * @returns {boolean}
     */


    matches(selector) {
      return CSSPlugin.matches(this.element, selector);
    }
    /**
     * @deprecated
     */


    remove() {
      throw new Error('Deprecated API is deprecated');
    }
    /**
     * @deprecated
     */


    contains() {
      throw new Error('Deprecated API is deprecated');
    } // Static ....................................................................

    /**
     * classList.add()
     * @param {Element} element
     * @param {string} names
     * @returns {constructor}
     */


    static add(element, name = '') {
      asarray(name, n => element.classList.add(n));
    }
    /**
     * classList.remove()
     * @param {Element} element
     * @param {string} name
     * @returns {constructor}
     */


    static delete(element, name = '') {
      asarray(name, n => element.classList.remove(n));
    }
    /**
     * Add or remove classname according to second truthy param.
     * @param {Element} element
     * @param {truthy|falsy} on
     * @param {string} name
     * @returns {constructor}
     */


    static shift(element, on, name) {
      if (!!on) {
        this.add(element, name);
      } else {
        this.delete(element, name);
      }
    }
    /**
     * classList.contains()
     * @param {Element} element
     * @param {string} name
     * @returns {boolean}
     */


    static has(element, name) {
      return element.classList.contains(name);
    }
    /**
     * Set single CSS property. Use style() for multiple properties.
     * TODO: also automate shorthands such as '10px 20px 10px 20px'
     * @param {Element}
     * @param {string} prop
     * @returns {Function}
     */


    static set(element, prop, value) {
      if (!isNaN(value) && !numbers.has(prop)) {
        value += 'px';
      }

      value = String(value);

      if (prop === FLOAT) {
        prop = 'cssFloat';
      } else {
        value = jsvalue(value);
        prop = jsproperty(prop);
      }

      element.style[prop] = value;
    }
    /**
     * TODO: Get element.style property; if this has been set.
     * Not to be confused with compute() for computedStyle!!!
     * @param {Element} element
     * @param {string} prop
     * @returns {string}
     */


    static get(element, prop) {
      prop = jsproperty(prop);
      return jsvalue(element.style[prop]);
    }
    /**
     * Set multiple element.style properties via hashmap. Note that
     * this method returns the element (ie. it is not chainable).
     * @param {Element|Spirit} thing Spirit or element.
     * @param {Object<string,string>} styles
     * @returns {Element|Spirit}
     */


    static style(thing, styles) {
      const elm = Spirit.is(thing) ? thing.element : thing;
      Object.entries(styles).forEach(entry => {
        this.set(elm, entry[0], entry[1]);
      });
      return thing;
    }
    /**
     * Compute runtime style.
     * @param {Element|Spirit} thing
     * @param {string} prop
     * @returns {string}
     */


    static compute(thing, prop) {
      const elm = Spirit.is(thing) ? thing.element : thing;
      prop = standardcase(jsproperty(prop));
      return getComputedStyle(elm, null).getPropertyValue(prop);
    }
    /**
     * Node matches CSS selector?
     * TODO: Something about try-catch not being JIT compatible?
     * @param {Node} node
     * @param {string} selector
     * @returns {boolean}
     */


    static matches(node, selector) {
      return node[MATCH](selector);
    }

  }, (_applyDecoratedDescriptor(_class$e.prototype, "add", [chained], Object.getOwnPropertyDescriptor(_class$e.prototype, "add"), _class$e.prototype), _applyDecoratedDescriptor(_class$e.prototype, "delete", [chained], Object.getOwnPropertyDescriptor(_class$e.prototype, "delete"), _class$e.prototype), _applyDecoratedDescriptor(_class$e.prototype, "shift", [chained], Object.getOwnPropertyDescriptor(_class$e.prototype, "shift"), _class$e.prototype), _applyDecoratedDescriptor(_class$e.prototype, "set", [chained], Object.getOwnPropertyDescriptor(_class$e.prototype, "set"), _class$e.prototype), _applyDecoratedDescriptor(_class$e.prototype, "style", [chained], Object.getOwnPropertyDescriptor(_class$e.prototype, "style"), _class$e.prototype), _applyDecoratedDescriptor(_class$e.prototype, "name", [chained], Object.getOwnPropertyDescriptor(_class$e.prototype, "name"), _class$e.prototype), _applyDecoratedDescriptor(_class$e, "add", [chained], Object.getOwnPropertyDescriptor(_class$e, "add"), _class$e), _applyDecoratedDescriptor(_class$e, "delete", [chained], Object.getOwnPropertyDescriptor(_class$e, "delete"), _class$e), _applyDecoratedDescriptor(_class$e, "shift", [chained], Object.getOwnPropertyDescriptor(_class$e, "shift"), _class$e), _applyDecoratedDescriptor(_class$e, "set", [chained], Object.getOwnPropertyDescriptor(_class$e, "set"), _class$e)), _class$e);
  /**
   * CamelCase string.
   * @param {string} string
   * @returns {string}
   */

  function camelcase(string) {
    return string.replace(/-([a-z])/gi, function (all, letter) {
      return letter.toUpperCase();
    });
  }
  /**
   * This will standard-css-notate CamelCased string.
   * @param {string} string
   * @returns {string}
   */


  function standardcase(string) {
    return string.replace(/[A-Z]/g, function (all, letter) {
      return '-' + string.charAt(letter).toLowerCase();
    });
  }
  /**
   * Normalize declaration property for use in element.style scenario.
   * TODO: Should be possible to skip this vendor prefixing nowadays?
   * @param {string} prop
   * @returns {string}
   */


  function jsproperty(prop) {
    let test;
    let fixt = prop;

    if ((prop = String(prop)).startsWith(BEFIX)) {
      AGENT.every(vendor => {
        test = camelcase(prop.replace(BEFIX, vendor));

        if (DOCEL.style[test] !== undefined) {
          fixt = test;
          return false;
        }

        return true;
      });
    } else {
      fixt = camelcase(fixt);
    }

    return fixt;
  }
  /**
   * Normalize declaration value for use in element.style scenario.
   * TODO: clean this up some day.
   * @param {string} value
   * @returns {string}
   */


  function jsvalue(value) {
    let test;

    if ((value = String(value)) && value.includes(BEFIX)) {
      let parts = [];
      value.split(COMMA).forEach(part => {
        if ((part = part.trim()).startsWith(BEFIX)) {
          AGENT.every(vendor => {
            test = camelcase(part.replace(BEFIX, vendor));

            if (DOCEL.style[test] !== undefined) {
              parts.push(part.replace(BEFIX, vendor));
              return false;
            }

            return true;
          });
        } else {
          parts.push(part);
        }
      });
      value = parts.join(COMMA);
    }

    return value;
  }
  /**
   * Determine the vendor-prefixed `matchesSelector` method.
   * @param {HTMLHtmlElement} root
   * @returns {string}
   */


  function matchmethod(root) {
    return ['matchesSelector', 'msMatchesSelector', 'mozMatchesSelector', 'webkitMatchesSelector'].reduce((result, method) => {
      return result || (root[method] ? method : null);
    }, null);
  } // Backup ......................................................................

  /**
   * Normalize declaration property for use in CSS text.
   * @param {string} prop
   * @returns {string}
   *
  function cssproperty(prop) {
  	return standardcase(jsproperty(prop));
  }

  /**
   * Normalize declaration value for use in CSS text.
   * @param {string} prop
   * @returns {string}
   *
  function cssvalue(value) {
  	return standardcase(jsvalue(value));
  }
  */


  const ASCENDING = 'ascending';
  const DESCENDING = 'descending';
  const CONTINUE = 0;
  const STOP = 1;
  const SKIP = 2;
  const SKIP_CHILDREN = 4;
  /**
   * Crawling up and down the DOM.
   * TODO: Support SKIP directive.
   * TODO: method `descendBelow` and 'ascendAbove' to skip start element
   */

  class Crawler {
    /**
     * Constructor.
     * @param {string} type Identifies the crawler
     */
    constructor(type) {
      this.type = type || null;
      this.direction = null;
      this.global = false;
      this._stopped = false;
    }
    /**
     * Crawl DOM ascending.
     * @param {Spirit|Node} start
     * @param {CrawlerClient} client
     */


    ascend(start, client) {
      this._stopped = false;
      this.direction = ASCENDING;
      let onelm = Type.isFunction(client.onelement);
      let onspi = Type.isFunction(client.onspirit);
      let elm = Spirit.is(start) ? start.element : start;
      crawlascending(this, elm, client, onelm, onspi);
    }
    /**
     * Crawl DOM ascending, transcend into ancestor frames.
     * @param {Spirit|Node} start
     * @param {CrawlerClient} client
     */


    ascendGlobal(start, client) {
      this.global = true;
      this.ascend(start, client);
      this.global = false;
    }
    /**
     * Crawl DOM descending.
     * @param {Spirit|Node} start
     * @param {CrawlerClient} client
     */


    descend(start, client) {
      this._stopped = false;
      this.direction = DESCENDING;
      let onelm = Type.isFunction(client.onelement);
      let onspi = Type.isFunction(client.onspirit);
      let elm = Spirit.is(start) ? start.element : start;
      elm = elm.nodeType === Node.DOCUMENT_NODE ? elm.documentElement : elm;
      crawldescending(this, elm, client, onelm, onspi, true);
    }
    /**
     * Crawl DOM descending, transcend into iframes.
     * @param {Spirit|Node} start
     * @param {CrawlerClient} client
     */


    descendGlobal(start, client) {
      this.global = true;
      this.descend(start, client);
      this.global = false;
    }

  }
  /**
   * Interface constants.
   * TODO: As constants :/
   */


  Object.assign(Crawler, {
    ASCENDING: ASCENDING,
    DESCENDING: DESCENDING,
    CONTINUE: CONTINUE,
    STOP: STOP,
    SKIP: SKIP,
    SKIP_CHILDREN: SKIP_CHILDREN
  }); // Scoped ......................................................................

  /**
   * Iterate nodes descending.
   * @param {Crawler} crawler
   * @param {Element} elm
   * @param {CrawlerClient} client
   * @param {boolean} onelm
   * @param {boolean} onspi
   * @param {boolean} [start]
   */

  function crawldescending(crawler, elm, client, onelm, onspi, start) {
    let next;
    let directive = handleElement(crawler, elm, client, onelm, onspi);

    switch (directive) {
      case STOP:
        crawler._stopped = true;
        break;

      case CONTINUE:
      case SKIP_CHILDREN:
        if (directive !== SKIP_CHILDREN) {
          if (elm.childElementCount) {
            crawldescending(crawler, elm.firstElementChild, client, onelm, onspi);
          } else if (crawler.global && elm.localName === 'iframe') {
            console.log('TODO: transcend crawler descending');
            /*
             * TODO: Make iframe transcend work even without spirit support.
             *
            if (IframeSpirit.is(elm)) {
            	win = elm.ownerDocument.defaultView;
            	if (Type.isFunction(client.transcend)) {
            		client.transcend(
            			spirit.contentWindow, 
            			spirit.xguest, 
            			spirit.$instanceid
            		);
            	}
            }
            */
          }
        }

        if (!crawler._stopped) {
          if (!start && (next = elm.nextElementSibling)) {
            crawldescending(crawler, next, client, onelm, onspi);
          }
        }

        break;
    }
  }
  /**
   * Iterate nodes ascending.
   * @param {Crawler} crawler
   * @param {Element} elm
   * @param {CrawlerClient} client
   * @param {boolean} onelm
   * @param {boolean} onspi
   */


  function crawlascending(crawler, elm, client, onelm, onspi) {
    do {
      if (elm.nodeType === Node.DOCUMENT_NODE) {
        console.log('TODO: transcend crawler ascending');
        elm = null;
      }

      if (elm) {
        let directive = handleElement(crawler, elm, client, onelm, onspi);

        switch (directive) {
          case STOP:
            elm = null;
            break;

          default:
            elm = elm.parentNode;
            break;
        }
      }
    } while (elm);
  }
  /**
   * Handle element and/or spirit for crawler client.
   * @param {Crawler} crawler
   * @param {Element} element
   * @param {CrawlerClient} client
   * @param {boolean} onelm
   * @param {boolean} onspi
   * @returns {number} directive
   */


  function handleElement(crawler, element, client, onelm, onspi) {
    let spirit;
    let directive = CONTINUE;

    if (client) {
      if (onelm) {
        directive = client.onelement(element);
      }

      if (!directive && (spirit = Spirit.get(element))) {
        directive = spirit.oncrawler(crawler);

        if (!directive && onspi) {
          directive = client.onspirit(spirit);
        }
      }
    }

    return directive || CONTINUE;
  }

  var _class$f;

  const CLASS_HIDDEN$1 = 'gui-hidden';
  /**
   * Normalize something to element or textnode.
   * @param {*} thing
   * @returns {Element|Text}
   */

  const normalize$2 = thing => Spirit.is(thing) ? thing.element : thing && thing.nodeType ? thing : textual(thing);
  /**
   * Anything as textnode.
   * @param {*} thing
   * @returns {Text}
   */


  const textual = thing => document.createTextNode(String(thing));
  /**
   * DOM query and manipulation.
   * TODO: add `prependTo` method
   * TODO: https://stackoverflow.com/questions/31991235/sort-elements-by-document-order-in-javascript
   */


  let DOMPlugin = (_class$f = class DOMPlugin extends SpiritPlugin {
    /**
     * Set or get element id.
     * @param {string} [newid]
     * @returns {string|DOMPlugin}
     */
    id(newid) {
      const elm = this.element;

      if (arguments.length) {
        elm.id = newid;
      } else {
        return elm.id;
      }
    }
    /**
     * Get or set element title (tooltip).
     * @param {string} [newtitle]
     * @returns {string|DOMPlugin}
     */


    title(newtitle) {
      const elm = this.element;

      if (arguments.length) {
        elm.title = newtitle;
      } else {
        return elm.title;
      }
    }
    /**
     * Get or set element markup.
     * @param {string} [markup]
     * @param {string} [position]
     * @returns {string|DOMPlugin}
     */


    html(markup, position) {
      const elm = this.element;

      if (arguments.length) {
        DOMPlugin.html(elm, markup, position);
      } else {
        return DOMPlugin.html(elm);
      }
    }
    /**
     * Get or set element outer markup.
     * @param {string} [markup]
     * @returns {string|DOMPlugin}
     */


    outerHtml(markup) {
      const elm = this.element;

      if (arguments.length) {
        DOMPlugin.outerHtml(elm, markup);
      } else {
        return DOMPlugin.outerHtml();
      }
    }
    /**
     * Get or set element textContent.
     * @param {string} [string]
     * @returns {String|DOMPlugin}
     */


    text(value) {
      const elm = this.element;

      if (arguments.length) {
        DOMPlugin.text(elm, value);
      } else {
        return DOMPlugin.text(elm);
      }
    }
    /**
     * Empty spirit subtree.
     * @returns {DOMPlugin}
     */


    empty() {
      this.html('');
    }
    /**
     * Mark spirit invisible.
     * @returns {DOMPlugin}
     */


    hide() {
      this.spirit.css.add(CLASS_HIDDEN$1);
    }
    /**
     * Mark spirit visible.
     * @returns {DOMPlugin}
     */


    show() {
      this.spirit.css.remove(CLASS_HIDDEN$1);
    }
    /**
     * Get spirit element tag.
     * @returns {string}
     */


    tag() {
      return this.element.localName;
    }
    /**
     * Is positioned in page DOM? Otherwise plausible
     * createElement or documentFragment scenario.
     * @returns {boolean}
     */


    embedded() {
      return DOMPlugin.embedded(this.element);
    }
    /**
     * Removing this spirit from it's parent container. Note that this will
     * schedule destruction of the spirit unless it gets reinserted somewhere.
     * Also note that this method is called on the spirit, not on the parent.
     * TODO: Investigate support for `element.remove()` nowadays...
     */


    remove() {
      let parent = this.element.parentNode;
      parent.removeChild(this.element);
    }
    /**
     * Clone spirit element.
     * @returns {Element}
     */


    clone() {
      return this.element.cloneNode(true);
    }
    /**
     * Get ordinal index of element.
     * TODO: Support 'of-same-type' or something
     * @returns {number}
     */


    ordinal() {
      return DOMPlugin.ordinal(this.element);
    }
    /**
     * Compare the DOM position of this spirit against something else.
     * @see http://mdn.io/compareDocumentPosition
     * @param {Element|Spirit} other
     * @returns {number}
     */


    compare(other) {
      return DOMPlugin.compare(this.element, other);
    }
    /**
     * Contains other node or spirit?
     * @param {Node|Spirit} other
     * @returns {boolean}
     */


    contains(other) {
      return DOMPlugin.contains(this.element, other);
    }
    /**
     * Contained by other node or spirit?
     * @param {Node|Spirit} other
     * @returns {boolean}
     */


    containedBy(other) {
      return DOMPlugin.contains(other, this.element);
    }
    /**
     * @param {string} id
     * @param {Class<Spirit>} [type]
     * @returns {Element|Spirit}
     */


    guid(id, type) {
      const rootguid = this.spirit.$id;
      const selector = `[data-plastique-id=${rootguid}-${id}]`;
      const expanded = arguments.length > 1;
      return expanded ? this.q(selector, type) : this.q(selector);
    }
    /**
     * TODO: Some kind of `mapguids` method?
     * @param {Class<Spirit>} [type]
     * @returns {Array<Element>|Array<Spirit>}
     */


    guids(type) {
      const selector = '[data-plastique-id]';
      const expanded = arguments.length > 1;
      return expanded ? this.qall(selector, type) : this.qall(selector);
    }
    /**
     * Get first descendant element matching selector. Optional type argument returns
     * spirit for first element to be associated to spirit of this type. Note that
     * this may not be the first element to match the selector. Also note that type
     * performs slower than betting on <code>Spirit.get(this.dom.q(selector))</code>
     * @param {string} selector
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    q(selector, type) {
      return DOMPlugin.q(this.element, selector, type);
    }
    /**
     * Get list of all descendant elements that matches a selector. Optional type
     * arguments returns instead all associated spirits to match the given type.
     * @param {string} selector
     * @param {constructor} [type] Spirit constructor
     * @returns {Array<Element|Spirit>}
     */


    qall(selector, type) {
      return DOMPlugin.qall(this.element, selector, type);
    }
    /**
     * Same as q, but scoped from the document root. Use wisely.
     * @param {string} selector
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    qdoc(selector, type) {
      return DOMPlugin.qdoc(selector, type);
    }
    /**
     * Same as qall, but scoped from the document root. Use wisely.
     * @param {string} selector
     * @param {constructor} [type] Spirit constructor
     * @returns {Array<Element|Spirit>}
     */


    qdocall(selector, type) {
      return DOMPlugin.qdocall(selector, type);
    }
    /**
     * Next element or next spirit of given type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    next(type) {
      let result = null;
      let spirit = null;
      let el = this.element;

      if (type) {
        while ((el = el.nextElementSibling) !== null) {
          if (spirit = type.get(el)) {
            result = spirit;
            break;
          }
        }
      } else {
        result = el.nextElementSibling;
      }

      return result;
    }
    /**
     * Previous element or previous spirit of given type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    previous(type) {
      let result = null;
      let spirit = null;
      let el = this.element;

      if (type) {
        while ((el = el.previousElementSibling) !== null) {
          if (spirit = type.get(el)) {
            result = spirit;
            break;
          }
        }
      } else {
        result = el.previousElementSibling;
      }

      return result;
    }
    /**
     * First element or first spirit of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    first(type) {
      let result = null;
      let spirit = null;
      let el = this.element.firstElementChild;

      if (type) {
        while (result === null && el !== null) {
          if (spirit = type.get(el)) {
            result = spirit;
          }

          el = el.nextElementSibling;
        }
      } else {
        result = el;
      }

      return result;
    }
    /**
     * Last element or last spirit of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    last(type) {
      let result = null;
      let spirit = null;
      let el = this.element.lastElementChild;

      if (type) {
        while (result === null && el !== null) {
          spirit = type.get(el);

          if (spirit) {
            result = spirit;
          }

          el = el.previoustElementSibling;
        }
      } else {
        result = el;
      }

      return result;
    }
    /**
     * Parent parent or parent spirit of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    parent(type) {
      let spirit;
      let result = this.element.parentNode;

      if (type) {
        if (spirit = type.get(result)) {
          result = spirit;
        } else {
          result = null;
        }
      }

      return result;
    }
    /**
     * Child element or child spirit of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    child(type) {
      let result = this.element.firstElementChild;

      if (type) {
        result = this.children(type)[0] || null;
      }

      return result;
    }
    /**
     * Children elements or children spirits of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Array<Element|Spirit>}
     */


    children(type) {
      let result = [...this.element.children];

      if (type) {
        result = result.filter(el => {
          return type.get(el);
        }).map(el => {
          return type.get(el);
        });
      }

      return result;
    }
    /**
     * First ancestor element (parent!) or first ancestor spirit of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    ancestor(type) {
      let result = this.parent();

      if (type) {
        result = null;
        new Crawler().ascend(this.element, {
          onspirit(spirit) {
            if (type.is(spirit)) {
              result = spirit;
              return Crawler.STOP;
            }
          }

        });
      }

      return result;
    }
    /**
     * First ancestor elements or ancestor spirits of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Array<Element|Spirit>}
     */


    ancestors(type) {
      let result = [];
      let crawler = new Crawler();

      if (type) {
        crawler.ascend(this.element, {
          onspirit(spirit) {
            if (type.is(spirit)) {
              result.push(spirit);
            }
          }

        });
      } else {
        crawler.ascend(this.element, {
          onelement(el) {
            result.push(el);
          }

        });
      }

      return result;
    }
    /**
     * First descendant element or first descendant spirit of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Element|Spirit}
     */


    descendant(type) {
      let result = this.child();
      let me = this.element;

      if (type) {
        new Crawler().descend(me, {
          onspirit(spirit) {
            if (type.is(spirit)) {
              if (spirit.element !== me) {
                result = spirit;
                return Crawler.STOP;
              }
            }
          }

        });
      }

      return result;
    }
    /**
     * All descendant elements or all descendant spirits of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Array<Element|Spirit>}
     */


    descendants(type) {
      let result = [];
      let me = this.element;
      new Crawler().descend(me, {
        onelement(element) {
          if (!type && element !== me) {
            result.push(element);
          }
        },

        onspirit(spirit) {
          if (type && type.is(spirit)) {
            if (spirit.element !== me) {
              result.push(spirit);
            }
          }
        }

      });
      return result;
    }
    /**
     * Get following sibling elements or spirits of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Array<element|Spirit>}
     */


    following(type) {
      let result = [];
      let spirit;
      let el = this.element;

      while (el = el.nextElementSibling) {
        if (type) {
          if (spirit = type.get(el)) {
            result.push(spirit);
          }
        } else {
          result.push(el);
        }
      }

      return result;
    }
    /**
     * Get preceding sibling elements or spirits of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Array<element|Spirit>}
     */


    preceding(type) {
      let result = [];
      let spirit;
      let el = this.element;

      while (el = el.previousElementSibling) {
        if (type) {
          if (spirit = type.get(el)) {
            result.push(spirit);
          }
        } else {
          result.push(el);
        }
      }

      return result;
    }
    /**
     * Get sibling elements or spirits of type.
     * @param {constructor} [type] Spirit constructor
     * @returns {Array<element|Spirit>}
     */


    siblings(type) {
      return this.preceding(type).concat(this.following(type));
    }
    /**
     * Append spirit OR element OR array of either.
     * @param {Object} things Complicated argument
     * @returns {Object} Returns the argument
     */


    append(things) {
      let els = things;
      let element = this.element;
      els.forEach(el => {
        element.appendChild(el);
      });
      return things;
    }
    /**
     * Prepend spirit OR element OR array of either.
     * @param {Object} things Complicated argument
     * @returns {Object} Returns the argument
     */


    prepend(things) {
      let els = things;
      let element = this.element;
      let first = element.firstChild;
      els.reverse().forEach(el => {
        element.insertBefore(el, first);
      });
      return things;
    }
    /**
     * Insert spirit OR element OR array of either before this spirit.
     * @param {Object} things Complicated argument
     * @returns {Object} Returns the argument
     */


    before(things) {
      let els = things;
      let target = this.element;
      let parent = target.parentNode;
      els.reverse().forEach(el => {
        parent.insertBefore(el, target);
      });
      return things;
    }
    /**
     * Insert spirit OR element OR array of either after this spirit.
     * @param {Object} things Complicated argument
     * @returns {Object} Returns the argument
     */


    after(things) {
      let els = things;
      let target = this.element;
      let parent = target.parentNode;
      els.forEach(el => {
        parent.insertBefore(el, target.nextSibling);
      });
      return things;
    }
    /**
     * Replace the spirit with something else. This may nuke the spirit.
     * Note that this method is called on the spirit, not on the parent.
     * @param {Object} things Complicated argument.
     * @returns {Object} Returns the argument
     */


    replace(things) {
      this.after(things);
      this.remove();
      return things;
    }
    /**
     * Append spirit (element) to another spirit or element.
     * @param {Element|Spirit} thing
     * @returns {DOMPlugin}
     */


    appendTo(thing) {
      thing.appendChild(this.element);
      return this;
    }
    /**
     * Append spirit (element) as the first child of spirit or element.
     * @param {Element|Spirit} thing
     * @returns {DOMPlugin}
     */


    prependTo(thing) {
      thing.parentNode.insertBefore(this.element, thing.firstChild);
      return this;
    }
    /**
     * Insert spirit (element) before another spirit or element.
     * @param {object} thing
     * @returns {DOMPlugin}
     */


    insertBefore(thing) {
      thing.parentNode.insertBefore(this.element, thing);
      return this;
    }
    /**
     * Insert spirit (element) after another spirit or element.
     * @param {Element|Spirit} thing
     * @returns {DOMPlugin}
     */


    insertAfter(thing) {
      thing.parentNode.insertBefore(this.element, thing.nextSibling);
      return this;
    } // Static ....................................................................

    /**
     * Spiritual-aware innerHTML (WebKit first aid).
     * @param {Element} elm
     * @param {string} [markup]
     * @param {string} [pos]
     */


    static html(elm, markup, pos) {
      if (arguments.length > 1) {
        if (pos) {
          return elm.insertAdjacentHTML(pos, markup);
        } else {
          elm.innerHTML = markup;
        }
      } else {
        return elm.innerHTML;
      }
    }
    /**
     * Spiritual-aware outerHTML (WebKit first aid).
     * TODO: deprecate and support 'replace' value for position?
     * TODO: can outerHTML carry multiple root-nodes?
     * @param {Element} elm
     * @param {string} [markup]
     */


    static outerHtml(elm, markup) {
      if (arguments.length > 1) {
        elm.outerHTML = markup;
      } else {
        return elm.outerHTML;
      }
    }
    /**
     * Spiritual-aware textContent (WebKit first aid).
     * @param {Element} elm
     * @param {string} [html]
     * @param {string} [position]
     */


    static text(elm, value) {
      if (arguments.length > 1) {
        elm.textContent = value;
      } else {
        return elm.textContent;
      }
    }
    /**
     * Get ordinal position of element within container.
     * @param {Element} elm
     * @returns {number}
     */


    static ordinal(elm) {
      let result = 0;
      let parent = elm.parentNode;

      if (parent) {
        let node = parent.firstElementChild;

        while (node && node !== elm) {
          node = node.nextElementSibling;
          result++;
        }
      }

      return result;
    }
    /**
     * Compare document position of two nodes.
     *
     * @param {Node|Spirit} node1
     * @param {Node|Spirit} node2
     * @returns {number}
     */


    static compare(node1, node2) {
      node1 = normalize$2(node1);
      node2 = normalize$2(node2);
      return node1.compareDocumentPosition(node2);
    }
    /**
     * Node contains other node?
     * TODO: Just use `node.contains(othernode)` :)
     * @param {Node|Spirit} node
     * @param {Node|Spirit} othernode
     * @returns {boolean}
     */


    static contains(node, othernode) {
      let check = Node.DOCUMENT_POSITION_CONTAINS + Node.DOCUMENT_POSITION_PRECEDING;
      return this.compare(othernode, node) === check;
    }
    /**
     * Other node is a following sibling to node?
     * @param {Node|Spirit} node
     * @param {Node|Spirit} othernode
     * @returns {boolean}
     */


    static follows(node, othernode) {
      return this.compare(othernode, node) === Node.DOCUMENT_POSITION_FOLLOWING;
    }
    /**
     * Other node is a preceding sibling to node?
     * @param {Node|Spirit} node
     * @param {Node|Spirit} othernode
     * @returns {boolean}
     */


    static precedes(node, othernode) {
      return this.compare(othernode, node) === Node.DOCUMENT_POSITION_PRECEDING;
    }
    /**
     * Is node positioned in page DOM?
     * @param {Element|Spirit} node
     * @returns {boolean}
     */


    static embedded(node) {
      node = normalize$2(node);
      return this.contains(node.ownerDocument, node);
    }
    /**
     * Remove from list all nodes that are contained by others.
     * TODO: Move this to `spiritual-util` if not used nowhere.
     * @param {Array<Element|Spirit>} nodes
     * @returns {Array<Element|Spirit>}
     */


    static group(nodes) {
      let node;
      let groups = [];

      const containedby = (target, others) => {
        return others.some(other => DOMPlugin.contains(other, target));
      };

      while (node = nodes.pop()) {
        if (!containedby(node, nodes)) {
          groups.push(node);
        }
      }

      return groups;
    }
    /**
     * Sort nodes in document order.
     * @param {Array<Node>} nodes
     * @returns {Array}
     */


    static sort(nodes) {
      return nodes.sort(documentPositionComparator);
    }
    /**
     * Get first element that matches a selector.
     * Optional type argument filters to spirit of type.
     * @param {Node} node
     * @param {string} selector
     * @param {constructor} [type]
     * @returns {Element|Spirit}
     */


    static q(node, selector, type) {
      let result = null;

      if (type) {
        result = this.qall(node, selector, type)[0] || null;
      } else {
        result = node.querySelector(selector);
      }

      return result;
    }
    /**
     * Get list of all elements that matches a selector.
     * Optional type argument filters to spirits of type.
     * Method always returns a (potentially empty) array.
     * @param {Node} node
     * @param {string} selector
     * @param {constructor} [type]
     * @returns {Array<Element|Spirit>}
     */


    static qall(node, selector, type) {
      let result = Array.from(node.querySelectorAll(selector));

      if (type) {
        const has = elm => !!type.get(elm);

        const get = elm => type.get(elm);

        result = result.filter(has).map(get);
      }

      return result;
    }
    /**
     * Get first element in document that matches a selector.
     * Optional type argument filters to spirit of type.
     * @param {string} selector
     * @param {constructor} [type]
     * @returns {Element|Spirit}
     */


    static qdoc(selector, type) {
      return this.q(document, selector, type);
    }
    /**
     * Get list of all elements in document that matches a selector.
     * Optional type argument filters to spirits of type.
     * Method always returns a (potentially empty) array.
     * @param {string} selector
     * @param {constructor} [type]
     * @returns {Array<Element|Spirit>}
     */


    static qdocall(selector, type) {
      return this.qall(document, selector, type);
    }

  }, (_applyDecoratedDescriptor(_class$f.prototype, "id", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "id"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "title", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "title"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "html", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "html"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "outerHtml", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "outerHtml"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "text", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "text"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "empty", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "empty"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "hide", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "hide"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "show", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "show"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "remove", [chained], Object.getOwnPropertyDescriptor(_class$f.prototype, "remove"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "q", [query], Object.getOwnPropertyDescriptor(_class$f.prototype, "q"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "qall", [query], Object.getOwnPropertyDescriptor(_class$f.prototype, "qall"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "qdoc", [query], Object.getOwnPropertyDescriptor(_class$f.prototype, "qdoc"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "qdocall", [query], Object.getOwnPropertyDescriptor(_class$f.prototype, "qdocall"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "next", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "next"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "previous", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "previous"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "first", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "first"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "last", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "last"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "parent", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "parent"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "child", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "child"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "children", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "children"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "ancestor", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "ancestor"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "ancestors", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "ancestors"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "descendant", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "descendant"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "descendants", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "descendants"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "following", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "following"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "preceding", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "preceding"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "siblings", [lookup], Object.getOwnPropertyDescriptor(_class$f.prototype, "siblings"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "append", [insert], Object.getOwnPropertyDescriptor(_class$f.prototype, "append"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "prepend", [insert], Object.getOwnPropertyDescriptor(_class$f.prototype, "prepend"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "before", [insert], Object.getOwnPropertyDescriptor(_class$f.prototype, "before"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "after", [insert], Object.getOwnPropertyDescriptor(_class$f.prototype, "after"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "replace", [insert], Object.getOwnPropertyDescriptor(_class$f.prototype, "replace"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "appendTo", [insertme], Object.getOwnPropertyDescriptor(_class$f.prototype, "appendTo"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "prependTo", [insertme], Object.getOwnPropertyDescriptor(_class$f.prototype, "prependTo"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "insertBefore", [insertme], Object.getOwnPropertyDescriptor(_class$f.prototype, "insertBefore"), _class$f.prototype), _applyDecoratedDescriptor(_class$f.prototype, "insertAfter", [insertme], Object.getOwnPropertyDescriptor(_class$f.prototype, "insertAfter"), _class$f.prototype), _applyDecoratedDescriptor(_class$f, "html", [chained], Object.getOwnPropertyDescriptor(_class$f, "html"), _class$f), _applyDecoratedDescriptor(_class$f, "outerHtml", [chained], Object.getOwnPropertyDescriptor(_class$f, "outerHtml"), _class$f), _applyDecoratedDescriptor(_class$f, "text", [chained], Object.getOwnPropertyDescriptor(_class$f, "text"), _class$f)), _class$f);

  const _ref$1 = Environment.browser ? [Node.DOCUMENT_POSITION_FOLLOWING, Node.DOCUMENT_POSITION_PRECEDING, Node.DOCUMENT_POSITION_CONTAINS, Node.DOCUMENT_POSITION_CONTAINED_BY] : [],
        _ref2$1 = _slicedToArray(_ref$1, 4),
        FOLLOWING = _ref2$1[0],
        PRECEDING = _ref2$1[1],
        CONTAINS = _ref2$1[2],
        CONTAINED_BY = _ref2$1[3];
  /**
   * https://stackoverflow.com/questions/31991235/sort-elements-by-document-order-in-javascript
   * @param {Node} a
   * @param {Node} b
   * @returns {Number}
   */


  function documentPositionComparator(a, b) {
    const position = a.compareDocumentPosition(b);
    return a === b ? 0 : position & FOLLOWING || position & CONTAINED_BY ? -1 : position & PRECEDING || position & CONTAINS ? 1 : 0;
  }
  /**
   * DOM query methods accept a CSS selector and an optional spirit constructor
   * as arguments. They return a spirit, an element or an array of either.
   * @param {Object} target
   * @param {string} name
   * @param {Object} desc
   * @returns {Object}
   */


  function query(target, name, desc) {
    const base = desc.value;

    desc.value = function () {
      let selector = arguments[0];
      let type = arguments[1];

      if (isString(selector)) {
        if (arguments.length === 1 || isClass(type)) {
          return base.apply(this, arguments);
        } else {
          throw new TypeError(`Unknown spirit for query ${name}: (${selector}, ${typeOf(type)})`);
        }
      } else {
        throw new TypeError(`Bad selector for query ${name}: ${selector}`);
      }
    };

    return desc;
  }
  /**
   * DOM lookup methods accept an optional spirit constructor as argument.
   * These methods return a spirit, an element or an array of either.
   * @param {Object} target
   * @param {string} name
   * @param {Object} desc
   * @returns {Object}
   */


  function lookup(target, name, desc) {
    const base = desc.value;

    desc.value = function (type) {
      if (!isDefined(type) || isFunction(type)) {
        return base.apply(this, arguments);
      } else {
        throw new TypeError(`Unknown spirit for query ${name}: (${typeOf(type)})`);
      }
    };

    return desc;
  }
  /**
   * DOM insertion methods accept one argument: one spirit OR one element OR an array of either
   * or both. The input argument is returned as given, this allows for the following one-liner:
   * `this.something = this.dom.append(gui.SomeThingSpirit.summon()); // imagine 15 more`
   * TODO: Go for compliance with DOM4 method matches (something about textnoding string arguments)
   * TODO: Validate input either Spirit or element
   * TODO: DocumentFragment and friends :)
   * @param {Object} target
   * @param {string} name
   * @param {Object} desc
   * @returns {Object}
   */


  function insert(target, name, desc) {
    const base = desc.value;

    desc.value = function (things) {
      let elms = asarray(things).map(normalize$2);

      if (elms.length) {
        base.call(this, elms);
      }

      return things;
    };

    return desc;
  }
  /**
   * Bonus DOM insertion methods takes an element or spirit as argument.
   * @param {Object} target
   * @param {string} name
   * @param {Object} desc
   * @returns {Object}
   */


  function insertme(target, name, desc) {
    const base = desc.value;

    desc.value = function (thing) {
      thing = normalize$2(thing);

      if (isElement(thing)) {
        base.call(this, thing);
        return this;
      } else {
        throw new TypeError(`Expected spirit or element, got ${typeOf(thing)}`);
      }
    };

    return desc;
  }

  var _class$g;
  /**
   * Key.
   * TODO: Rename `add/remove` `on/off`
   * TODO: Broadcast global!
   */


  let Key$1 = (_class$g = class Key$$1 {
    /**
     * @param {boolean} down
     * @param {string} type
     * @param {boolean} isglobal
     */
    constructor(down, type, isglobal = false) {
      Object.assign(this, {
        down,
        type,
        isglobal
      }); // ...arguments ?
    } // Static ....................................................................

    /**
     * Add handler for tick.
     * @param {Object} type String or array of strings
     * @param {Object} handler
     * @returns {Constructor}
     */


    static add(type, handler) {
      add$1(type, handler);
    }
    /**
     * Remove handler for tick.
     * @param {Object} type String or array of strings
     * @param {Object} handler
     * @returns {Constructor}
     */


    static remove(type, handler) {
      remove$2(type, handler);
    }
    /**
     * Add auto-removing handler for tick.
     * @param {Object} type String or array of strings
     * @param {Object} handler
     * @returns {Constructor}
     */


    static one(type, handler) {
      add$1(type, handler, true);
    }

  }, (_applyDecoratedDescriptor(_class$g, "add", [chained], Object.getOwnPropertyDescriptor(_class$g, "add"), _class$g), _applyDecoratedDescriptor(_class$g, "remove", [chained], Object.getOwnPropertyDescriptor(_class$g, "remove"), _class$g), _applyDecoratedDescriptor(_class$g, "one", [chained], Object.getOwnPropertyDescriptor(_class$g, "one"), _class$g)), _class$g);
  /**
   * @type {Map<string, Set<IKeyHandler>}
   */

  const allhandlers$1 = new Mapping();
  /**
   * TODO!
   */

  const onehandlers$1 = new Mapping();
  /**
   *
   */

  const keymap = new Map();
  /**
   * Mapping DOM0 key codes to some DOM3 key values.
   * Note that keycodes aren't used on an API level.
   * @see http://www.w3.org/TR/DOM-Level-3-Events/#key-values
   * TODO: AltGraph CapsLoc Fn FnLock Meta Process NumLock SymbolLock OS Compose
   */

  const keys$1 = new Map([// navigation
  [38, 'Up'], [40, 'Down'], [37, 'Left'], [39, 'Right'], // modifiers
  [18, 'Alt'], [17, 'Control'], [16, 'Shift'], [32, 'Space'], // extras
  [27, 'Esc'], [13, 'Enter']]);
  let keycode = 0;
  /**
   * @param {string|Array<string>} type
   * @param {TickHandler} handler
   * @param {boolean} one
   */

  function add$1(type, handler, one) {
    asarray(type).forEach(t => {
      allhandlers$1.add(t, handler);

      if (one) {
        onehandlers$1.add(t, handler);
      }
    });

    if (allhandlers$1.size === 1) {
      listen(true);
    }
  }
  /**
   * @param {string|Array<string>} type
   * @param {TickHandler} handler
   */


  function remove$2(type, handler) {
    asarray(type).forEach(t => {
      allhandlers$1.remove(type, handler);
      onehandlers$1.remove(type, handler);
    });

    if (allhandlers$1.size === 0) {
      listen(false);
    }
  }
  /**
   * @param {boolean} on
   */


  function listen(on) {
    if (Environment.browser) {
      ['keydown', 'keypress', 'keyup'].forEach(type => {
        const args = [type, handleKey]; // TODO: capture true!

        if (on) {
          document.addEventListener(...args);
        } else {
          document.removeEventListener(...args);
        }
      });
    }
  }
  /**
   * Handle key event.
   * @param {KeyEvent} e
   */


  function handleKey(e) {
    let n = e.keyCode;
    let c = keymap.get(n);

    switch (e.type) {
      case 'keydown':
        if (c === undefined) {
          keycode = n;
          keymap.set(n, String.fromCharCode(e.which).toLowerCase());
          Tick.next(() => {
            c = keymap.get(n);
            update(true, null, c, n);
            keycode = null;
          });
        }

        break;

      case 'keypress':
        if (keycode) {
          c = keychar(e.keyCode, e.charCode, e.which);
          keymap.set(keycode, c);
        }

        break;

      case 'keyup':
        if (c !== undefined) {
          update(false, null, c, n);
          keymap.delete(n);
        }

        break;
    }
  }
  /**
   * Get character for event details on keypress only.
   * Returns null for special keys such as arrows etc.
   * http://javascript.info/tutorial/keyboard-events
   * @param {number} n
   * @param {number} c
   * @param {number} which
   * @returns {String}
   */


  function keychar(n, c, which) {
    if (which === null || which === undefined) {
      return String.fromCharCode(n); // IE (below 9 or what?)
    } else if (which !== 0 && c) {
      // c != 0
      return String.fromCharCode(which); // the rest
    }

    return null;
  }
  /**
   * @param {boolean} down
   * @param {String} key Newschool ABORTED FOR NOW!
   * @param {String} c (char) Bothschool
   * @param {number} code Oldschool
   */


  function update(down, key, c, code) {
    const type = keys$1.get(code) || c;
    const all = allhandlers$1;
    const one = onehandlers$1;

    if (all.has(type)) {
      const k = new Key$1(down, type); // TODO: pool this!

      all.toArray(type).filter(handler => {
        handler.onkey(k);
        return one.has(type, handler);
      }).forEach(handler => {
        all.remove(type, handler);
        one.remove(type, handler);
      });
    }
  }

  var _class$h;
  /**
   * Everything keyboard plugin.
   */


  let KeyPlugin = (_class$h = class KeyPlugin extends TrackerPlugin {
    /**
     * Add one or more key handlers.
     * @param {string|Array<string>} arg
     * @param {Object} [handler]
     * @returns {this}
     */
    on(type, handler = this.spirit) {
      asarray(type, t => {
        if (this._addchecks(t, [handler])) {
          Key$1.add(t, handler);
        }
      });
    }
    /**
     * Add one or more key handlers.
     * @param {string|Array<string>} arg
     * @param {Object} [handler]
     * @returns {this}
     */


    off(type, handler = this.spirit) {
      asarray(type, t => {
        if (this._removechecks(t, [handler])) {
          Key$1.remove(t, handler);
        }
      });
    }

  }, (_applyDecoratedDescriptor(_class$h.prototype, "on", [chained], Object.getOwnPropertyDescriptor(_class$h.prototype, "on"), _class$h.prototype), _applyDecoratedDescriptor(_class$h.prototype, "off", [chained], Object.getOwnPropertyDescriptor(_class$h.prototype, "off"), _class$h.prototype)), _class$h);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class$i;
  /*
   * Channeling default...
   * TODO: Don't do this!
   */


  let
  /**
   * Implement callback methods as expected by the plugins. At some point in
   * the future we should automatically do this via mixins (or traits) or at
   * least have the plugin validate that the required methods are implemented.
   */
  Spirit$1 = (_dec = channeling$2('gui-spirit'), _dec2 = plugin$1('att', AttPlugin), _dec3 = plugin$1('life', LifePlugin), _dec4 = plugin$1('broadcast', BroadcastPlugin), _dec5 = plugin$1('css', CSSPlugin), _dec6 = plugin$1('dom', DOMPlugin), _dec7 = plugin$1('event', EventPlugin), _dec8 = plugin$1('io', IOPlugin), _dec9 = plugin$1('key', KeyPlugin), _dec10 = plugin$1('script', ScriptPlugin), _dec11 = plugin$1('shadow', ShadowPlugin), _dec12 = plugin$1('tick', TickPlugin), _dec(_class$i = _dec2(_class$i = _dec3(_class$i = _dec4(_class$i = _dec5(_class$i = _dec6(_class$i = _dec7(_class$i = _dec8(_class$i = _dec9(_class$i = _dec10(_class$i = _dec11(_class$i = _dec12(_class$i = class Spirit$$1 extends Spirit {
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

  }) || _class$i) || _class$i) || _class$i) || _class$i) || _class$i) || _class$i) || _class$i) || _class$i) || _class$i) || _class$i) || _class$i) || _class$i);
  /**
   * Add support for "functional spirit" to eliminate the use of reserved keywords
   * `this`, `super`, `extends` and other such real or imagined leaky abstractions.
   * Also support multiple channelings via nested array structure (same structure
   * as used when populating a Map with entries).
   * @param {string|Array} tag
   * @param {Class<Spirit>|Function} [thing]
   * @param {Class<Spirit>} [parent]
   * @returns {Function|undefined}
   */

  function channeling$2(tag, thing, parent) {
    const decorates = arguments.length === 1;
    return Array.isArray(tag) ? tag.forEach(tag => channeling$2(...tag)) : decorates ? channeling$1(tag) : Spirit$1.is(thing) ? channeling$1(tag, thing) : thing.call && thing.apply ? channeling$1(tag, getclass(thing, parent)) : throwup('Expected function');
  } // Scoped ......................................................................

  /**
   * @param {string} message
   * @throws {TypeError}
   */


  function throwup(message) {
    throw new TypeError(message);
  }
  /**
   * TODO: `onevent` and other such plugin callbacks :/
   * Work in progress: Subclass is automatically shadowed by a lifcycle agent.
   * TODO: Clean this up! (`babel-plugin-transform-optional-chaining`)
   * TODO: Move this feature down into `dataplastique-gui` core package
   * TODO: Once we figure out how to declare expected callback methods in plugins,
   *       automatically call that method on agent whenever it is called on spirit.
   * TODO: We be nice to dynamically name the class after the function provided...
   * @param {Function} agent
   * @param {Class<Spirit>} [Parent]
   * @returns {Class<Spirit>}
   */


  function getclass(agent, Parent = Spirit$1) {
    const ag = 'SYMBOL_GOES_HERE'; // Symbol('agent') breaks Edge, but why???

    return class Anonymous extends Parent {
      constructor(...args) {
        super(...args);
        this.displayName = agent.name || 'Anonymous';
      } // TODO: nonenumerable


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

  /**
   * Document base.
   */

  class DocModel extends Model {
    static model() {
      return {
        type: String
      };
    }

  }

  /**
   * JavaScript document.
   */

  class JSDocModel extends DocModel {
    constructor(...args) {
      super(...args);
      this.type = 'text/javascript';
    }

    static model() {
      return {
        title: String,
        chapters: Collection$1.$of(ChapterModel)
      };
    }

  } // Scoped ......................................................................

  /**
   * Hello.
   */

  class ChapterModel extends Model {
    static model() {
      return {
        title: String,
        tabs: String,
        sections: Collection$1.$of(SectionModel)
      };
    }

  }
  /**
   * Hello.
   */


  class SectionModel extends Model {
    static model() {
      return {
        line: Number,
        tabs: String,
        head: String,
        desc: String,
        code: String,
        tags: Collection$1.$of(TagModel)
      };
    }

  }
  /**
   * Modelling a JSDoc `@whatever` statement.
   */


  class TagModel extends Model {
    static model() {
      return {
        text: String,
        desc: String,
        name: String,
        type: String
      };
    }

  }

  /**
   * Markdown document.
   */

  class MDDocModel extends DocModel {
    constructor(...args) {
      super(...args);
      this.type = 'text/markdown';
    }

    static model() {
      return {
        title: String,
        markup: String
      };
    }

  }

  /**
   * EDBML document.
   */

  class EDBMLDocModel extends JSDocModel {
    constructor(...args) {
      super(...args);
      this.type = 'text/edbml';
    }

  }

  /**
   * Base model for files and folders.
   * @see {FileModel}
   * @see {FolderModel}
   */

  class NodeModel extends Model {
    /**
     * Interface.
     * @returns {Object}
     */
    static model() {
      return {
        name: String,
        result: Boolean,
        focused: Boolean,
        $parent: NodeModel
      };
    }
    /**
     * Previous sibling.
     * @returns {NodeModel}
     */


    prev() {
      return this.sibling(-1);
    }
    /**
     * Next sibling.
     * @returns {NodeModel}
     */


    next() {
      return this.sibling(+1);
    }
    /**
     * Sibling at relative index.
     * @param {number} index
     * @returns {NodeModel}
     */


    sibling(index) {
      if (this.$parent) {
        let siblings = this.$parent.nodes;
        let i = siblings.indexOf(this);
        let n = siblings[i + index];
        return n || null;
      }

      return null;
    }

  }

  /**
   * File model.
   */

  class FileModel extends NodeModel {
    /**
     * Interface.
     * @returns {Object}
     */
    static model() {
      return {
        src: String,
        // file location
        type: String,
        // file type (extension)
        what: String,
        // file name minus extension assumed to be 'what' the file is (???)
        selected: Boolean
      };
    }
    /**
     * Filename matches term? Used in search.
     * @param {String} term
     * @return {boolean}
     */


    matches(term) {
      return this.name.toLowerCase().includes(term.trim().toLowerCase());
    }
    /**
     * Compute CSS classname.
     * @returns {String}
     */


    classname() {
      return 'file' + (this.selected ? ' selected' : '') + (this.focused ? ' focused' : '');
    }

  }

  /**
   * Folder model.
   */

  class FolderModel extends NodeModel {
    /**
     * Interface.
     * @returns {Object}
     */
    static model() {
      return {
        open: Boolean,
        filenames: String,
        // Listing filesnames in this AND descendant folders.
        nodes: Collection$1.$of(json => json.nodes ? FolderModel : FileModel)
      };
    }
    /**
     * Stamp reverse relationships.
     */


    onconstruct() {
      super.onconstruct();
      this.nodes.forEach(node => node.$parent = this);
      this.open = false; // TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
    /**
     * Search for filesname in this and descendant folders.
     * @param {String} term
     * @return {boolean}
     */


    matches(term) {
      return this.filenames.includes(term.trim().toLowerCase());
    }
    /**
     * Compute CSS classname.
     * @returns {string}
     */


    classname() {
      return 'folder' + (this.open ? ' open' : '') + (this.focused ? ' focused' : '');
    }

  }

  /**
   * Tree model.
   */

  class TreeModel extends FolderModel {
    /**
     * Interface.
     * @returns {Object}
     */
    static model() {
      return {
        search: String,
        focusnode: NodeModel,
        selectednode: NodeModel
      };
    }
    /**
     * Hello.
     */


    onconstruct() {
      super.onconstruct();
      this.search = '';
      this.addObserver(this);
    }
    /**
     * Set default focus while searching.
     * @param {Model} model
     * @param {string} name
     * @param {*} newval
     * @param {*} oldval
     */


    onpoke(model, name, newval, oldval = '') {
      if (name === 'search') {
        newval = newval.trim();
        oldval = oldval.trim();

        if (newval.length !== oldval.length) {
          this.search = newval;
        } else {
          this._focusdefault(newval);
        }
      }
    }
    /**
     * Focus node to match current document.
     * @param {String} src
     * @returns {this}
     */


    onload(src) {
      let node;

      if (src && (node = node = this._getnode(src))) {
        this._select(node);

        this._focus(node);
      }

      return this;
    }
    /**
     * On navigation key pressed, move focus to next node.
     * @param {String} key
     */


    movefocus(key) {
      let next = this._nextfocus(key, this.focusnode);

      if (next) {
        this._focus(next);
      }
    } // Private ...................................................................

    /**
     * Set selected node. Unselect old node.
     * @param {NodeModel} newnode
     */


    _select(newnode) {
      let oldnode;

      if (oldnode = this.selectednode) {
        oldnode.selected = false;
      }

      this.selectednode = newnode;
      newnode.selected = true;
    }
    /**
     * Set focused node. Unfocus old node.
     * @param {NodeModel} newnode
     */


    _focus(newnode) {
      let oldnode;

      if (oldnode = this.focusnode) {
        oldnode.focused = false;
      }

      if (this.focusnode = newnode || null) {
        newnode.focused = true;

        while (newnode = newnode.$parent) {
          newnode.open = true;
        }
      }
    }
    /**
     * @param {string} query
     */


    _focusdefault(query) {
      let files = this._matchingfiles(query);

      if (files.indexOf(this.focusnode) === -1) {
        this._focus(files[0]);
      }
    }
    /**
     * Find next node. Somewhat recursively if there's a search going on.
     * @param {String} key
     * @param {NodeModel} node
     * @returns {NodeModel}
     */


    _nextfocus(key, node) {
      let next;
      let nodes;
      let q = this.search;

      const isopen = node => node.nodes && (node.open || q && node.matches(q));

      const hasnodes = node => node.nodes && node.nodes.length;

      const hasparent = node => node.$parent && node.$parent !== this;

      switch (key) {
        case 'Up':
          if (next = node.prev()) {
            while (isopen(next) && hasnodes(next)) {
              nodes = next.nodes;
              next = nodes[nodes.length - 1];
            }
          } else if (hasparent(node)) {
            next = node.$parent;
          }

          break;

        case 'Down':
          if (isopen(node)) {
            next = node.nodes[0];
          } else {
            next = node.next();

            while (!next && hasparent(node)) {
              next = node.$parent.next();
              node = node.$parent;
            }
          }

          break;

        case 'Left':
          if (node.nodes && isopen(node)) {
            node.open = false;
          }

          break;

        case 'Right':
          if (node.nodes && !isopen(node)) {
            node.open = true;
          }

          break;
      }

      if (next && q) {
        if (!next.matches(q)) {
          next = this._nextfocus(key, next);
        }
      }

      return next;
    }
    /**
     * Get node for src.
     * @todo Probably index this once
     * @param {String} src
     * @returns {NodeModel}
     */


    _getnode(src) {
      let hit = null;

      (function search(folder) {
        folder.nodes.every(node => {
          if (node.src === src) {
            hit = node;
          } else if (node.nodes) {
            search(node);
          }

          return !hit;
        });
      })(this);

      return hit;
    }
    /**
     * @param {string} query
     * @returns {Array<NodeModel>}
     */


    _matchingfiles(query) {
      let files = [];

      (function index(folder) {
        folder.nodes.forEach(node => {
          if (node.nodes) {
            index(node);
          } else if (node.matches(query)) {
            files.push(node);
          }
        });
      })(this);

      return files;
    }

  }

  /**
   * @type {Map<string, Object>}
   */

  let docs = null;
  /**
   * @type {TreeModel}
   */

  let tree = null;
  /**
   * @param {Spirit} spirit
   * @param {EventPlugin} spirit.event
   */

  function RootSpirit() {
    const hash = (location.hash || '#').slice(1);
    fetch('index.json').then(response => {
      if (response.ok) {
        addEventListener('hashchange', () => {
          load(location.hash.slice(1));
        });
        response.json().then(json => {
          docs = new Map(Object.entries(json.docs));
          tree = new TreeModel(json.tree).onload(hash).output();
        }).then(() => {
          if (hash) {
            load(hash);
          }
        }).catch(x => {
          console.error(x);
        });
      } else {
        throw new Error('Wrong answer', e.message);
      }
    });
  } // Scoped ......................................................................

  /**
   * Instruct the Tree to update the position and then output the relevant data
   * as a {Document}. Unless it's the first rendering, we break this up with a
   * timeout for instant feedback in the tree (in case syntax hiliting is slow).
   * TODO: Handle 404 somewhat more elegantly here
   * @param {String} path
   */

  function load(path) {
    const success = docs.has(path);
    document.title = `Docs — ${success ? name(path) : 404}`;

    if (success) {
      tree.onload(path);

      function output() {
        const json = docs.get(path);
        new (model(json))(json).output();
      }

      if (load.next) {
        setTimeout(output, 10);
      } else {
        load.next = true;
        output();
      }
    } else {
      console.error(404, path);
    }
  }
  /**
   * Get approriate model for given data.
   * @param {object} json
   * @returns {Constructor}
   */


  function model(json) {
    return {
      'text/javascript': JSDocModel,
      'text/edbml': EDBMLDocModel,
      'text/markdown': MDDocModel
    }[json.type];
  }
  /**
   * Produce file name from full path.
   * @param {string} path
   * @returns {string}
   */


  function name(path) {
    let cuts = path.split('/');
    let name = cuts.pop() || '';

    if ((cuts = name.split('.')).length) {
      cuts.pop();
    }

    return cuts.join('.');
  }

  function edbml (tree) {
    const out = output$2();

    if (tree) {
      out`<header guid="header">`;
      renderHeader(tree);
      out`</header><nav guid="nav">`;
      renderNodes(tree.nodes, tree.search);
      out`</nav>`;
    }

    return out();
  }

  function renderHeader(tree) {
    const out = output$2();
    const df0 = out.arrghs((e, value, checked) => tree.search = value);
    out`<form><input placeholder="Search filename" guid="search" type="text" autocomplete="off" spellcheck="false" value="${tree.search}" data-plastique-on="input:${df0}"/></form><menu><li><button class="icon icon-sidebar" title="Toggle SideBar"></button></li></menu>`;
  }

  function renderNodes(nodes, search) {
    const out = output$2();

    const visible = node => !search || node.matches(search);

    const present = node => renderNode(node, search);

    out`<ul>`;
    nodes.filter(visible).forEach(present);
    out`</ul>`;
  }

  function renderNode(node, search) {
    const out = output$2();
    out`<li guid="${node.$id}" class="${node.classname()}">`;

    switch (node.constructor.name) {
      case "FileModel":
        out`<a class="label" href="#${node.src}">${node.name}</a>`;
        break;

      case "FolderModel":
        const df1 = out.arrghs(e => node.open = !node.open);
        out`<span guid="${node.$id}-span" class="label" data-plastique-on="click:${df1}">${node.name}</span>`;

        if (search || node.open) {
          renderNodes(node.nodes, search);
        }

        break;
    }

    out`</li>`;
  }

  /**
   * Spirit of the file navigator.
   * @param {Spirit} spirit
   * @param {IOPlugin} spirit.io
   * @param {ScriptPlugin} spirit.script
   */

  function TreeSpirit({
    io,
    script
  }) {
    script.load(edbml);
    io.on(TreeModel, tree => {
      script.run(tree);
    });
  }
  /*
   * BACKUP KEYBOARD NAVIGATION STUFF!
   *
  export default class TreeSpirit extends Spirit {
  	/**
  	 * Script ran.
  	 * @param {Object} log
  	 *
  	onrun(log) {
  		super.onrun(log);
  		if (log.first) {
  			this.event
  				.on('click')
  				.on('click keypress keydown', document.body)
  				.on('focus', this.dom.q('input'));
  		}
  	}

  	/**
  	 * Handle event.
  	 * @param {Event} e
  	 *
  	onevent(e) {
  		super.onevent(e);
  		switch (e.type) {
  			case 'focus':
  				if (!this._open) {
  					this._toggle();
  				}
  				break;
  			case 'click':
  				if (e.currentTarget === document.body) {
  					this._toggle();
  				} else {
  					e.stopPropagation();
  				}
  				break;
  			case 'keydown':
  				this._onkeydown(e);
  				break;
  			case 'keypress':
  				this._onkeypress(e);
  				break;
  		}
  	}

  	/**
  	 * Handle key.
  	 * @param {Key} k
  	 *
  	onkey(k) {
  		super.onkey(k);
  		const node = this._tree.focusnode;
  		if (node && k.down) {
  			console.log(k.type);
  			switch (k.type) {
  				case 'Up':
  				case 'Down':
  				case 'Left':
  				case 'Right':
  					this._tree.movefocus(k.type);
  					break;
  				case 'Enter':
  					if (node.src) {
  						this.tick.time(() => {
  							location.hash = node.src;
  						});
  					} else {
  						this._tree.movefocus(node.open ? 'Left' : 'Right');
  					}
  					break;
  				case 'Esc':
  					this.dom.q('input').blur();
  					this._toggle();
  					break;
  			}
  		}
  	}

  	// Private ...................................................................

  	/**
  	 * Open and close the navigator.
  	 *
  	_toggle() {
  		console.log(Math.random());
  		this.tick.next(() => {
  			this._shiftthings(this._open);
  		});
  	}

  	/**
  	 * Launch search and focus the search field.
  	 * @param {string} [term] - Optional search term
  	 *
  	_search(term) {
  		const input = this.dom.guid('search');
  		input.value = term.trim();
  		input.focus();
  	}

  	/**
  	 * Shift things on and off.
  	 * @param {boolean} on
  	 *
  	_shiftthings(on) {
  		this.event.shift(on, 'click', document.body);
  		this.key.shift(on, 'Up Down Left Right Enter Esc');
  		this.css.shift(on, 'on');
  	}

  	/**
  	 * Handle keydown event. Prevent default scrolling while navigator open.
  	 * @param {KeyEvent} e
  	 *
  	_onkeydown(e) {
  		if (this._open) {
  			switch (e.keyCode) {
  				case 37:
  				case 38:
  				case 39:
  				case 40:
  				case 13:
  					e.preventDefault();
  					break;
  			}
  		}
  	}

  	/**
  	 * Handle keypress event. Character key will open the navigator
  	 * @param {KeyEvent} e
  	 *
  	_onkeypress(e) {
  		const SPACE = 32;
  		const alpha = this._keychar(e.keyCode, e.charCode, e.which);
  		if (!this._open) {
  			if (alpha || e.keyCode === SPACE) {
  				this._search(alpha || '');
  			}
  		}
  	}

  	/**
  	 * Get character for key event or `null`
  	 * for special keys such as arrows etc.
  	 * TODO: Remove old browser support here!
  	 * @param {number} n
  	 * @param {number} c
  	 * @param {number} which
  	 * @return {String}
  	 *
  	_keychar(n, c, which) {
  		if (which === null || which === undefined) {
  			return String.fromCharCode(n);
  		} else if (which !== 0 && c) {
  			return String.fromCharCode(which);
  		}
  		return null;
  	}
  }
  */

  const indent$1 = html => html.replace(/^(\s+)/, '<span class="indent">$1</span>');

  const inline = html => `<span class="line">${html}</span>`;
  /**
   * The highlighter. There can be only one.
   * @param {string} type
   * @returns {Function}
   */


  function hilite(type) {
    return code => format$2(Prism.highlight(code.trimRight(), lookup$1(type)));
  } // Scoped ......................................................................

  /**
   * Get highlighter for file type.
   * @param {string} type
   * @returns {Function}
   */

  function lookup$1(type) {
    switch (type) {
      case 'text/javascript':
        return Prism.languages.javascript;

      case 'text/edbml':
        return Prism.languages.jsx;

      default:
        return Prism.languages.text;
    }
  }
  /**
   * Line art formatting.
   * - Wrap leading whitespace in `span.indent` (so we can style it)
   * - Wrap each individual line in `span.line` (to control lineheight)
   * @param {string} html
   * @returns {string}
   */


  function format$2(html) {
    return html.split('\n').map(indent$1).map(inline).join('');
  }

  const converter = new showdown.Converter({
    simplifiedAutoLink: true
  });
  /**
   * Convert Markdown to markup.
   * @param {string} markdown
   * @returns {string}
   */

  function markup(markdown) {
    return converter.makeHtml(markdown || '');
  }

  function edbml$1 (doc) {
    const out = output$2();
    out`<article>`;

    if (doc) {
      out`<h1>${doc.title}</h1>`;
      const syntax = hilite(doc.type);

      switch (doc.type) {
        case "text/javascript":
        case "text/edbml":
          renderScript(doc, syntax);
          break;
      }
    }

    out`</article>`;
    return out();
  }

  function renderScript({
    chapters
  }, syntax) {
    const out = output$2();
    chapters.forEach(renderChapter);

    function renderChapter({
      title,
      sections,
      tabs
    }) {
      if (title) {
        renderSection({
          desc: "## " + title,
          tabs
        });
      }

      sections.forEach(renderSection);
    }

    function renderSection({
      desc,
      code,
      tags,
      line,
      tabs
    }) {
      out["data-line"] = line;
      out`<section ${out["data-line"]}><div class="docs"><div class="desc">`;
      out(markup(desc));
      out`</div>`;
      renderTags(tags);
      out`</div><div class="code"><code>`;
      out(code ? syntax(code) : "");
      out`<span class="indent">`;
      out(tabs);
      out`</span></code></div></section>`;
    }

    function renderTags(tags) {
      if (tags && tags.length) {
        out`<ol class="tags">`;
        tags.forEach(renderTag);
        out`</ol>`;
      }
    }

    function renderTag({
      name,
      type,
      desc,
      text
    }) {
      out`<li class="tag"><span class="name">${name}</span>`;

      if (type) {
        out`<span class="type">${type}</span>`;
      }

      if (desc) {
        out`<span class="desc">`;
        out(markup(desc));
        out`</span>`;
      }

      if (text) {
        out`<span class="text">`;
        out(markup(text));
        out`</span>`;
      }

      out`</li>`;
    }
  }

  /**
   * @param {Spirit} spirit
   * @param {ScriptPlugin} spirit.script
   * @param {IOPlugin} spirit.io
   * @param {DOMPlugin} spirit.dom
   * @param {Element} spirit.element
   * @returns {Object}
   */

  function CodeSpirit({
    script,
    io,
    dom,
    element
  }) {
    return {
      onattach() {
        script.load(edbml$1);
        io.on({
          MDDocModel,
          EDBMLDocModel,
          JSDocModel
        }, doc => {
          script.run(doc);
        });
      },

      onrun() {
        element.scrollTop = 0;

        if (!lineart.done) {
          lineart(dom.q('.code code'));
        }
      }

    };
  } // Scoped ......................................................................

  /**
   * Compute `background-image` for `span.indent` to render indent-level lines.
   * @param {HTMLCodeElement} code
   */

  function lineart(code) {
    if (code) {
      addrule(getrule(getresolver(code)));
      lineart.done = true;
    }
  }
  /**
   * Get CSS declaration resolver.
   * @param {HTMLCodeElement} code
   * @returns {Function}
   */


  function getresolver(code) {
    const props = getComputedStyle(code, null);

    const getit = name => props.getPropertyValue(name);

    return name => getit(name) || getit('-moz-' + name);
  }
  /**
   * Compute and inject CSS rule.
   * @param {Function} resolve
   * @returns {string}
   */


  function getrule(resolve) {
    return `.indent, .code code:after { background: url("${draw(fontshorthand(resolve), decorationals(resolve))}"); }`;
  }
  /**
   * Adding new CSS rule.
   * TODO: In theme sheet!
   * TODO: On theme change!
   * @param {string} rule
   */


  function addrule(rule) {
    const sheet = document.styleSheets[0];
    sheet.insertRule(rule, sheet.cssRules.length);
  }
  /**
   * Draw the line art as Base64.
   * @param {string} font
   * @returns {string}
   */


  function draw(font, [linecolor, tabsize]) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;

    (tabwidth => {
      canvas.height = 100;
      canvas.width = tabwidth * tabsize;
      context.fillStyle = linecolor;
      context.fillRect(0, 0, 1, 100);
    })(context.measureText('\t').width);

    return canvas.toDataURL('image/png');
  }
  /**
   * Resolve typography shorthand.
   * @param {Function} resolve
   * @returns {string}
   */


  function fontshorthand(resolve) {
    return ['font-weight', 'font-style', 'font-size', 'font-family'].map(resolve).join(' ');
  }
  /**
   * Resolve tab size and line color (`border-left-color`
   * has been hijacked to control the line art color).
   * @param {Function} resolve
   * @returns {Array<string>}
   */


  function decorationals(resolve) {
    return ['border-left-color', 'tab-size'].map(resolve);
  }

  /**
   * Boot everything.
   */

  function boot$1() {
    channeling$2([['docs-root', RootSpirit], ['docs-tree', TreeSpirit], ['docs-code', CodeSpirit]]);
    boot(...arguments);
  }

  exports.boot = boot$1;

  return exports;

}({}));
