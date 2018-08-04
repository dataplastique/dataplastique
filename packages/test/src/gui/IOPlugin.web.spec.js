import { Model, Spirit, boot } from 'dataplastique';

/**
 * Start testing
 */
export default function() {
	class ModelA extends Model {}
	class ModelB extends Model {}
	class ModelC extends Model {}

	describe('IOPlugin', function likethis() {
		it('should work', () => {
			boot();
			const spirit = Spirit.summon();
			const result = [];
			spirit.io.on(ModelA, a => {
				if (ModelA.is(a)) {
					result.push(1);
				}
			});
			spirit.io.on([ModelA, { ModelB, ModelC }], (a, x) => {
				if (ModelA.is(a) && (ModelB.is(x) || ModelC.is(x))) {
					result.push(2);
				}
			});
			spirit.io.on([ModelA, ModelB, ModelC], (a, b, c) => {
				if (ModelA.is(a) && ModelB.is(b) && ModelC.is(c)) {
					result.push(3);
				}
			});
			spirit.io.on([ModelA, [ModelB, [ModelC]]], (a, b, c) => {
				if (ModelA.is(a) && ModelB.is(b) && ModelC.is(c)) {
					result.push(4);
				}
			});
			new ModelA().output();
			new ModelB().output();
			new ModelC().output();
			expect(result).toEqual([1, 2, 2, 3, 4]);
		});
	});
}
