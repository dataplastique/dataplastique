import { Spirit, channeling, boot, get, attribute } from 'dataplastique';

const create = tag => document.createElement(tag);
const append = elm => document.body.appendChild(elm);
const remove = elm => document.body.removeChild(elm);

export default function() {
	describe('gui.Spirit', function likethis() {
		/*
		 * Compact declaration 1: Declare via `function` keyword to create a spirit 
		 * class behind the scenes. Once newed up, the spirit instance is provided 
		 * as an argument so that it can be destructured for access to plugins.
		 * The optional return value is an object with methods that answers to the 
		 * spirits lifecycle callbacks. Make sure not to call `super` here since 
		 * it doesn't work and also defies the purpose of the "functional" spirit.
		 * Functional spirits obviously cannot be subclassed and so they must 
		 * involve some kind of composition technique to share functionality.
		 */
		channeling('my-named-spirit', function MySpiritWrapper({ css }) {
			css.add('constructed'); // initialization code can go here
			return {
				onready() {
					css.add('ready');
				}
			};
		});

		/*
		 * Compact declaration 2: Declare via arrow function.
		 */
		channeling('my-anonymous-spirit', ({ css }) => ({
			onconstruct: () => css.add('constructed'),
			onready: () => css.add('ready')
		}));

		/*
		 * This typed spirit accepts only two specific properties of a certain type.
		 * TODO: Support `Element` in type system so we can actually test this thing
		 */
		channeling('my-typed-spirit', function Johnson(spirit) {
			Johnson.spirit = () => ({
				element: Element,
				name: String,
				age: Number
			});
			return {
				onready() {
					this.name = 'John';
					this.age = '49';
					this.occupation = 'Actor';
					alert(this.occupation);
				}
			};
		});

		it('must boot first', done => {
			boot().then(() => {
				expect(boot.done).toBe(true);
				done();
			});
		});

		it('can be declared with an arrow function', done => {
			get(append(create('my-anonymous-spirit')), spirit => {
				expect(spirit.constructor.name).toBe('Anonymous');
				expect(spirit.css.has('constructed')).toBe(true);
				expect(spirit.css.has('ready')).toBe(true);
				remove(spirit.element);
				done();
			});
		});

		it('can be declared with a named function', done => {
			get(append(create('my-named-spirit')), spirit => {
				expect(spirit.constructor.name).toBe('Anonymous');
				expect(spirit.css.has('constructed')).toBe(true);
				expect(spirit.css.has('ready')).toBe(true);
				remove(spirit.element);
				done();
			});
		});

		/*
		it('supports the attribute thing', done => {
			get(append(create('my-hairy-spirit')), spirit => {
				spirit.element.setAttribute('my-hair-color', 'pink');
				expect(spirit.haircolor).toBe('pink');
				remove(spirit.element);
				done();
			});
		});
		*/

		/*
		it('can declare a type interface, provided named function', done => {
			Spirit.get(append(create('my-typed-spirit')), spirit => {
				done();
			});
		});
		*/
	});
}
