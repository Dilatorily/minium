import { app } from 'electron';
import { killServer } from '../server/production';

export const initializeEventListeners = async (): Promise<void> => {
  app.on('before-quit', killServer);
};
export const initializeTools = async (): Promise<void> => {
  // Do nothing
};
