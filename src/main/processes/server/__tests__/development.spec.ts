import { BrowserWindow } from 'electron';
import { createServer, killServer } from '../development';

const mockWindow = {
  close: jest.fn(),
  loadURL: jest.fn(),
  on: jest.fn(),
  webContents: {
    on: jest.fn(),
    openDevTools: jest.fn(),
    send: jest.fn(),
  },
};
jest.mock('electron', () => ({
  BrowserWindow: jest.fn(() => mockWindow),
  screen: {
    getPrimaryDisplay: jest.fn(() => ({
      workAreaSize: { height: 'test height', width: 'test width' },
    })),
  },
}));

describe('development', () => {
  beforeEach(() => {
    process.env.SERVER_PORT = '5678';
    killServer();
    jest.clearAllMocks();
  });

  describe('createServer', () => {
    it('returns a promise', () => {
      const results = createServer(1234);
      expect(results).toEqual(expect.any(Promise));
    });

    it('creates a BrowserWindow if a window does not exist', () => {
      createServer(1234);
      expect(BrowserWindow).toHaveBeenCalledWith({
        height: 'test height',
        show: false,
        webPreferences: { nodeIntegration: true },
        width: 'test width',
      });
    });

    it("loads server's URL", () => {
      createServer(1234);
      expect(mockWindow.loadURL).toHaveBeenCalledWith('https://localhost:5678');
    });

    it('listens to did-finish-load events', () => {
      createServer(1234);
      expect(mockWindow.webContents.on).toHaveBeenCalledWith(
        'did-finish-load',
        expect.any(Function),
      );
    });

    it('does not create two BrowserWindow if one already exists', () => {
      createServer(1234);
      createServer(1234);
      expect(BrowserWindow).toHaveBeenCalledTimes(1);
    });

    it('opens the Chrome dev tools if a BrowserWindow already exists', () => {
      createServer(1234);
      createServer(1234);
      expect(mockWindow.webContents.openDevTools).toHaveBeenCalled();
    });

    it('sends the port if a did-finish-load event is triggered and it is open', async () => {
      createServer(1234);
      mockWindow.webContents.on.mock.calls[0][1]();
      expect(mockWindow.webContents.send).toHaveBeenCalledWith('port', 1234);
    });

    it('does not send the port if a did-finish-load event is triggered and it is closed', async () => {
      createServer(1234);
      killServer();
      mockWindow.webContents.on.mock.calls[0][1]();
      expect(mockWindow.webContents.send).not.toHaveBeenCalledWith('port', 1234);
    });
  });

  describe('killServer', () => {
    it('closes the window if it exists', () => {
      createServer(1234);
      killServer();
      expect(mockWindow.close).toHaveBeenCalled();
      expect(mockWindow.close).toHaveBeenCalledTimes(1);
    });

    it('does nothing if no window exists', () => {
      createServer(1234);
      killServer();
      killServer();
      expect(mockWindow.close).toHaveBeenCalledTimes(1);
    });
  });
});
