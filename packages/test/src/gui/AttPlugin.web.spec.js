import { Spirit, channeling, attribute, boot } from 'dataplastique';

/**
 *
 */
export default function() {
	/**
	 * We'll use this spirit to test the `attribute` decorator.
	 */
	@channeling('my-hairy-spirit')
	class MyHairySpirit extends Spirit {
		haircolor = 'purple';
		@attribute('my-hair-color')
		set haircolor(value) {}
	}

	/**
	 * TODO: Special business logig for non-primitive values
	 * TODO: Also check this with the (static) `model()`
	 */
	describe('gui.AttPlugin', function likethis() {
		it('should boot first', done => {
			expect(true).toBe(true);
			boot().then(done);
		});

		it('should set the attribute', () => {
			const spirit = Spirit.summon();
			spirit.att.set('name', 'value');
			expect(spirit.element.getAttribute('name')).toBe('value');
		});

		it('should get the attribute', () => {
			const spirit = Spirit.summon();
			spirit.att.set('name', 'value');
			expect(spirit.att.get('name')).toBe('value');
		});

		it('should query existance', () => {
			const spirit = Spirit.summon();
			spirit.att.set('name', 'value');
			expect(spirit.att.has('name')).toBe(true);
		});

		it('should cast the number', () => {
			const spirit = Spirit.summon();
			spirit.att.set('number', '23');
			expect(spirit.att.get('number')).toBe(23);
		});

		it('should cast the boolean', () => {
			const spirit = Spirit.summon();
			spirit.att.set('boolean', 'true');
			expect(spirit.att.get('boolean')).toBe(true);
		});

		it('should delete the attribute', () => {
			const spirit = Spirit.summon();
			spirit.att.set('name', 'value').set('name', null);
			expect(spirit.att.has('name')).toBe(false);
		});

		it('should also delete the attribute', () => {
			const spirit = Spirit.summon();
			spirit.att.set('name', 'value').delete('name');
			expect(spirit.att.has('name')).toBe(false);
		});

		it('should shift the attribute', () => {
			const spirit = Spirit.summon();
			let truthy = this.constructor;
			spirit.att.shift(truthy, 'name', 'value');
			expect(spirit.att.get('name')).toBe('value');
		});

		it('should autoconvert strings to appropriate primitives', () => {
			const spirit = Spirit.summon();
			spirit.element.setAttribute('test1', '23');
			spirit.element.setAttribute('test2', 'true');
			expect(spirit.att.get('test1')).toBe(23);
			expect(spirit.att.get('test2')).toBe(true);
		});

		it('should reflect HTML attributes into to JS properties', () => {
			const spirit = MyHairySpirit.summon();
			expect(spirit.haircolor).toBe('purple');
			spirit.element.setAttribute('my-hair-color', 'lime');
			expect(spirit.haircolor).toBe('lime');
		});

		it('should reflect JS properties back to HTML attributes', () => {
			const spirit = MyHairySpirit.summon();
			spirit.haircolor = 'pink';
			expect(spirit.element.getAttribute('my-hair-color')).toBe('pink');
		});

		/*
		it('should get all attributes', () => {
			const spirit = Spirit.summon();
			['a', 'b', 'c'].forEach((n, i) => {
				spirit.att.set(n, i);
			});
			let atts = spirit.att.all();
			atts = atts.filter(att => {
				return att.name !== 'data-gui'; // TODO: unhardcode this
			});
			expect(atts.length).toBe(3);
		});
		*/

		/*
		it('should get the map', () => {
			const spirit = Spirit.summon();
			['a', 'b', 'c'].forEach((n, i) => {
				spirit.att.set(n, i);
			});
			let atts = spirit.att.getMap();
			expect(atts.a).toBe(0);
			expect(atts.b).toBe(1);
			expect(atts.c).toBe(2);
		});

		it('should set the map', () => {
			const spirit = Spirit.summon();
			spirit.att.setMap({
				a: 0,
				b: 1,
				c: 2
			});
			expect(spirit.att.get('a')).toBe(0);
			expect(spirit.att.get('b')).toBe(1);
			expect(spirit.att.get('c')).toBe(2);
		});

		it('should trigger when listener added', () => {
			const spirit = Spirit.summon();
			let success = false;
			spirit.att.set('name', 'value');
			spirit.onatt = att => {
				expect(att.name).toBe('name');
				expect(att.value).toBe('value');
				success = true;
			};
			spirit.att.add('name');
			expect(success).toBe(true);
		});

		it('should trigger when attribute added', () => {
			const spirit = Spirit.summon();
			let success = false;
			spirit.onatt = att => success = true;
			spirit.att.add('name').set('name', 'value');
			expect(success).toBe(true);
		});

		it('should trigger when attribute changed', () => {
			const spirit = Spirit.summon();
			let success = false;
			spirit.att.set('name', 'value').add('name');
			spirit.onatt = att => {
				success = att.value === 'newvalue';
			};
			spirit.att.set('name', 'newvalue');
			expect(success).toBe(true);
		});

		it('should not trigger no more', () => {
			const spirit = Spirit.summon();
			let success = true;
			spirit.att.set('name', 'value').add('name').remove('name');
			spirit.onatt = att => {
				success = false;
			};
			expect(success).toBe(true);
		});
		*/
	});
}
