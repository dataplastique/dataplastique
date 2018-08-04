import step1 from './step1';
import step2 from './step2';
import step3 from './step3';
import step4 from './step4';
import callsite from 'callsite';
import path from 'path';
import glob from 'glob';
import fs from 'fs';

/**
 * @param {string|Array<string>} targets
 * @param {Object} [options]
 * @returns {Array<string>}
 */
export function compile(targets, options = {}) {
	const base = getsource(callsite());
	const list = gettargets(targets, base);
	const code = transform(list, options);
	return [...code].map(entry => write(...entry));
}

// Scoped ......................................................................

const stats = target => fs.lstatSync(target);
const exists = target => fs.existsSync(target);
const isfolder = target => exists(target) && stats(target).isDirectory();
const isfile = target => exists(target) && stats(target).isFile();
const isglob = target => !isfolder(target) && !isfile(target);
const getfiles = folder => glob.sync(path.normalize(folder + '/**/*.edbml'));

/**
 * Resolve to list of files (not folders).
 * TODO: Support glob *.edbml (files not folders), perhaps ONLY support globs?
 * @param {string|Array<string>} targets
 * @param {string} base
 * @returns {Array<string>}
 */
function gettargets(targets, base) {
	targets = makearray(targets);
	const folders = targets.filter(isfolder);
	const files = targets.filter(isfile);
	const globs = targets.filter(isglob);
	globs.forEach(pattern => files.push(...getfiles(glob.sync(pattern))));
	folders.forEach(folder => files.push(...getfiles(folder)));
	return makeabsolute([...new Set(files)], base);
}

/**
 * Mapping filenames to compiled JS code.
 * @param {Array<string>} files
 * @param {Object} options
 * @returns {Map<string, string>}
 */
function transform(files, options) {
	const map = new Map();
	const ext = options.extname || '.edbml.js';
	options = prettier(options);
	files.forEach(file => {
		const target = basename(file) + ext;
		const jscode = parse(read(file), options);
		if (jscode instanceof Error) {
			fail(jscode, file, read(file));
		} else {
			map.set(target, jscode);
		}
	});
	return map;
}

/**
 * Log the failed file for inspection before we exit miserably.
 * Note that we log the raw EDBML file and not the pre-processed
 * JS that would have actually triggered the error (via "step1.js").
 * @param {Error} error
 * @param {string} file
 * @param {string} edbml
 */
function fail(error, file, edbml) {
	console.log(`${error.message} in "${file}"\n`);
	console.log(
		edbml
			.split('\n')
			.map((line, i) => {
				return padStart(i + 1, 3, 0) + '   ' + line;
			})
			.join('\n')
	);
	process.exit(1);
}

/**
 * TODO: Replace with native `string.padStart` at some point.
 * @param {string|number} string
 * @param {number} target
 * @param {string|number} [fill]
 * @returns {string}
 */
function padStart(string, target, fill = ' ') {
	string = String(string);
	target = target >> 0;
	fill = String(fill);
	if (string.length > target) {
		return string;
	} else {
		target = target - string.length;
		if (target > fill.length) {
			fill += fill.repeat(target / fill.length);
		}
		return fill.slice(0, target) + string;
	}
}

/**
 * @param {string} edbml
 * @param {Object} options
 * @param {string|Array<string>} macros
 * @returns {string|Error}
 */
function parse(edbml, options = {}) {
	return [step1, step2, step3, step4].reduce((result, step) => {
		return result instanceof Error ? result : step(result, options);
	}, edbml);
}

/**
 * Formatting output via Prettier using hardcoded settings for now.
 * This should be synced to general repo to counter false Git diffs.
 * TODO: Follow https://github.com/prettier/prettier/issues/42
 * @param {Object} options
 * @returns {Object}
 */
function prettier(options) {
	options.prettier = options.prettier || {
		useTabs: true,
		singleQuote: true,
		printWidth: 1000
	};
	return options;
}

/**s
 * @param {string} file
 * @returns {string}
 */
function basename(file) {
	return file.slice(0, file.lastIndexOf(path.extname(file)));
}

/**
 * @param {Array<string>} files
 * @param {string} base
 * @returns {Array<string>}
 */
function makeabsolute(files, base) {
	return files.map(file => {
		if (!path.isAbsolute(file)) {
			file = path.normalize(path.join(base, file));
		}
		return file;
	});
}

/**
 * @param {Object} stack
 * @returns {string}
 */
function getsource(stack) {
	return path.dirname(stack[1].getFileName());
}

/**
 * @param {string} file
 * @returns {string}
 */
function read(file) {
	return fs.readFileSync(file, { encoding: 'UTF-8' });
}

/**
 * TODO: Ensure folder exists!
 * @param {string} file
 * @param {string} code
 * @returns {string}
 */
function write(file, code) {
	if (code !== null) {
		fs.writeFileSync(file, code);
	}
	return file;
}

/**
 * @param {Array<string>|string} thing
 * @returns {Array<string>}
 */
function makearray(thing) {
	return Array.isArray(thing) ? thing : [thing];
}
