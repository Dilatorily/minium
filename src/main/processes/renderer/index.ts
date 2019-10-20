import { join } from 'path';
import { app, BrowserWindow, screen } from 'electron';

let window: BrowserWindow | null = null;

const createWindow = (url: string, ports: [number, number]): void => {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  window = new BrowserWindow({
    height,
    show: false,
    webPreferences: {
      preload: join(app.getAppPath(), 'preload.js'),
    },
    width,
  });
  window.loadURL(url);
  window.on('closed', () => {
    window = null;
  });
  window.once('ready-to-show', () => window && window.show());
  window.webContents.on('did-finish-load', () => {
    if (window) {
      window.webContents.send('rendererPort', ports[0]);
      window.webContents.send('serverPort', ports[1]);
    }
  });
};

export default async (ports: [number, number]): Promise<void> => {
  if (window === null) {
    const { default: url } = await import(`./${process.env.NODE_ENV}`);
    createWindow(url, ports);
  }
};
