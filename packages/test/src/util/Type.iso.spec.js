import { isFunction, isClass } from '@dataplastique/util';

export default function() {
	describe('util.Type', function likethis() {
		describe('Discern between function types', () => {
			// Preparation .............................................................

			function func() {}
			function Cons() {}
			Cons.prototype = {
				method() {}
			};
			class Con1 {}
			class Con2 {
				method() {}
			}
			let object = {
				method() {}
			};
			class Cla1 {
				method() {}
			}
			class Cla2 extends Cla1 {}
			let cla3 = class {};

			// Expectations ............................................................

			it('should be a function', () => {
				expect(isFunction(func)).toBe(true);
				expect(isFunction(Cons)).toBe(true);
				expect(isFunction(Con2)).toBe(true);
				expect(isFunction(new Cons().method)).toBe(true);
				expect(isFunction(new Con2().method)).toBe(true);
			});

			/*
			it('should not be a method', () => {
				// expect(isMethod(Cons)).toBe(false);
				expect(isMethod(Con2)).toBe(false);
			});
			*/

			/*
			 * DELETED!
			 *
			it('should be a method (or a simple function)', () => {
				expect(isMethod(func)).toBe(true);
				expect(isMethod(object.method)).toBe(true);
				expect(isMethod(new Cons().method)).toBe(true);
				expect(isMethod(new Con2().method)).toBe(true);
			});
			*/

			/*
			console.log('TODO: should not be a constructor');
			console.log('TODO: should be a constructor');
			console.log('TODO: should be a class (constructor)');

			it('should not be a constructor', () => {
				expect(isConstructor(func)).toBe(false);
				expect(isConstructor(object.method)).toBe(false);
				expect(isConstructor(new Cons().method)).toBe(false);
				expect(isConstructor(new Con2().method)).toBe(false);
				expect(isConstructor(new Cla1().method)).toBe(false);
			});

			it('should be a constructor', () => {
				expect(isConstructor(Cons)).toBe(true);
				expect(isConstructor(Con2)).toBe(true);
				expect(isClass(Cla1)).toBe(true);
				expect(isClass(Cla2)).toBe(true);
				expect(isClass(cla3)).toBe(true);
			});
			*/

			it('should be a class (constructor)', () => {
				expect(isClass(Cla1)).toBe(true);
				expect(isClass(Cla2)).toBe(true);
				expect(isClass(cla3)).toBe(true);
			});

			/*
			 * Because `Cons` doesn't declare any unique members on the prototype (chain), 
			 * we cannot correctly identify it as a constructor. This is really not OK, 
			 * but fortunately that should not often be the case in real world code.
			 *
			it('should be a constructor, but we cannot test this', () => {
				// expect(isConstructor(Con1)).toBe(true); test disabled :/
			});
			*/
		});
	});
}
