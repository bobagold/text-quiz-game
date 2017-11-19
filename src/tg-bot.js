import { readFileSync } from 'fs';
import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';
import load from './load';
import shuffle from './shuffle';
import { infinitePlay } from './play';
import { viewN1Move } from './game';

const bot = new Telegraf(process.env.BOT_TOKEN);
const facts = shuffle(load(readFileSync(process.argv[process.argv.length - 1])));
const messages = load(readFileSync(process.argv[process.argv.length - 2]));

const nextMove = infinitePlay({ facts, messages, viewMove: viewN1Move });

bot.hears(/.+/, ({ match, replyWithMarkdown: reply }) => {
  const { answer, question, answers } = nextMove(match[0]);
  return reply(`${answer}\n\n${question}`, Markup.keyboard(answers).extra());
});

bot.startPolling();
