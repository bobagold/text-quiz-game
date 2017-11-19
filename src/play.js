import move, { generateIndexes } from './game';

function format({ question, answers }) {
  return `${question}: [${answers.map((a, i) => `**[${i}]** ${a}`).join(', ')}]`;
}

export default function play({
  facts, messages, ask, write, viewMove, chunk = 3, rand = Math.random,
}) {
  function positive() {
    return messages.positive[Math.floor(rand() * messages.positive.length)];
  }

  function negative() {
    return messages.negative[Math.floor(rand() * messages.negative.length)];
  }

  const answers = generateIndexes(facts, chunk, rand);
  let factsAnswer = null;
  let promise = Promise.resolve();

  function check(answer) {
    write(Number.parseInt(answer, 10) === factsAnswer.answer ? `**${positive()} ✓**` : `~~${negative()} ✕~~`);
    const explanation = factsAnswer.facts[factsAnswer.answer][2];
    if (explanation) {
      write(explanation);
    }
  }

  function checkAndAsk(i) {
    return (answer) => {
      if (factsAnswer !== null) {
        check(answer);
      }
      factsAnswer = move(facts, answers, chunk, i);
      write(format(viewMove(factsAnswer)));
      return ask();
    };
  }

  for (let i = 0; i < facts.length / chunk; i += 1) {
    promise = promise.then(checkAndAsk(i));
  }
  return promise.then(check);
}
