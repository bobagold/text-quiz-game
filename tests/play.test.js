import assert from 'assert';
import sinon from 'sinon';
import play from '../src/play';
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

describe('play', () => {
  it('plays a N-1 game with wrong answer', () => {
    const nextMove = playWith({});
    assert.deepEqual(nextMove(), { question: 'lesen: [**[0]** read, **[1]** write]' });
    assert.deepEqual(nextMove(1), { answer: ['~~Wrong! ✕~~'] });
  });
  it('plays two steps', () => {
    const nextMove = playWith({
      facts: [['read', 'lesen'], ['write', 'schreiben'], ['go', 'gehen']],
      chunk: 2,
    });
    assert.deepEqual(nextMove(), { question: 'lesen: [**[0]** read, **[1]** write]' });
    assert.deepEqual(nextMove(1), { answer: ['~~Wrong! ✕~~'], question: 'gehen: [**[0]** go]' });
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
    assert.equal(nextMove().question, 'read: [**[0]** lesen, **[1]** schreiben]');
  });
});
