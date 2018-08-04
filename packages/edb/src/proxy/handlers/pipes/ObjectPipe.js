import getvalidator from './Validators';
import getconverter from './Converters';
import { typeOf } from '@dataplastique/util';
import { IMap, ISet, ISeq, immutable, isImmutable } from '@dataplastique/util';

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
export default function getObjectPipe(Proto) {
	return pipes.has(Proto)
		? pipes.get(Proto)
		: do {
				const pipe = resolve(Proto);
				pipes.set(Proto, pipe);
				pipe;
		  };
}

// Scoped ......................................................................

const isnull = val => val === null;
const isimap = val => IMap.isMap(val);
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
const blank = new IMap();

/**
 * @param {Class<Proto>} Proto
 * @param {IMap|null} [map]
 * @returns {Object|null}
 */
function resolve(Proto, map = ancestors(Proto).reduce(mapping)) {
	return isnull(map)
		? map
		: isimap(map)
			? buildpipe(Proto, map)
			: failpipe(Proto, map);
}

/**
 * List class hierarchy starting from the top (Proto itself).
 * @param {Class<Proto>} Proto
 * @param {Array<Class<Proto>>} [list]
 * @returns {Array<Class<Proto>>}
 */
function ancestors(Proto, list = [Proto]) {
	return (Proto = Object.getPrototypeOf(Proto)).isProtoConstructor
		? ancestors(Proto, list.concat(Proto))
		: list.reverse();
}

/**
 * @param {IMap|null} oldmap
 * @param {Class<Proto>} Proto
 * @returns {IMap|null}
 */
function mapping(oldmap, Proto) {
	return imaps.has(Proto)
		? imaps.get(Proto)
		: do {
				const symbol = Symbol.for('@dataplastique/objectpipe');
				const object = Proto[symbol](oldmap || blank);
				const newmap = deepfreeze(object, oldmap || blank);
				imaps.set(Proto, newmap);
				newmap;
		  };
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
	return isnull(newmap)
		? newmap
		: isimap(newmap)
			? newmap.map(frozen)
			: isobjt(newmap)
				? oldmap.merge(newmap).map(frozen)
				: newmap;
}

/**
 * Recursively transform objects and arrays to immutable Maps and Sets.
 * @param {*} js - String, Number, Boolean but also Objects and Arrays.
 * @returns {*} - Returns an immutable structure
 */
function frozen(js) {
	return !isobjt(js) || isnull(js) || isImmutable(js)
		? js
		: islist(js)
			? toiset(ISeq(js).map(frozen))
			: toimap(ISeq(js).map(frozen));
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
			return getvalidator(value)(input)
				? getconverter(value)(input)
				: throwinvalid(Proto, key, input, value);
		});
		return pipe;
	}, {});
}

// Failures ....................................................................

/**
 * The `static model` method returned something bad.
 * TODO: Method name 'model()' has been hardcoded!
 * @param {Constructor} Proto
 * @param {*} pipe
 * @throws {TypeError}
 */
function failpipe(Proto, pipe) {
	throw new TypeError(
		`${Proto.name}.model() returned ${typeOf(pipe)}, expected IMap|Object|null`
	);
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
	const want = ISet.isSet(cons) ? list(cons) : name(cons);
	const fail = failedtype(input);
	const clas = name(Proto);
	throw new TypeError(
		`Bad assignment to ${clas}.${key}: Expected ${want}, got ${fail}.`
	);
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
