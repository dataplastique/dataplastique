import { Spirit, boot } from 'dataplastique';
import problem from './edbml/problem.edbml.js';

/*
 * TODO: Since we now pass the EDBML through a DOM, the result will always be 
 * wellformed. We'll need to perform well-formedness validation before this!
 *
it('should render the parserserror (in debug mode)', () => {
	const spirit = Spirit.summon();
	spirit.script.load(not_wellformed).run();
	expect(spirit.dom.q('parsererror')).not.toBe(null);
});
*/

/**
 *
 */
export default function() {
	/**
	 * Confirms identity of elements.
	 * @type {Map<string, Element>}
	 */
	const snapshot = new Map();

	/**
	 * @param {Spirit} spirit
	 * @param {Array<string>} list
	 */
	function confirm(spirit, list) {
		const actual = listguids(spirit);
		expect(actual).toEqual(list);
		actual.forEach(guid => {
			const elm = spirit.dom.guid(guid);
			if (snapshot.has(guid)) {
				expect(snapshot.get(guid)).toBe(elm);
			}
			snapshot.set(guid, elm);
		});
	}

	/**
	 * @param {Spirit} spirit
	 * @returns {Array<string>}
	 */
	function listguids(spirit) {
		return spirit.dom
			.guids()
			.map(elm => elm.getAttribute('data-plastique-id'))
			.filter(id => !id.includes('list'))
			.map(id => id.split('-')[1]);
	}

	/*
	 * ScriptPlugin specs.
	 * TODO: Make it mandatory to always `run` the script even in connection scenario!
	 */
	describe('gui.ScriptPlugin (part 0)', function likethis() {
		it('must boot', () => {
			boot();
			expect(true).toBe(true);
		});

		it('should softupdate', () => {
			const spirit = Spirit.summon();
			const list = [1, 2, 3, 4, 5, 6, 7].map(String);
			spirit.script.load(problem).one(list);
			list.splice(3, 0, 'A');
			list.splice(2, '1');
			list.splice(3, 0, 'B');
			list.splice(4, 0, 'C');
			list.splice(7, 1, '7');
			list.splice(8, 1, '6');
			spirit.script.one(list);
			confirm(spirit, list);
			list.unshift('E');
			list.push('D');
			spirit.script.one(list);
			confirm(spirit, list);
			list.pop();
			list.unshift('D');
			spirit.script.one(list);
			confirm(spirit, list);
			list.reverse();
			spirit.script.one(list);
			confirm(spirit, list);
			const list2 = ['X', 'Y', 'Z'];
			spirit.script.one(list, list2);
			confirm(spirit, list.concat(list2));
			spirit.script.one(list2, list);
			confirm(spirit, list2.concat(list));
		});
	});
}
