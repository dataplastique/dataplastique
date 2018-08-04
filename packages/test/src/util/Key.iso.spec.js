import { Key } from '@dataplastique/util';

export default function() {
	describe('util.Key', function likethis() {
		it('should generate a default key', () => {
			let key = Key.generate();
			expect(key.indexOf('key')).toBe(0);
		});

		it('should generate a named key', () => {
			let key = Key.generate('name');
			expect(key.indexOf('name')).toBe(0);
		});

		it('should identify a default key', () => {
			let key = Key.generate();
			expect(Key.isKey(key)).toBe(true);
		});

		it('should identify a named key', () => {
			let key = Key.generate('name');
			expect(Key.isKey(key, 'name')).toBe(true);
		});

		it('should identify a bogus key', () => {
			expect(Key.isKey('Quick brown fox')).toBe(false);
		});

		it('should extract multiple keys', () => {
			let keys = new Array(23 + 1).join(Key.generate());
			expect(Key.extractKeys(keys).length).toBe(23);
		});
	});
}
