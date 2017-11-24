import { readFileSync } from 'fs';
import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';
import load from './load';
import shuffle from './shuffle';
import { infinitePlayManyGames } from './play';
import { viewN1Move } from './game';

const bot = new Telegraf(process.env.BOT_TOKEN);
const files = process.argv.filter(f => f.includes('.json'));
const messagesFile = files.shift();
const games = files.map(file => shuffle(load(readFileSync(file))));
const messages = load(readFileSync(messagesFile));

const nextMove = {};

function start(id, reply) {
  nextMove[id] = infinitePlayManyGames({
    games,
    messages,
    viewMove: viewN1Move,
    chunk: 5,
  });
  const { question, answers } = nextMove[id]('');
  return reply(
    `Put proper word in a sentence:\n\n${question}`,
    Markup.keyboard([answers.slice(0, 3), answers.slice(3)]).extra(),
  );
}

bot.start(({ from: { id }, replyWithMarkdown: reply }) => start(id, reply));

bot.hears(/.+/, ({ from: { id }, match, replyWithMarkdown: reply }) => {
  if (!nextMove[id]) {
    return start(id, reply);
  }
  const { answer, question, answers } = nextMove[id](match[0]);
  return reply(`${answer}\n\n${question}`, Markup.keyboard([answers.slice(0, 3), answers.slice(3)]).extra());
});

bot.catch((err) => {
  console.error('Ooops', err);
});

bot.startPolling();
