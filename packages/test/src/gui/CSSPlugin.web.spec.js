import { Spirit, boot } from 'dataplastique';

/**
 *
 */
export default function() {
	/*
	 * CSSPlugin specs.
	 */
	describe('gui.CSSPlugin', function likethis() {
		it('obviously needs more testing', () => {
			boot();
			const spirit = Spirit.summon();
			const style = spirit.element.style;
			spirit.css.paddingTop = 23;
			spirit.css.marginLeft = 23;
			spirit.css.marginLeft += 2;
			expect(style.paddingTop).toBe('23px');
			expect(style.marginLeft).toBe('25px');
		});
	});
}
