import JSDocModel from '../../models/docs/JSDocModel';
import MDDocModel from '../../models/docs/MDDocModel';
import EDBMLDocModel from '../../models/docs/EDBMLDocModel';
import TreeModel from '../../models/tree/TreeModel';

/**
 * @type {Map<string, Object>}
 */
let docs = null;

/**
 * @type {TreeModel}
 */
let tree = null;

/**
 * @param {Spirit} spirit
 * @param {EventPlugin} spirit.event
 */
export default function RootSpirit() {
	const hash = (location.hash || '#').slice(1);
	fetch('index.json').then(response => {
		if (response.ok) {
			addEventListener('hashchange', () => {
				load(location.hash.slice(1));
			});
			response
				.json()
				.then(json => {
					docs = new Map(Object.entries(json.docs));
					tree = new TreeModel(json.tree).onload(hash).output();
				})
				.then(() => {
					if (hash) {
						load(hash);
					}
				})
				.catch(x => {
					console.error(x);
				});
		} else {
			throw new Error('Wrong answer', e.message);
		}
	});
}

// Scoped ......................................................................

/**
 * Instruct the Tree to update the position and then output the relevant data
 * as a {Document}. Unless it's the first rendering, we break this up with a
 * timeout for instant feedback in the tree (in case syntax hiliting is slow).
 * TODO: Handle 404 somewhat more elegantly here
 * @param {String} path
 */
function load(path) {
	const success = docs.has(path);
	document.title = `Docs — ${success ? name(path) : 404}`;
	if (success) {
		tree.onload(path);
		function output() {
			const json = docs.get(path);
			new (model(json))(json).output();
		}
		if (load.next) {
			setTimeout(output, 10);
		} else {
			load.next = true;
			output();
		}
	} else {
		console.error(404, path);
	}
}

/**
 * Get approriate model for given data.
 * @param {object} json
 * @returns {Constructor}
 */
function model(json) {
	return {
		'text/javascript': JSDocModel,
		'text/edbml': EDBMLDocModel,
		'text/markdown': MDDocModel
	}[json.type];
}

/**
 * Produce file name from full path.
 * @param {string} path
 * @returns {string}
 */
function name(path) {
	let cuts = path.split('/');
	let name = cuts.pop() || '';
	if ((cuts = name.split('.')).length) {
		cuts.pop();
	}
	return cuts.join('.');
}
