import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { compile } from './src/index';

const targets = process.argv.slice(2);
const isfolder = target => fs.existsSync(target) && fs.lstatSync(target).isDirectory();
const getfiles = folder => glob.sync(path.normalize(folder + '/**/*.edbml'));
const format = results => results.map(file => '    ' + file).join('\n') + '\n';
const absolute = file => path.resolve(file);

if(Array.isArray(targets)) {
	const folders = targets.filter(isfolder);
	const files = targets.filter(target => !folders.includes(target));
	folders.forEach(folder => files.push(...getfiles(folder)));
	const all = [...new Set(files.map(absolute))];
	console.log(format(compile(all)));
}
