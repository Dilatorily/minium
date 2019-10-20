import { Sockets } from '../sockets';

describe('server', () => {
  let getSockets: () => Promise<Sockets>;
  let sockets: Sockets;

  beforeEach(() => {
    sockets = { initializeSockets: jest.fn(), sendMessage: jest.fn() };
    getSockets = (): Promise<Sockets> => Promise.resolve(sockets);
    jest.resetModules();
    jest.doMock('../sockets', () => ({ __esModule: true, default: getSockets }));
  });

  it('calls the initializeSockets method', async () => {
    await import('..');
    expect(sockets.initializeSockets).toHaveBeenCalledWith(expect.any(Function));
  });

  it('calls the initializeSockets method with a callback', async () => {
    await import('..');
    (sockets.initializeSockets as jest.Mock).mock.calls[0][0]();
  });
});
