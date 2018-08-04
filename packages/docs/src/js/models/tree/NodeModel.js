import { Model } from 'dataplastique';

/**
 * Base model for files and folders.
 * @see {FileModel}
 * @see {FolderModel}
 */
export default class NodeModel extends Model {
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
