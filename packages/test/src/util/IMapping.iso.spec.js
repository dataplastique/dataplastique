import { IMapping } from '@dataplastique/util';

export default function() {
	describe('util.IMapping', function likethis() {
		const fun1 = () => {};
		const fun2 = () => {};
		const fun3 = () => {};

		function add(map, key, ...handlers) {
			handlers.forEach(handler => map.add(key, handler));
		}

		function del(map, key, ...handlers) {
			handlers.forEach(handler => map.del(key, handler));
		}

		it('can add handlers for pattern', () => {
			const map = new IMapping();
			const key = Symbol('key');
			add(map, key, fun1, fun2, fun3);
			[fun1, fun2, fun3].forEach(n => {
				expect(map.get(key).has(n)).toBe(true);
			});
			del(map, key, fun3);
			expect(map.get(key).size).toBe(2);
		});

		it('can remove handlers for pattern', () => {
			const map = new IMapping();
			const key = Symbol('key');
			add(map, key, fun1, fun2, fun3);
			del(map, key, fun3);
			expect(map.get(key).size).toBe(2);
		});

		it('should never add the "same" pattern twice', () => {
			const map = new IMapping();
			const key = ['a', 'b', { nested: 'c' }, ['array']];
			add(map, key, fun1, fun2, fun3);
			expect(map.toMap().size).toBe(1);
		});

		it('should dispose the set when empty', () => {
			const map = new IMapping();
			const key = Symbol('key');
			add(map, key, fun1, fun2, fun3);
			expect(map.get(key).size).toBe(3);
			del(map, key, fun1, fun2, fun3);
			expect(map.has(key)).toBe(false);
		});
	});
}
