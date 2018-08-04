import Config from './Config';
import { get as getspirit } from './Store';
import { bootstrap } from './Guide';
import { isElement } from '@dataplastique/util';

export { default as Spirit } from './Spirit';
export { channeling, attribute } from './Deco';

export * from './Const'; // TODO: Does this work???

/**
 * boot the entire shebang. We'll return a promise here in case we later
 * find something promising to return. Note that this causes an async break,
 * se consider an alternative (callback) if the initial rendering flashes.
 * @param {Object} [config] - TODO: parse this into {Config}
 * @returns {Promise}
 */
export function boot(config = {}) {
	return new Promise((resolve, reject) => {
		boot.done
			? resolve()
			: do {
					document.readyState === 'loading'
						? reject(`Premature boot: Await DOMContentLoaded`)
						: do {
								Config.init(config);
								bootstrap(document);
								boot.done = true;
								resolve();
						  };
			  };
	});
}

/**
 * Activate the mutation observer system for given node, most likely
 * some `shadowRoot` since otherwise it would otherwise already work.
 * @param {Node} node
 * @returns {Node}
 */
export function reboot(node) {
	return bootstrap(node);
}

/**
 * Get spirit for element.
 * @param {Element} elm
 * @returns {Spirit}
 */
export function get(elm) {
	if (isElement(elm)) {
		return getspirit(elm);
	} else {
		throw new TypeError('Element expected');
	}
}
