import assert from 'assert';
import load from '../src/load';

describe('load', () => {
  it('puts input stream into single array', () => {
    assert.deepEqual({}, load('{}'));
  });
});
