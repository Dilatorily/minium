import { IpcRenderer } from 'electron';
import { Socket } from 'zeromq';
import { Message } from '../shared/interface';

let rendererSocket: Socket;
let serverSocket: Socket;

interface WindowIpcRenderer {
  ipcRenderer: IpcRenderer;
}

export interface WindowZmq {
  zmq: { socket: (type: string) => Socket };
}

export const initializeSockets = (onMessage: (message: Message) => void): void => {
  const { ipcRenderer, zmq } = (window as unknown) as Window & WindowIpcRenderer & WindowZmq;
  rendererSocket = zmq.socket('push');
  serverSocket = zmq.socket('pull');

  ipcRenderer.on('rendererPort', (event, rendererPort) => {
    rendererSocket.bindSync(`tcp://127.0.0.1:${rendererPort}`);
  });

  ipcRenderer.on('serverPort', (event, serverPort) => {
    serverSocket.connect(`tcp://127.0.0.1:${serverPort}`);
    serverSocket.on('message', (...buffer: Buffer[]) => {
      const message = buffer.toString();
      if (message) {
        onMessage(JSON.parse(message));
      }
    });
  });
};

export const sendMessage = (message: Message): void => {
  rendererSocket.send(JSON.stringify(message));
};
