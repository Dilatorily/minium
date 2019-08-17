import { BrowserWindow, screen } from 'electron';

let window: BrowserWindow | null = null;

const createWindow = (port: number): void => {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  window = new BrowserWindow({
    height,
    show: false,
    webPreferences: { nodeIntegration: true },
    width,
  });
  window.loadURL(`https://localhost:${process.env.SERVER_PORT}`);
  window.webContents.on('did-finish-load', () => {
    if (window) {
      window.webContents.send('port', port);
    }
  });
};

export const createServer = async (port: number): Promise<void> => {
  if (window === null) {
    createWindow(port);
  } else {
    window.webContents.openDevTools();
  }
};

export const killServer = (): void => {
  if (window) {
    window.close();
    window = null;
  }
};
