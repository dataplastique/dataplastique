import TreeModel from '../models/tree/TreeModel';

/**
 * Parse list of strings into directory structure and return the root folder.
 * @param {Array<string>} sources
 * @returns {TreeModel}
 */
export function index(sources) {
	const steps = [step1, step2, step3, step4, step5];
	return new TreeModel(
		steps.reduce((input, nextstep) => {
			return nextstep(input);
		}, sources)
	);
}

// Scoped ......................................................................

/*
 * Distribute foldernames and filenames in hashmaps.
 */
function step1(sources) {
	const map = Object.create(null);
	function next(source, parts, map) {
		let part = parts.shift();
		if (!parts.length) {
			map[part] = source;
		} else {
			map[part] = map[part] || Object.create(null);
			next(source, parts, map[part]);
		}
	}
	sources.forEach(src => next(src, src.split('/'), map));
	return map;
}

/*
 * Transforming hashmaps into objects and arrays.
 */
function step2(map) {
	const root = { name: '/', nodes: [] };
	return (function next(map, parent, level) {
		Object.keys(map).forEach(key => {
			let val = map[key];
			let node = { name: key };
			if (typeof val === 'object') {
				node.nodes = [];
				node.open = level < 1;
				next(val, node, level + 1);
			} else {
				node.src = val;
			}
			parent.nodes.push(node);
		});
		return parent;
	})(map, root, 0);
}

/*
 * Split files from folders and sort them alphabetically.
 */
function step3(folder) {
	let is,
		nodes = folder.nodes;
	const alpha = (n1, n2) => {
		return n1.name < n2.name ? -1 : n1.name > n2.name ? 1 : 0;
	};
	folder.nodes = nodes
		.filter(node => {
			return (is = node.nodes) ? step3(node) : false;
		})
		.sort(alpha)
		.concat(nodes.filter(node => !node.nodes).sort(alpha));
	return folder;
}

/**
 * Reduce to minimum viable root folder.
 */
function step4(folder) {
	while (folder.nodes.length === 1 && folder.nodes[0].nodes) {
		folder = folder.nodes[0];
	}
	return folder;
}

/**
 * Preoptimize search by stamping descendant filenames onto folders.
 */
function step5(folder) {
	folder.filenames =
		folder.filenames ||
		folder.nodes
			.map(node => {
				return node.nodes ? step5(node).filenames : node.name.toLowerCase();
			})
			.join(' ');
	return folder;
}
