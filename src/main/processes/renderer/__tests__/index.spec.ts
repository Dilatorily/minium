describe('renderer', () => {
  let BrowserWindow: jest.Mock;
  let createRenderer: (ports: [number, number]) => Promise<void>;
  let ports: [number, number];
  let window: {
    loadURL: jest.Mock;
    on: jest.Mock;
    once: jest.Mock;
    show: jest.Mock;
    webContents: { on: jest.Mock; send: jest.Mock };
  };

  beforeEach(async () => {
    process.env.NODE_ENV = 'development';

    jest.resetModules();
    window = {
      loadURL: jest.fn(),
      on: jest.fn(),
      once: jest.fn(),
      show: jest.fn(),
      webContents: {
        on: jest.fn(),
        send: jest.fn(),
      },
    };
    jest.doMock('electron', () => ({
      app: {
        getAppPath: jest.fn(() => 'test appPath'),
      },
      BrowserWindow: jest.fn(() => window),
      screen: {
        getPrimaryDisplay: jest.fn(() => ({
          workAreaSize: { height: 'test height', width: 'test width' },
        })),
      },
    }));
    jest.doMock('../development', () => ({ __esModule: true, default: 'test url' }));

    ({ BrowserWindow: BrowserWindow as unknown } = await import('electron'));
    ({ default: createRenderer } = await import('..'));

    ports = [1234, 5678];
  });

  it('returns a promise', () => {
    const results = createRenderer(ports);
    expect(results).toEqual(expect.any(Promise));
  });

  it('creates a BrowserWindow', async () => {
    await createRenderer(ports);
    expect(BrowserWindow).toHaveBeenCalledWith({
      height: 'test height',
      show: false,
      webPreferences: {
        preload: 'test appPath/preload.js',
      },
      width: 'test width',
    });
  });

  it("loads the environment's URL", async () => {
    await createRenderer(ports);
    expect(window.loadURL).toHaveBeenCalledWith('test url');
  });

  it('listens to closed events', async () => {
    await createRenderer(ports);
    expect(window.on).toHaveBeenCalledWith('closed', expect.any(Function));
  });

  it('listens to ready-to-show events once', async () => {
    await createRenderer(ports);
    expect(window.once).toHaveBeenCalledWith('ready-to-show', expect.any(Function));
  });

  it('listens to did-finish-load events', async () => {
    await createRenderer(ports);
    expect(window.webContents.on).toHaveBeenCalledWith('did-finish-load', expect.any(Function));
  });

  it('does not create two BrowserWindow if one already exists', async () => {
    await createRenderer(ports);
    await createRenderer(ports);
    expect(BrowserWindow).toHaveBeenCalledTimes(1);
  });

  it('creates two BrowserWindow if the first one was closed', async () => {
    await createRenderer(ports);
    window.on.mock.calls[0][1]();
    await createRenderer(ports);
    expect(BrowserWindow).toHaveBeenCalledTimes(2);
  });

  it('shows the BrowserWindow if a ready-to-show event is triggered', async () => {
    await createRenderer(ports);
    window.once.mock.calls[0][1]();
    expect(window.show).toHaveBeenCalled();
  });

  it('does not show the BrowserWindow if a ready-to-show event is triggered and it is closed', async () => {
    await createRenderer(ports);
    window.on.mock.calls[0][1]();
    window.once.mock.calls[0][1]();
    expect(window.show).not.toHaveBeenCalled();
  });

  it('sends the rendererPort if a did-finish-load event is triggered and it is open', async () => {
    await createRenderer(ports);
    window.webContents.on.mock.calls[0][1]();
    expect(window.webContents.send).toHaveBeenCalledWith('rendererPort', 1234);
  });

  it('sends the serverPort if a did-finish-load event is triggered and it is open', async () => {
    await createRenderer(ports);
    window.webContents.on.mock.calls[0][1]();
    expect(window.webContents.send).toHaveBeenCalledWith('serverPort', 5678);
  });

  it('does not send the rendererPort if a did-finish-load event is triggered and it is closed', async () => {
    await createRenderer(ports);
    window.on.mock.calls[0][1]();
    window.webContents.on.mock.calls[0][1]();
    expect(window.webContents.send).not.toHaveBeenCalledWith('rendererPort', 1234);
  });

  it('does not send the serverPort if a did-finish-load event is triggered and it is closed', async () => {
    await createRenderer(ports);
    window.on.mock.calls[0][1]();
    window.webContents.on.mock.calls[0][1]();
    expect(window.webContents.send).not.toHaveBeenCalledWith('serverPort', 5678);
  });
});

export {};
