import { Spirit, boot } from 'dataplastique';
import hello_world from './edbml/hello-world.edbml.js';
import level1 from './edbml/level1.edbml.js';
import not_wellformed from './edbml/not_wellformed.edbml.js';
import attributes from './edbml/attributes.edbml.js';
import guid_recycle from './edbml/guid-recycle.edbml.js';
import inline_callbacks from './edbml/inline-callbacks.edbml.js';
import root_updates from './edbml/root-updates.edbml.js';
import nodes_and_spirits from './edbml/nodes-and-spirits.edbml.js';

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
	/*
	 * ScriptPlugin specs.
	 * TODO: Make it mandatory to always `run` the script even in connection scenario!
	 */
	describe('gui.ScriptPlugin (part 1)', function likethis() {
		it('must be configured to expect well-formed XHTML', () => {
			// both configs are needed for well-formedness validation
			boot({
				xhtml: true,
				debug: true
			});
			expect(true).toBe(true);
		});

		it('should fail when no script is loaded', () => {
			const spirit = Spirit.summon();
			try {
				spirit.script.run('Hello World');
			} catch (exception) {
				expect(exception.message).toContain('No script loaded');
			}
		});

		it('should be able to run a simple script', () => {
			const spirit = Spirit.summon();
			spirit.script.load(hello_world);
			spirit.script.run('Hello World');
			expect(spirit.script.loaded).toBe(true);
			expect(spirit.dom.html()).toContain('Hello World');
			expect(spirit.dom.html()).toContain('ending plus to continue');
			expect(spirit.dom.html()).toContain('leading plus to continue');
		});

		it('should work with the @attribute syntax', () => {
			const spirit = Spirit.summon();
			spirit.script.load(attributes).run();
			const p = spirit.dom.q('p');
			expect(p.id).toBe('myid');
			expect(p.className).toBe('myclass');
			expect(p.hasAttribute('href')).toBe(false);
			expect(p.hasAttribute('src')).toBe(false);
			expect(p.dataset.number).toBe('23');
			expect(p.dataset.boolean).toBe('true');
			const table = spirit.dom.q('table');
			expect(table.getAttribute('cellspacing')).toBe('2');
			expect(table.getAttribute('cellpadding')).toBe('2');
		});

		it('should recycle all identified elements', () => {
			const spirit = Spirit.summon();
			spirit.script.load(guid_recycle).run(0);
			const elms = () => spirit.dom.guids();
			const base = elms();
			const same = list => list.every(elm => base.includes(elm));
			const test = [0, 1, 2, 3, 4, 3, 2, 1, 0];
			expect(
				test.every(scenario => {
					console.log('scenario', scenario);
					spirit.script.run(scenario);
					console.log('    result', same(elms()));
					console.log(spirit.dom.html());
					return same(elms());
				})
			).toBe(true);
		});

		it('should convert inline events to DOM event listeners', () => {
			const spirit = Spirit.summon();
			spirit.script.load(inline_callbacks).run(0);
			const button = spirit.dom.q('button');
			expect(button.getAttribute('on:click')).toBe(null);
			button.click();
			expect(spirit.check).toBe('OK');
		});

		// TODO: also check that the *number* of listeners is constant!
		it('should refresh the event listeners on every rerun', () => {
			const spirit = Spirit.summon();
			const oldran = Math.random();
			spirit.script.load(inline_callbacks).run(0);
			const button = spirit.dom.q('button');
			[1, 2, 3, 2, 1].reduce(oldran => {
				const newran = Math.random();
				spirit.script.run(0, newran);
				button.click();
				expect(spirit.check).toBe(newran);
				expect(spirit.check).not.toBe(oldran); // this doesn't make much sense now...
				return newran;
			}, oldran);
		});

		it('should remove the event listener when the attribute is gone', () => {
			const spirit = Spirit.summon();
			spirit.script.load(inline_callbacks).run(0);
			const button = spirit.dom.q('button');
			spirit.script.run(1);
			button.click();
			expect(spirit.check).toBe(undefined);
		});

		it('should remove the event listener when element itself is gone', () => {
			const spirit = Spirit.summon();
			spirit.script.load(inline_callbacks).run(0);
			const button = spirit.dom.q('button');
			spirit.script.run(2);
			button.click();
			expect(spirit.check).toBe(undefined);
		});

		it('should detect whenever event listeners appear and disappear', () => {
			const spirit = Spirit.summon();
			spirit.script.load(inline_callbacks);
			spirit.script.run(1);
			const button = spirit.dom.q('button');
			spirit.script.run(0);
			button.click();
			expect(spirit.check).toBe('OK');
			spirit.check = undefined;
			spirit.script.run(3);
			button.click();
			expect(spirit.check).toBe('still OK');
			spirit.check = undefined;
			spirit.script.run(1);
			button.click();
			expect(spirit.check).toBe(undefined);
		});

		it('should synchronize root element attributes', () => {
			const spirit = Spirit.summon();
			const hascss = css => spirit.css.has(css);
			const hastip = tip => spirit.element.title === tip;
			spirit.script.load(root_updates);
			spirit.script.run(0).run(1, 'myclass');
			expect(hascss('myclass')).toBe(true);
			spirit.script.run(1, null, 'mytooltip');
			expect(hascss('myclass')).toBe(false);
			expect(hastip('mytooltip')).toBe(true);
			spirit.script.run(1, 'otherclass');
			expect(hascss('otherclass')).toBe(true);
			spirit.script.run(0);
			expect(hascss('otherclass')).toBe(false);
			expect(hastip('mytooltip')).toBe(false);
		});

		it('should synchronize root element callbacks', () => {
			const spirit = Spirit.summon();
			const action = () => (spirit.check = 'OK');
			spirit.script.load(root_updates);
			spirit.script.run(0).run(2, null, null, action);
			spirit.element.click();
			expect(spirit.check).toBe('OK');
		});

		it('should be able to import external scripts', () => {
			const spirit = Spirit.summon();
			spirit.script.load(level1).run('OK');
			expect(spirit.dom.html()).toContain('OK');
		});

		/*
		// TODO: NodeList
		it('can insert elements and fragments', () => {
			const spirit = Spirit.summon();
			const elem = document.createElement('div');
			const frag = document.createElement('span');
			// const frag = document.createDocumentFragment();
			// const span = frag.appendChild(document.createElement('span'));
			spirit.script.load(nodes_and_spirits).run(elem, frag);
			console.log(spirit.dom.html());
			[elem, span].forEach(node => {
				expect(spirit.element.contains(node)).toBe(true);
			});
		});
		*/
	});
}
