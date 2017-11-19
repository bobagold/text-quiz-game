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

const nextMove = play({
  facts, messages, chunk, rand, viewMove: viewN1Move,
});

let promise = Promise.resolve();
for (let i = 0; i < (facts.length / chunk) + 1; i += 1) {
  promise = promise.then((answer) => {
    const move = nextMove(answer);
    if (move.answer) {
      move.answer.forEach(write);
    }
    if (move.question) {
      write(move.question);
      return ask();
    }
    return null;
  });
}

promise.then(() => write('done')).then(() => rl.close());
