import NodeModel from './NodeModel';
import FolderModel from './FolderModel';

/**
 * Tree model.
 */
export default class TreeModel extends FolderModel {
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
	}

	// Private ...................................................................

	/**
	 * Set selected node. Unselect old node.
	 * @param {NodeModel} newnode
	 */
	_select(newnode) {
		let oldnode;
		if ((oldnode = this.selectednode)) {
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
		if ((oldnode = this.focusnode)) {
			oldnode.focused = false;
		}
		if ((this.focusnode = newnode || null)) {
			newnode.focused = true;
			while ((newnode = newnode.$parent)) {
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
		const isopen = node => node.nodes && (node.open || (q && node.matches(q)));
		const hasnodes = node => node.nodes && node.nodes.length;
		const hasparent = node => node.$parent && node.$parent !== this;
		switch (key) {
			case 'Up':
				if ((next = node.prev())) {
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
