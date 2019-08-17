import { app } from 'electron';
import getPort from 'get-port';
import createRenderer from '../renderer';
import createServer from '../server';

const createProcesses = (ports: [number, number]): void => {
  createRenderer(ports);
  createServer(ports);
};

export default async (): Promise<void> => {
  const { initializeEventListeners, initializeTools } = await import(`./${process.env.NODE_ENV}`);
  await initializeTools();
  const ports = await Promise.all([getPort(), getPort()]);

  if (app.isReady()) {
    createProcesses(ports);
  } else {
    app.on('ready', () => createProcesses(ports));
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => createProcesses(ports));
  await initializeEventListeners();
};
