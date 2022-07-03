import { writeFileSync } from 'fs';
import * as glob from 'glob';
import { ParseError } from 'parser-combinators/types';
import { runner } from './vm';
import { findMain, getAll, init } from './vm/file-cache';

const flags = [
  'run',
  'save'
];

(() => {
  try {
    const args = process.argv.slice(2);

    const files = args.filter(arg => flags.every(f => arg !== '-' + f));

    const flagsOn: Record<string, boolean> = {};
    args.filter(arg => flags.some(f => arg === '-' + f)).forEach(flag => flagsOn[flag] = true);

    if (!files.length) {
      console.error('No files specified');
      return;
    }

    console.time('parse');
    const allowedFiles = files.flatMap(file => glob.sync(file, { absolute: true }));
    init(allowedFiles);
    console.timeEnd('parse');

    if (flagsOn['-run']) {
      console.time('run');
      const main = findMain();
      console.log(runner(main));
      console.timeEnd('run');
    } 
    if (flagsOn['-save']) {
      console.time('save');
      const parsed = getAll();
      parsed.forEach(([file, data]) => writeFileSync(file + '.ast', JSON.stringify(data, null, 2), { encoding: 'utf8' }));
      console.timeEnd('save');
    }
  } catch(e) {
    if (e instanceof ParseError) {
      console.error(e.getPrettyErrorMessage());
    }
    else {
      throw e;
    }
  }
})();
