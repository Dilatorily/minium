import { app } from 'electron';
import ElectronDebug from 'electron-debug'; // eslint-disable-line import/no-extraneous-dependencies
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer'; // eslint-disable-line import/no-extraneous-dependencies

export const initializeEventListeners = async (): Promise<void> => {
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });
};

export const initializeTools = async (): Promise<void> => {
  ElectronDebug({ devToolsMode: 'undocked', showDevTools: true });
  await Promise.all([installExtension(REACT_DEVELOPER_TOOLS), installExtension(REDUX_DEVTOOLS)]);
};
