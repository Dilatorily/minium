import { ipcRenderer } from 'electron';
import zmq, { Socket } from 'zeromq';

let rendererSocket: Socket;
let serverSocket: Socket;

export const initializeSockets = (onMessage: (message: unknown) => void): void => {
  rendererSocket = zmq.socket('pull');
  serverSocket = zmq.socket('push');

  ipcRenderer.on('rendererPort', (event, rendererPort) => {
    rendererSocket.connect(`tcp://127.0.0.1:${rendererPort}`);
    rendererSocket.on('message', (...buffer: Buffer[]) =>
      onMessage(buffer.toString() ? JSON.parse(buffer.toString()) : undefined),
    );
  });

  ipcRenderer.on('serverPort', (event, serverPort) => {
    serverSocket.bindSync(`tcp://127.0.0.1:${serverPort}`);
  });
};

export const sendMessage = (message: unknown): void => {
  serverSocket.send(JSON.stringify(message));
};
