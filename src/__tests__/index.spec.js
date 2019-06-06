const identity = require('..');

describe('tests', () => {
  it('passes', () => {
    expect(identity(true)).toBe(true);
  });
});
