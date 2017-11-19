import assert from 'assert';
import sinon from 'sinon';
import move, { view1NMove, viewN1Move, generateIndexes } from '../src/game';

function format({ question, answers }) {
  return `provide 0-based index of the correct translation of ${question}: [${answers.join(', ')}]`;
}

describe('game', () => {
  it('gets move', () => {
    const { facts, answer } = move('123456789'.split(''), [10, 11, 12], 3, 1);
    assert.equal('456', facts.join(''));
    assert.equal(11, answer);
  });
  it('formats a 1-N move', () => {
    assert.deepEqual({
      question: 'read',
      answers: ['lesen', 'schreiben'],
    }, view1NMove({
      facts: [['read', 'lesen'], ['write', 'schreiben']],
      answer: 0,
    }));
  });
  it('formats a move with another index', () => {
    assert.deepEqual({
      question: 'write',
      answers: ['lesen', 'schreiben'],
    }, view1NMove({
      facts: [['read', 'lesen'], ['write', 'schreiben']],
      answer: 1,
    }));
  });
  it('formats a N-1 move', () => {
    assert.deepEqual({
      question: 'lesen',
      answers: ['read', 'write'],
    }, viewN1Move({
      facts: [['read', 'lesen'], ['write', 'schreiben']],
      answer: 0,
    }));
  });
  it('formats text of a move', () => {
    const text = format({
      question: 'read',
      answers: ['lesen', 'schreiben'],
    });
    assert.equal('provide 0-based index of the correct translation of read: [lesen, schreiben]', text);
  });
  it('generates answer indexes', () => {
    const rand = sinon.stub();
    rand.onCall(0).returns(0.9);
    rand.onCall(1).returns(0.1);
    rand.onCall(2).returns(0.5);
    rand.onCall(3).returns(0.9);
    assert.deepEqual([2, 0, 1, 1], generateIndexes('123456789ab'.split(''), 3, rand));
  });
});
