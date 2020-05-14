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

export const initializeSockets = (onMessage: (message: unknown) => void): void => {
  const { ipcRenderer, zmq } = (window as unknown) as Window & WindowIpcRenderer & WindowZmq;
  rendererSocket = zmq.socket('push');
  serverSocket = zmq.socket('pull');

  ipcRenderer.on('rendererPort', (event, rendererPort) => {
    rendererSocket.bindSync(`tcp://127.0.0.1:${rendererPort}`);
  });

  ipcRenderer.on('serverPort', (event, serverPort) => {
    serverSocket.connect(`tcp://127.0.0.1:${serverPort}`);
    serverSocket.on('message', (...buffer: Buffer[]) =>
      onMessage(buffer.toString() ? JSON.parse(buffer.toString()) : undefined),
    );
  });
};

export const sendMessage = (message: unknown): void => {
  rendererSocket.send(JSON.stringify(message));
};
