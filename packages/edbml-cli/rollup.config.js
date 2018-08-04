import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
	input: 'index.js',
	plugins: [
		babel(),
		resolve({
			only: [ /^@dataplastique/ ]
		})
	],
	output: {
		banner: '#! /usr/bin/env node',
		file: 'bin/edbml-cli.js',
		format: 'cjs'
	}
};
