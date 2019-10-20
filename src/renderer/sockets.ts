import { IpcRenderer } from 'electron';
import { Socket } from 'zeromq';

let rendererSocket: Socket;
let serverSocket: Socket;

interface WindowIpcRenderer {
  ipcRenderer: IpcRenderer;
}

export interface WindowZmq {
  zmq: { socket: (type: string) => Socket };
}

export const initializeSockets = (onMessage: (...buffer: Buffer[]) => void): void => {
  const { ipcRenderer, zmq } = (window as unknown) as Window & WindowIpcRenderer & WindowZmq;
  rendererSocket = zmq.socket('push');
  serverSocket = zmq.socket('pull');

  ipcRenderer.on('rendererPort', (event, rendererPort) => {
    rendererSocket.bindSync(`tcp://127.0.0.1:${rendererPort}`);
  });

  ipcRenderer.on('serverPort', (event, serverPort) => {
    serverSocket.connect(`tcp://127.0.0.1:${serverPort}`);
    serverSocket.on('message', onMessage);
  });
};

export const sendMessage = (message: string): void => {
  rendererSocket.send(message);
};
