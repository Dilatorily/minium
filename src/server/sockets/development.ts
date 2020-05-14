import { ipcRenderer } from 'electron';
import zmq, { Socket } from 'zeromq';
import { ClientMessage } from './messages';
import { Message } from '../../shared/interface';

let rendererSocket: Socket;
let serverSocket: Socket;

export const initializeSockets = (onMessage: (message: ClientMessage) => void): void => {
  rendererSocket = zmq.socket('pull');
  serverSocket = zmq.socket('push');

  ipcRenderer.on('rendererPort', (event, rendererPort) => {
    rendererSocket.connect(`tcp://127.0.0.1:${rendererPort}`);
    rendererSocket.on('message', (...buffer: Buffer[]) => {
      const message = buffer.toString();
      if (message) {
        onMessage(JSON.parse(message));
      }
    });
  });

  ipcRenderer.on('serverPort', (event, serverPort) => {
    serverSocket.bindSync(`tcp://127.0.0.1:${serverPort}`);
  });
};

export const sendMessage = (message: Message): void => {
  serverSocket.send(JSON.stringify(message));
};
