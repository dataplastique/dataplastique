import Type from './Type';

/**
 * @deprecated
 * @returns {Function}
 */
export function confirm(...types) {
	return function(target, name, descriptor) {
		return descriptor;
	};
}

/**
 * Confirm type of arguments.
 * Takes an array of strings.
 * TODO: Only in debug mode?
 * TODO: Support confirm truthy!
 * @returns {Function}
 *
function confirm(...types) {
	return function(target, name, descriptor) {
		let base = descriptor.value;
		descriptor.enumarable = false;
		descriptor.value = function() {
			let args = arguments;
			if (ok(args, types)) {
				return base.apply(this, args);
			} else {
				throw new TypeError(geterror(target, name, args, types));
			}
		};
		return descriptor;
	};
}

// Scoped ......................................................................

const WILDCARD = '*';
const UNDEFINED = 'undefined';
const STRING = 'string';

/**
 * No polyfills here.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 *
const startsWith = (a, b) => a.indexOf(b) === 0;

/*
 * TODO: Make this extensible.
 * @type {Object<string, function>}
 *
let fixtypes = {
	node: arg => arg && arg.nodeType,
	constructor: arg => arg && Type.isConstructor(arg),
	element: arg => arg && arg.nodeType === Node.ELEMENT_NODE,
	spirit: arg => arg && arg.$instanceid && arg.element // uarg!
};

/**
 * TODO: at some point, return true unless in development mode.
 * @param {Object} args
 * @param {Array<string>} types
 * @returns {boolean}
 *
function ok(args, types) {
	return types.every((type, index) => matches(type, args[index], index));
}

/**
 * Check if argument matches expected type (very basic support here).
 * @param {string} xpect
 * @param {Object} arg
 * @param {number} index
 * @param {Array} [report]
 * @returns {boolean}
 *
function matches(xpect, arg, index, report = null) {
	let needs = !startsWith(xpect, '(');
	let split = xtract(xpect, !needs).split('|');
	let fixed = fixtypes[xpect];
	let input = Type.of(arg);
	let match =
		arg === WILDCARD ||
		(fixed && fixed(arg)) ||
		(!needs && input === UNDEFINED) ||
		(!needs && split.indexOf(WILDCARD) > -1) ||
		split.indexOf(input) > -1;
	if (report && !match) {
		if (input === STRING) {
			arg = `"${arg}"`;
		}
		report = report.concat([index, xpect, input, arg]);
	}
	return report || match;
}

/**
 * Extract expected type of (optional) argument.
 * @param {string} xpect
 * @param {boolean} optional
 * @returns {string}
 *
function xtract(xpect, optional) {
	return optional ? xpect.slice(1, -1) : xpect;
}

/**
 * TODO: How would `target.constructor` turn out when decorating static method?
 * @param {Function} target (constructor)
 * @param {string} name
 * @param {Object} args
 * @param {Array} types
 * @returns {string}
 *
function geterror(target, name, args, types) {
	let rep = getreport(args, types);
	let con = target.constructor;
	let own = con === Function ? target.name : con.name;
	return (
		`${own}.${name} arguments[${rep.shift()}] ` +
		`expected ${rep.shift()}, got ${rep.shift()}: ${rep.shift()}`
	);
}

/**
 * @param {Object} args
 * @param {Array} types
 * @returns {Array<string>}
 *
function getreport(args, types) {
	return types.reduce((result, type, i) => {
		let params = [type, args[i], i];
		let report = [];
		if (!result && !matches(...params)) {
			result = matches(...params, report);
		}
		return result;
	}, null);
}
*/
