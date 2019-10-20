describe('renderer', () => {
  const initializeSockets = jest.fn();

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    jest.clearAllMocks();
    jest.resetModules();
    jest.doMock('../sockets', () => ({ initializeSockets }));
  });

  it('calls initializeSockets with a function', async () => {
    await import('..');
    expect(initializeSockets).toHaveBeenCalledWith(expect.any(Function));
  });

  it('pass a callback to the initializeSockets function', async () => {
    await import('..');
    initializeSockets.mock.calls[0][0]();
  });
});

export {};
