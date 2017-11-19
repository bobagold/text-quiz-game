import assert from 'assert';
import shuffle from '../src/shuffle';

describe('randomize', () => {
  it('shuffles the data', () => {
    const shuffled = shuffle('123456789'.split('')).join('');
    assert.notEqual('123456789', shuffled);
    assert.equal('123456789', shuffled.split('').sort().join(''));
  });
});
