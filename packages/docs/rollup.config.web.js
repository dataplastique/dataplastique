import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

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
	input: 'src/js/index.js',
	plugins: [
		babel(CONFIG),
		resolve()
	],
	output: {
		file: 'web/index.js',
		format: 'iife',
		name: 'docs'
	}
};
