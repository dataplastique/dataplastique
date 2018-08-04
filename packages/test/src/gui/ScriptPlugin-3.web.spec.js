import { Spirit, channeling, boot } from 'dataplastique';
import io_simple from './edbml/io-simple.edbml.js';
import io_johnson from './edbml/io-johnson.edbml.js';
import io_flemming from './edbml/io-flemming.edbml.js';
import PersonModel from './models/PersonModel.js';
import PersonCollection from './models/PersonCollection.js';
import DonkeyModel from './models/DonkeyModel.js';
import NumberCollection from './models/NumberCollection.js';
import pass_props from './edbml/pass-props.edbml.js';

/**
 * Execute somewhat later. The timing depends on two chained async schedules:
 * - First, `Tick.nextFrame` runs in the Observers setup (to minimize callbacks)
 * - Then, `Tick.nextFrame` runs in the ScriptPlugin (to minimize rendering)
 * TODO: Global interface hook for exact post-render callback
 * @param {Function} cb
 */
function later(cb) {
	setTimeout(cb, 50); // TODO: Util.onAvailable or something?
}

/**
 * Get spirit HTML.
 * @param {Spirit} spirit
 * @returns {string}
 */
function html(spirit) {
	return spirit.dom.html();
}

/**
 * TODO: Must this be defined before `boot()` or what?
 */
@channeling('my-configurable-spirit')
class ConfigurableSpirit extends Spirit {
	model = 23;
	firstname = '';
	lastname = '';

	/**
	 * Experimental!
	 * @param {Class<HTMLElement>} CustomElm
	 * @param {Function} spirit
	 * @returns {Class<HTMLElement>}
	 */
	static api(CustomElm, spirit) {
		return class extends CustomElm {
			set usermodel(model) {
				spirit(this).model = model;
			}
			username(first, last) {
				spirit(this).firstname = first;
				spirit(this).lastname = last;
			}
		};
	}
}

/**
 *
 */
export default function() {
	/*
	 * Even more ScriptPlugin specs.
	 */
	describe('gui.ScriptPlugin (part 3)', function likethis() {
		it('must boot before we begin', () => {
			boot();
			expect(true).toBe(true);
		});

		it('should render (async) whenever model properties change', done => {
			const spirit = Spirit.summon();
			const person = new PersonModel({ name: 'Barack' });
			const donkey = new DonkeyModel({ name: 'Donald' });
			spirit.script.load(io_simple).run(person, donkey);
			person.name = 'Jim';
			donkey.name = 'Bob';
			later(() => {
				expect(html(spirit)).toContain('Jim');
				expect(html(spirit)).toContain('Bob');
				person.pet = donkey;
				later(() => {
					expect(html(spirit)).toContain('colleagues');
					done();
				});
			});
		});

		it('should also work with collections', done => {
			const spirit = Spirit.summon();
			const persons = new PersonCollection(
				{ name: 'Jim Starenko' },
				{ name: 'Bob Geldof' },
				{ name: 'Ole Ganondorf' }
			);
			spirit.script.load(io_johnson).run(persons);
			['Jim', 'Bob', 'Ole'].every(name => {
				expect(html(spirit)).toContain(name);
			});
			persons.push({ name: 'John' });
			later(() => {
				expect(html(spirit)).toContain('John');
				persons.splice(0, 1, { name: 'Else' });
				later(() => {
					expect(html(spirit)).toContain('Else');
					expect(html(spirit)).not.toContain('Jim');
					persons[0].name = 'Ricardo';
					later(() => {
						expect(html(spirit)).toContain('Ricardo');
						expect(html(spirit)).not.toContain('Else');
						done();
					});
				});
			});
		});

		it('should work in the cornercase scenario', done => {
			const spirit = Spirit.summon();
			const numbers = new NumberCollection(0, 1, 2, 3);
			spirit.script.load(io_flemming).run(numbers);
			expect(html(spirit)).toBe('');
			numbers[3] = Math.PI;
			later(() => {
				expect(html(spirit)).toContain('OK');
				done();
			});
		});

		it('should support the `do:elm` interface to manipulate rendered element', () => {
			const spirit = Spirit.summon();
			spirit.dom.appendTo(document.body);
			spirit.script.load(pass_props).run({
				firstname: 'Jim Bob',
				lastname: 'Johnson'
			});
			const elmprops = spirit.dom.guid('elm-props');
			const elmcalls = spirit.dom.guid('elm-calls');
			expect(elmprops.title).toBe('Jim Bob Johnson');
			expect(elmcalls.title).toBe('Jim Bob Johnson');
			spirit.dom.remove();
		});

		/*
		it('should set call a LOWERCASE method WHEN EMBEDDED IN THE DOCUMENT', () => {
			const spirit = Spirit.summon();
			spirit.dom.appendTo(document.body);
			spirit.script.load(pass_props).run({
				firstname: 'Jim Bob',
				lastname: 'Johnson'
			});
			const spicalls = spirit.dom.guid('spi-calls', ConfigurableSpirit);
			expect(spicalls.firstname).toBe('Jim Bob');
			expect(spicalls.lastname).toBe('Johnson');
		});
		*/
	});
}
