import assert from 'assert';
import markdown from '../src/markdown';

describe('markdown', () => {
  it('replaces underscores with italic', () => {
    assert(markdown('**aa**').includes('aa'));
  });
  it('does not trim', () => {
    assert.equal('\n', markdown('aa\n').match(/\s*$/));
  });
});
