import readline from 'readline';
import { readFileSync } from 'fs';
import load from './load';
import shuffle from './shuffle';
import { viewN1Move } from './game';
import markdown from './markdown';
import play from './play';

const rand = Math.random;

const facts = shuffle(load(readFileSync(process.argv[process.argv.length - 1])));
const messages = load(readFileSync(process.argv[process.argv.length - 2]));

const chunk = 3;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = () => new Promise(resolve => rl.question('', resolve));
const write = t => rl.write(markdown(`${t}\n`));

const promise = play({
  facts, messages, chunk, ask, write, rand, viewMove: viewN1Move,
});

promise.then(() => write('done')).then(() => rl.close());
