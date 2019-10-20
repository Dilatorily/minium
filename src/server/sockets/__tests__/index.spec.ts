import { Sockets } from '..';

describe('socket', () => {
  let backupArgv: string[];
  let getSockets: () => Promise<Sockets>;

  beforeEach(async () => {
    backupArgv = process.argv;
    jest.resetModules();
    jest.doMock('../development', () => ({
      __esModule: true,
      initializeSockets: 'development initializeSockets',
      sendMessage: 'development sendMessage',
    }));
    ({ default: getSockets } = await import('..'));
  });

  afterEach(() => {
    process.argv = backupArgv;
  });

  it('returns a promise', () => {
    const results = getSockets();
    expect(results).toEqual(expect.any(Promise));
  });

  it("returns the development's sockets if called with the development flags", async () => {
    process.argv = ['', '', '--development'];
    jest.resetModules();
    jest.doMock('../development', () => ({
      __esModule: true,
      initializeSockets: 'development initializeSockets',
      sendMessage: 'development sendMessage',
    }));
    ({ default: getSockets } = await import('..'));
    const results = await getSockets();
    expect(results).toEqual({
      initializeSockets: 'development initializeSockets',
      sendMessage: 'development sendMessage',
    });
  });

  it("returns the production's sockets if called with the production flags", async () => {
    process.argv = ['', '', '--production'];
    jest.resetModules();
    jest.doMock('../production', () => ({
      __esModule: true,
      initializeSockets: 'production initializeSockets',
      sendMessage: 'production sendMessage',
    }));
    ({ default: getSockets } = await import('..'));
    const results = await getSockets();
    expect(results).toEqual({
      initializeSockets: 'production initializeSockets',
      sendMessage: 'production sendMessage',
    });
  });
});
