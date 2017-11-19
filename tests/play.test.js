import assert from 'assert';
import sinon from 'sinon';
import play from '../src/play';
import { viewN1Move, view1NMove } from '../src/game';

function playWith({ answer, viewMove = viewN1Move, facts = [['read', 'lesen'], ['write', 'schreiben']] }) {
  const ask = sinon.stub().returns(Promise.resolve(answer));
  const write = sinon.spy();
  return play({
    ask,
    write,
    facts,
    messages: { positive: ['Right!'], negative: ['Wrong!'] },
    viewMove,
    rand: sinon.stub().returns(0),
  }).then(() => ({ ask, write }));
}

describe('play', () => {
  it('plays a N-1 game with wrong answer', () => playWith({ answer: 1 })
    .then(({ ask, write }) => {
      assert(ask.calledOnce);
      assert(write.calledTwice);
      assert.equal(write.getCall(0).args[0], 'lesen: [**[0]** read, **[1]** write]');
      assert.equal(write.getCall(1).args[0], '~~Wrong! ✕~~');
    }));
  it('plays a N-1 game with explanation', () => playWith({
    answer: 1,
    facts: [['read', 'lesen', 'Read explanation'], ['write', 'schreiben', 'Write explanation']],
  })
    .then(({ ask, write }) => {
      assert(ask.calledOnce);
      assert(write.calledThrice);
      assert.equal(write.getCall(2).args[0], 'Read explanation');
    }));
  it('plays a N-1 game with correct answer', () => playWith({ answer: 0 })
    .then(({ write }) => {
      assert(write.calledTwice);
      assert.equal(write.getCall(1).args[0], '**Right! ✓**');
    }));
  it('plays a 1-N game with correct answer', () => playWith({ answer: 0, viewMove: view1NMove })
    .then(({ write }) => {
      assert.equal(write.getCall(0).args[0], 'read: [**[0]** lesen, **[1]** schreiben]');
    }));
});
