import move, { generateIndexes } from './game';
import shuffleArray from './shuffle';

function formatQuestion({ question, answers }) {
  return `${question}: [${answers.map((a, i) => `**[${i}]** ${a}`).join(', ')}]`;
}

export default function play({
  facts, messages, viewMove, chunk = 3, rand = Math.random, format = formatQuestion,
}) {
  function positive() {
    return messages.positive[Math.floor(rand() * messages.positive.length)];
  }

  function negative() {
    return messages.negative[Math.floor(rand() * messages.negative.length)];
  }

  const answers = generateIndexes(facts, chunk, rand);
  let factsAnswer = null;

  function check(answer) {
    const ret = [];
    const correct = Number.parseInt(answer, 10) === factsAnswer.answer ||
      answer === viewMove(factsAnswer).answers[factsAnswer.answer];
    ret.push(correct ? `**${positive()}**` : `~~${negative()}~~`);
    const explanation = factsAnswer.facts[factsAnswer.answer][2];
    if (explanation) {
      ret.push(explanation);
    }
    return ret;
  }

  function checkAndAsk(i) {
    return (answer) => {
      const ret = {};
      if (factsAnswer !== null) {
        ret.answer = check(answer);
      }
      factsAnswer = move(facts, answers, chunk, i);
      ret.question = format(viewMove(factsAnswer));
      return ret;
    };
  }

  let i = 0;
  return (answer) => {
    if (i < facts.length / chunk) {
      const ret = checkAndAsk(i)(answer);
      i += 1;
      return ret;
    }
    return { answer: check(answer) };
  };
}

export function infinitePlay({ facts, shuffle = shuffleArray, ...overrides }) {
  function format(q) {
    return q;
  }
  let nextMove = play({
    facts, ...overrides, format,
  });

  return (message) => {
    let currentMove = nextMove(message);
    const answer = currentMove.answer ? currentMove.answer.join('\n') : 'Hello!';
    if (!currentMove.question) {
      nextMove = play({
        facts: shuffle(facts), ...overrides, format,
      });
      currentMove = nextMove();
    }
    return { answer, ...currentMove.question };
  };
}
