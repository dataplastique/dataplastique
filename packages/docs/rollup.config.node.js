import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

const CONFIG = {
	presets: [
		['@babel/env', {
			modules: false,
			targets: {
				node: 'current'
			}
		}]
	],
	plugins: [
		['@babel/plugin-proposal-decorators', { legacy: true }],
		['@babel/plugin-proposal-class-properties', { loose: true }],
		['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
		['@babel/plugin-proposal-do-expressions'],
		['@babel/plugin-proposal-pipeline-operator']
	]
};

export default {
	input: 'src/js/compiler/index.js',
	plugins: [
		babel(CONFIG),
		resolve({
			only: [ /^@dataplastique|^dataplastique/ ]
		})
	],
	output: {
		file: 'dist/compiler.mjs',
		format: 'es'
	}
};
