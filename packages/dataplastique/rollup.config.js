import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

/*
 * TODO: Rollup used to read this from a root level  ".babelrc" file, but 
 * this stopped working after upgrade to Babel 7. Please try this again 
 * at some point so that this configuration doesn't need to be copy pasted!
 */
const CONFIG = {
	presets: [
		['@babel/env', {
			modules: false,
			targets: {
				firefox: 53,
				chrome: 59,
				safari: 10,
				edge: 15
			}
		}]
	],
	plugins: [
		['@babel/plugin-proposal-decorators', { legacy: true }],
		['@babel/plugin-proposal-class-properties', { loose: true }],
		['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
		["@babel/plugin-proposal-do-expressions"]
	]
};

export default {
	input: 'src/index.js',
	plugins: [
		babel(CONFIG),
		resolve()
	],
	output: {
		file: 'dist/index.js',
		format: 'es'
	}
};
