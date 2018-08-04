import { format } from './formatscript';
import JSDocModel from '../models/docs/JSDocModel';
import MDDocModel from '../models/docs/MDDocModel';
import EDBMLDocModel from '../models/docs/EDBMLDocModel';

/**
 * Parse to model.
 * @param {string} type
 * @param {string} title
 * @param {string} text
 * @returns {JSDocModel|MDDocModel}
 */
export function parse(type, title, text) {
	switch (type) {
		case '.js':
			return new JSDocModel({
				title: title,
				chapters: getchapters(format(text))
			});
			break;
		case '.md':
			return new MDDocModel({
				title: title,
				markup: '###TODO'
			});
			break;
		case '.edbml':
			return new EDBMLDocModel({
				title: title,
				chapters: getchapters(text)
			});
			break;
	}
}

// Document building ...........................................................

/**
 * JSDoc style comment marker.
 * @type {RegExp}
 */
const GUTTER = /^\s+\* +/;

/**
 * Regular characters.
 * @TODO Bring back 0-9 but add a check for ordered list markdown
 * @type {RegExp}
 */
const LETTER = /^[A-Za-z]/;

/**
 * Strip leading # from header.
 * @type {RegExp}
 */
const HEADER = /^#+\s*/;

/**
 * Comment to mark a chapter: Single line comment
 * with some text followed by at least four dots.
 * Chars } and { and , and ; may precede the comment.
 * @type {RegExp}
 */
const CHAPTER = /^[\s|{|}|,|;]*\/\/\s*[A-Za-z0-9 ]*\s*\.{4,}$/;

/**
 * Extract chapter title (from regexp above).
 * @type {RegExp}
 */
const TITLE = /[A-Za-z0-9]+ [A-Za-z0-9 ]*/;

/**
 * Hello.
 * @type {RegExp}
 */
const HELLO = /^[\s|{|}|,|;]*/;

/**
 * We'll replace newlines in texttual comments with a space.
 * @type {string}
 */
const SPACE = ' ';

/**
 * Parse source code to chapters.
 * @param {string} source
 * @return {Array<ChapterModel>}
 */
function getchapters(source) {
	let comment = false;
	let chapter = null;
	let section = null;
	let chapters = [];
	let sections = [];
	const nextchapter = (title = '', tabs = '') => {
		if (chapter) {
			chapter.sections = sections;
			chapters.push(chapter);
		}
		chapter = {
			title: title,
			tabs: tabs
		};
		sections = [];
	};
	const nextsection = line => {
		if (section && interesting(section)) {
			sections.push(section);
		}
		section = {
			line: line || 0,
			tags: [],
			tabs: '',
			desc: '',
			code: ''
		};
	};
	const indentlevel = line => {
		return /^\t*/.exec(line)[0];
	};
	nextsection();
	nextchapter();
	source.split('\n').forEach((line, index) => {
		let md,
			trim = line.trim();
		if (comment) {
			if (trim.startsWith('*/')) {
				comment = false;
			} else {
				if (trim === '*') {
					section.desc += '\n\n';
				} else {
					md = line.replace(GUTTER, '');
					switch (md[0]) {
						case '@':
							const json = gettag(md);
							section.tags.push(json);
							break;
						case '#':
							section.desc += '\n' + md + '\n\n';
							break;
						default:
							if (!md.match(LETTER)) {
								section.desc += '\n';
							}
							section.desc += encode(md) + SPACE;
							break;
					}
				}
			}
		} else {
			if (line.match(CHAPTER)) {
				let title = TITLE.exec(line);
				let tabs = indentlevel(line);
				section.tabs = tabs;
				nextsection(index);
				nextchapter(title ? title[0] : '', tabs);
				section.code += HELLO.exec(line);
			} else {
				if (trim.startsWith('/**')) {
					section.tabs = indentlevel(line);
					comment = true;
					nextsection(index);
				} else {
					section.code += line + '\n';
				}
			}
		}
	});
	nextsection();
	nextchapter();
	return chapters;
}

/**
 * Dispose sections without any code or comments.
 * @param {Object} section
 * @returns {boolean}
 */
function interesting({ code, desc }) {
	return !!(code.trim() + desc.trim()).length;
}

/**
 * Compute JSON for TagModel constructor argument.
 * @param {string} md
 * @returns {Object}
 */
function gettag(md) {
	const parts = md.split(/ +/); // TODO: space on newlines!
	const json = {
		// TODO: rename these to make sense tomorrow
		name: '',
		type: '',
		desc: '', // TODO: especially this one!
		text: ''
	};
	parts.forEach(part => {
		switch (part[0]) {
			case '@':
				json.name = part;
				break;
			case '{':
				json.type = part; // only one {name} per tag
				break;
			default:
				if (json.type.endsWith('}')) {
					hello(json, part);
				} else {
					json.type += part;
				}
				break;
		}
	});
	json.text = json.text.trim(); // TODO: Remove leading dash + space on breaks
	return json;
}

/**
 * TODO: Work much on this.
 * @param {Object} json
 * @param {string} part
 */
function hello(json, part) {
	switch (json.name) {
		case '@return':
		case '@returns':
			json.text += part + ' ';
			break;
		case '@param':
			if (json.desc) {
				json.text += part + ' ';
			} else {
				json.desc += part;
			}
			break;
	}
}

/**
 * Encode string as HTML.
 * @param {string} string
 * @returns {string}
 */
function encode(string) {
	return string
		.replace(/&(?!\w+;)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
