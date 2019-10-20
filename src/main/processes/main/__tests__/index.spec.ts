import { app } from 'electron';
import getPort from 'get-port';
import initializeProcess from '..';
import { initializeEventListeners, initializeTools } from '../development';
import createRenderer from '../../renderer';
import createServer from '../../server';

jest.mock('electron', () => ({
  app: { isReady: jest.fn(() => true), on: jest.fn(), quit: jest.fn() },
}));
jest.mock('get-port', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../development', () => ({
  initializeEventListeners: jest.fn(() => Promise.resolve()),
  initializeTools: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../renderer', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../server', () => ({ __esModule: true, default: jest.fn() }));

describe('main', () => {
  let backupNodeEnv: string | undefined;
  let backupPlatform: string;

  beforeEach(() => {
    backupNodeEnv = process.env.NODE_ENV;
    backupPlatform = process.platform;

    process.env.NODE_ENV = 'development';
    (app.on as jest.Mock).mockClear();
    (app.quit as jest.Mock).mockClear();
    ((getPort as unknown) as jest.Mock).mockClear();
    (initializeEventListeners as jest.Mock).mockClear();
    (initializeTools as jest.Mock).mockClear();
    (createRenderer as jest.Mock).mockClear();
    (createServer as jest.Mock).mockClear();

    ((getPort as unknown) as jest.Mock)
      .mockReturnValueOnce(Promise.resolve(1234))
      .mockReturnValueOnce(Promise.resolve(5678));
  });

  afterEach(() => {
    process.env.NODE_ENV = backupNodeEnv;
    Object.defineProperty(process, 'platform', { value: backupPlatform });
  });

  it('calls the initializeTools method', async () => {
    await initializeProcess();
    expect(initializeTools).toHaveBeenCalled();
  });

  it('calls get-port twice', async () => {
    await initializeProcess();
    expect(getPort).toHaveBeenCalledTimes(2);
  });

  it('calls the createRenderer method if the Electron application is ready', async () => {
    await initializeProcess();
    expect(createRenderer).toHaveBeenCalledWith([1234, 5678]);
  });

  it('calls the createServer method if the Electron application is ready', async () => {
    await initializeProcess();
    expect(createServer).toHaveBeenCalledWith([1234, 5678]);
  });

  it('listens to the ready event if the Electron application is not ready', async () => {
    (app.isReady as jest.Mock).mockReturnValueOnce(false);
    await initializeProcess();
    expect(app.on).toHaveBeenCalledWith('ready', expect.any(Function));
  });

  it('calls the createRenderer method if the Electron application is not ready and it triggers a ready event', async () => {
    (app.isReady as jest.Mock).mockReturnValueOnce(false);
    await initializeProcess();
    (app.on as jest.Mock).mock.calls[0][1]();
    expect(createRenderer).toHaveBeenCalledWith([1234, 5678]);
  });

  it('calls the createServer method if the Electron application is not ready and it triggers a ready event', async () => {
    (app.isReady as jest.Mock).mockReturnValueOnce(false);
    await initializeProcess();
    (app.on as jest.Mock).mock.calls[0][1]();
    expect(createServer).toHaveBeenCalledWith([1234, 5678]);
  });

  it('listens to the window-all-closed event', async () => {
    await initializeProcess();
    expect(app.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function));
  });

  it('calls the app.quit method if a window-all-closed event is triggered and the platform is darwin', async () => {
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    await initializeProcess();
    (app.on as jest.Mock).mock.calls[0][1]();
    expect(app.quit).not.toHaveBeenCalled();
  });

  it('calls the app.quit method if a window-all-closed event is triggered and the platform is not darwin', async () => {
    Object.defineProperty(process, 'platform', { value: 'linux' });
    await initializeProcess();
    (app.on as jest.Mock).mock.calls[0][1]();
    expect(app.quit).toHaveBeenCalled();
  });

  it('listens to the activate event', async () => {
    await initializeProcess();
    expect(app.on).toHaveBeenCalledWith('activate', expect.any(Function));
  });

  it('calls the createRenderer method if the Electron application triggers an activate event', async () => {
    await initializeProcess();
    (createRenderer as jest.Mock).mockClear();
    (app.on as jest.Mock).mock.calls[1][1]();
    expect(createRenderer).toHaveBeenCalledWith([1234, 5678]);
  });

  it('calls the createServer method if the Electron applicationtriggers an activate event', async () => {
    await initializeProcess();
    (createServer as jest.Mock).mockClear();
    (app.on as jest.Mock).mock.calls[1][1]();
    expect(createServer).toHaveBeenCalledWith([1234, 5678]);
  });

  it('calls the initializeEventListeners method', async () => {
    await initializeProcess();
    expect(initializeEventListeners).toHaveBeenCalled();
  });
});
