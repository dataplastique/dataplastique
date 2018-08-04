import { Model } from 'dataplastique';
import { Collection } from 'dataplastique';
import NodeModel from './NodeModel';
import FileModel from './FileModel';

/**
 * Folder model.
 */
export default class FolderModel extends NodeModel {
	/**
	 * Interface.
	 * @returns {Object}
	 */
	static model() {
		return {
			open: Boolean,
			filenames: String, // Listing filesnames in this AND descendant folders.
			nodes: Collection.$of(json => (json.nodes ? FolderModel : FileModel))
		};
	}

	/**
	 * Stamp reverse relationships.
	 */
	onconstruct() {
		super.onconstruct();
		this.nodes.forEach(node => (node.$parent = this));
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
		return (
			'folder' + (this.open ? ' open' : '') + (this.focused ? ' focused' : '')
		);
	}
}
