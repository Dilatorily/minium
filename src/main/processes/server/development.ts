import { BrowserWindow, screen } from 'electron';

let window: BrowserWindow | null = null;

const createWindow = (ports: [number, number]): void => {
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
      window.webContents.send('rendererPort', ports[0]);
      window.webContents.send('serverPort', ports[1]);
    }
  });
};

export const createServer = async (ports: [number, number]): Promise<void> => {
  if (window === null) {
    createWindow(ports);
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
