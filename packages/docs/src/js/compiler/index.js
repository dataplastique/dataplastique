import fs from 'fs';
import path from 'path';
import { parse } from './parsedocument';
import { index } from './indexfiletree';

/**
 * @param {string|Array<string>} files
 * @param {Object} [options]
 * @returns {Result} mapping filename(s) to compiled JS code
 */
export function compile(files, options = {}) {
	files = Array.isArray(files) ? files : [files];
	const docs = begin(Object.create(null), files, options);
	const tree = index(Object.keys(docs));
	return { tree, docs };
}

// Scoped ......................................................................

/**
 * @param {Object} result
 * @param {Array<string>} files
 * @param {Object} options
 * @returns {Object<string, DocModel>}
 */
function begin(result, files, options) {
	files.forEach(file => {
		const text = read(file);
		const type = path.extname(file);
		const title = path.basename(file, type);
		result[file] = parse(type, title, text);
	});
	return result;
}

/**
 * @param {string} filepath
 * @returns {string}
 */
function read(filepath) {
	return fs.readFileSync(filepath, { encoding: 'UTF-8' });
}
