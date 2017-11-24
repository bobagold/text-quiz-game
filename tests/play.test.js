import assert from 'assert';
import sinon from 'sinon';
import play, { formatQuestion, infinitePlay, infinitePlayManyGames } from '../src/play';
import { viewN1Move, view1NMove } from '../src/game';

function playWith(overrides) {
  return play({
    facts: [['read', 'lesen'], ['write', 'schreiben']],
    messages: { positive: ['Right! ✓'], negative: ['Wrong! ✕'] },
    viewMove: viewN1Move,
    rand: sinon.stub().returns(0),
    ...overrides,
  });
}

describe('formatQuestion', () => {
  it('formats a question for console', () => {
    assert.equal(formatQuestion({
      question: 'lesen',
      answers: ['read', 'write'],
    }), 'lesen: [**[0]** read, **[1]** write]');
  });
});

describe('play', () => {
  it('plays a N-1 game with wrong answer', () => {
    const nextMove = playWith({});
    assert.deepEqual(nextMove(), { question: { question: 'lesen', answers: ['read', 'write'] } });
    assert.deepEqual(nextMove(1), { answer: ['~~Wrong! ✕~~'] });
  });
  it('plays two steps', () => {
    const nextMove = playWith({
      facts: [['read', 'lesen'], ['write', 'schreiben'], ['go', 'gehen']],
      chunk: 2,
    });
    assert.deepEqual(nextMove(), { question: { question: 'lesen', answers: ['read', 'write'] } });
    assert.deepEqual(nextMove(1), { answer: ['~~Wrong! ✕~~'], question: { question: 'gehen', answers: ['go'] } });
    assert.deepEqual(nextMove(0), { answer: ['**Right! ✓**'] });
  });
  it('plays a N-1 game with explanation', () => {
    const nextMove = playWith({
      facts: [['read', 'lesen', 'Read explanation'], ['write', 'schreiben', 'Write explanation']],
    });
    nextMove();
    assert.deepEqual(nextMove(1), { answer: ['~~Wrong! ✕~~', 'Read explanation'] });
  });
  it('plays a N-1 game with correct answer', () => {
    const nextMove = playWith({});
    nextMove();
    assert.equal(nextMove(0).answer, '**Right! ✓**');
  });
  it('plays a 1-N game with correct answer', () => {
    const nextMove = playWith({ viewMove: view1NMove });
    assert.deepEqual(nextMove().question, { question: 'read', answers: ['lesen', 'schreiben'] });
  });
});

describe('infinitePlay', () => {
  it('runs forever', () => {
    const nextMove = infinitePlay({
      facts: [['read', 'lesen'], ['write', 'schreiben']],
      messages: { positive: ['Right! ✓'], negative: ['Wrong! ✕'] },
      viewMove: viewN1Move,
      rand: sinon.stub().returns(0),
      shuffle: a => a,
    });
    assert.deepEqual(nextMove(), {
      answer: 'Hello!',
      question: 'lesen',
      answers: ['read', 'write'],
    });
    const expected = {
      answer: '~~Wrong! ✕~~',
      question: 'lesen',
      answers: ['read', 'write'],
    };
    assert.deepEqual(nextMove(1), expected);
    assert.deepEqual(nextMove(1), expected);
    assert.deepEqual(nextMove(1), expected);
  });
});

describe('infinitePlayManyGames', () => {
  it('loops for each game', () => {
    const nextMove = infinitePlayManyGames({
      games: [[['read', 'lesen']], [['write', 'schreiben']]],
      messages: { positive: ['Right! ✓'], negative: ['Wrong! ✕'] },
      viewMove: viewN1Move,
      rand: sinon.stub().returns(0).onCall(2).returns(0.9)
        .onCall(4)
        .returns(0.9),
      shuffle: a => a,
    });
    assert.deepEqual(nextMove(), {
      answer: 'Hello!',
      question: 'lesen',
      answers: ['read'],
    });
    const expected = {
      answer: '~~Wrong! ✕~~',
      question: 'lesen',
      answers: ['read'],
    };
    const expectedEven = {
      answer: '~~Wrong! ✕~~',
      question: 'schreiben',
      answers: ['write'],
    };
    assert.deepEqual(nextMove(1), expectedEven);
    assert.deepEqual(nextMove(1), expected);
    assert.deepEqual(nextMove(1), expectedEven);
  });
});
