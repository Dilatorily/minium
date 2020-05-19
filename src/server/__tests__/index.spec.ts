import { beforeEach, describe, expect, it } from '@jest/globals';

describe('server', () => {
  let main: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    main = jest.fn();
    jest.doMock('../main', () => ({ __esModule: true, default: main }));
  });

  it('calls the main method', async () => {
    await import('..');
    expect(main).toHaveBeenCalled();
  });
});
