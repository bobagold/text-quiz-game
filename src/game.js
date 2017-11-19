export default function move(facts, answers, chunk, offset) {
  return {
    facts: facts.slice(chunk * offset, chunk * (offset + 1)),
    answer: answers[offset],
  };
}

export function generateIndexes(a, chunk, rand) {
  const ret = [];
  for (let i = 0; i < Math.floor(a.length / chunk); i += 1) {
    ret.push(Math.floor(rand() * chunk));
  }
  const rest = a.length % chunk;
  if (rest > 0) {
    ret.push(Math.floor(rand() * rest));
  }
  return ret;
}

export function view1NMove({ facts, answer }) {
  return {
    question: facts[answer][0],
    answers: [].concat(...facts.map(o => o[1])),
  };
}

export function viewN1Move({ facts, answer }) {
  return {
    question: facts[answer][1],
    answers: [].concat(...facts.map(o => o[0])),
  };
}
