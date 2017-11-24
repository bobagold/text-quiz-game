import readline from 'readline';
import { readFileSync } from 'fs';
import load from './load';
import shuffle from './shuffle';
import { viewN1Move } from './game';
import markdown from './markdown';
import { formatQuestion, infinitePlayManyGames } from './play';

const rand = Math.random;

const files = process.argv.filter(f => f.includes('.json'));
const messagesFile = files.shift();
const games = files.map(file => shuffle(load(readFileSync(file))));
const messages = load(readFileSync(messagesFile));

const chunk = 5;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = () => new Promise(resolve => rl.question('', resolve));
const write = t => rl.write(markdown(`${t}\n`));

const nextMove = infinitePlayManyGames({
  games, messages, chunk, rand, viewMove: viewN1Move,
});

function play(answer) {
  const move = nextMove(answer);
  if (move.answer) {
    write(move.answer);
    write('');
  }
  if (move.question) {
    write(formatQuestion(move));
    return ask().then(play);
  }
  return null;
}
const promise = play('');

promise.then(() => write('done')).then(() => rl.close());
