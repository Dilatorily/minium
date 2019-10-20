import { app } from 'electron';
import ElectronDebug from 'electron-debug';
import installExtension from 'electron-devtools-installer';
import * as development from '../development';

jest.mock('electron', () => ({ app: { on: jest.fn() } }));
jest.mock('electron-debug', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('electron-devtools-installer', () => ({
  __esModule: true,
  default: jest.fn(),
  REACT_DEVELOPER_TOOLS: 'Test React developer tools',
  REDUX_DEVTOOLS: 'Test Redux developer tools',
}));

describe('development', () => {
  describe('initializeEventListeners', () => {
    const callback = jest.fn();
    const event = { preventDefault: jest.fn() };

    beforeEach(() => {
      (app.on as jest.Mock).mockClear();
      callback.mockClear();
      event.preventDefault.mockClear();
    });

    it('listens to certificate-error events', async () => {
      await development.initializeEventListeners();
      expect(app.on).toHaveBeenCalledWith('certificate-error', expect.any(Function));
    });

    it('prevent the default behaviour of the certificate-error event', async () => {
      await development.initializeEventListeners();
      const onError = (app.on as jest.Mock).mock.calls[0][1];
      onError(event, null, null, null, null, callback);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('calls the callback function with true on a certificate-error event', async () => {
      await development.initializeEventListeners();
      const onError = (app.on as jest.Mock).mock.calls[0][1];
      onError(event, null, null, null, null, callback);
      expect(callback).toHaveBeenCalledWith(true);
    });
  });

  describe('initializeTools', () => {
    beforeEach(() => {
      ((ElectronDebug as unknown) as jest.Mock).mockClear();
      (installExtension as jest.Mock).mockClear();
    });

    it('calls the electron-debug function', async () => {
      await development.initializeTools();
      expect(ElectronDebug).toHaveBeenCalledWith({ devToolsMode: 'undocked', showDevTools: true });
    });

    it('install the React developer tools extension', async () => {
      await development.initializeTools();
      expect(installExtension).toHaveBeenCalledWith('Test React developer tools');
    });

    it('install the Redux developer tools extension', async () => {
      await development.initializeTools();
      expect(installExtension).toHaveBeenCalledWith('Test Redux developer tools');
    });
  });
});
