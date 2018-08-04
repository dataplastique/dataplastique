const johnson = 'data-plastique-id';
const findall = (path, context) => Array.from(context.querySelectorAll(path));
const getguid = elm => elm.getAttribute(johnson);

/**
 * @param {Element} elm
 * @param {string} [guid] - The phantom guid associated to root element
 * @param {boolean} [deep] - TODO: No make sense with two optional params here :/
 * @returns {Map<string, Element>} - Mapping `guid` value to element
 */
export function mapguids(elm, guid, deep = true) {
	const fix = deep ? '' : ':scope > ';
	const css = `${fix}[${johnson}]`;
	const all = findall(css, elm);
	const set = elm => [getguid(elm), elm];
	const map = new Map(all.map(set));
	if (guid) {
		map.set(guid, elm);
	}
	return map;
}
