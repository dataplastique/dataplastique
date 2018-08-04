import NodeModel from './NodeModel';

/**
 * File model.
 */
export default class FileModel extends NodeModel {
	/**
	 * Interface.
	 * @returns {Object}
	 */
	static model() {
		return {
			src: String, // file location
			type: String, // file type (extension)
			what: String, // file name minus extension assumed to be 'what' the file is (???)
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
		return (
			'file' +
			(this.selected ? ' selected' : '') +
			(this.focused ? ' focused' : '')
		);
	}
}
