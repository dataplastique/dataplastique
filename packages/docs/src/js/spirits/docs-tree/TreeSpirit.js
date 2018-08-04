import TreeModel from '../../models/tree/TreeModel';
import edbml from './TreeSpirit.edbml.js';

/**
 * Spirit of the file navigator.
 * @param {Spirit} spirit
 * @param {IOPlugin} spirit.io
 * @param {ScriptPlugin} spirit.script
 */
export default function TreeSpirit({ io, script }) {
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
