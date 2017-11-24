import move, { generateIndexes } from './game';
import shuffleArray from './shuffle';

export function formatQuestion({ question, answers }) {
  return `${question}: [${answers.map((a, i) => `**[${i}]** ${a}`).join(', ')}]`;
}

export default function play({
  facts, messages, viewMove, chunk = 3, rand = Math.random,
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
    const correct = Number.parseInt(answer, 10) === factsAnswer.answer ||
      answer === viewMove(factsAnswer).answers[factsAnswer.answer];
    const message = correct ? `**${positive()}**` : `~~${negative()}~~`;
    const explanation = factsAnswer.facts[factsAnswer.answer].slice(...(correct ? [2, 3] : [2]));
    return [message, ...explanation];
  }

  function checkAndAsk(i) {
    return (answer) => {
      const ret = {};
      if (factsAnswer !== null) {
        ret.answer = check(answer);
      }
      factsAnswer = move(facts, answers, chunk, i);
      ret.question = viewMove(factsAnswer);
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
  let nextMove = play({
    facts, ...overrides,
  });

  return (message) => {
    let currentMove = nextMove(message);
    const answer = currentMove.answer ? currentMove.answer.join('\n') : 'Hello!';
    if (!currentMove.question) {
      nextMove = play({
        facts: shuffle(facts), ...overrides,
      });
      currentMove = nextMove();
    }
    return { answer, ...currentMove.question };
  };
}

export function infinitePlayManyGames({ games, rand = Math.random, ...data }) {
  const nextMoves = games.map(facts => infinitePlay({
    facts, ...data,
  }));
  let currentGame = Math.floor(rand() * nextMoves.length);
  const lastMoves = [];
  return (answer) => {
    const currentMove = nextMoves[currentGame](answer);
    lastMoves[currentGame] = currentMove;
    currentGame = Math.floor(rand() * nextMoves.length);
    const nextMove = !lastMoves[currentGame] ? nextMoves[currentGame]('') : lastMoves[currentGame];
    return {
      answer: currentMove.answer,
      question: nextMove.question,
      answers: nextMove.answers,
    };
  };
}
