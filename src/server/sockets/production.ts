import zmq, { Socket } from 'zeromq';
import { ClientMessage } from './messages';
import { Message } from '../../shared/interface';

let rendererSocket: Socket;
let serverSocket: Socket;

export const initializeSockets = (onMessage: (message: ClientMessage) => void): void => {
  const rendererPort = process.argv[3];
  const serverPort = process.argv[4];

  rendererSocket = zmq.socket('pull');
  rendererSocket.connect(`tcp://127.0.0.1:${rendererPort}`);
  rendererSocket.on('message', (...buffer: Buffer[]) => {
    const message = buffer.toString();
    if (message) {
      onMessage(JSON.parse(message));
    }
  });

  serverSocket = zmq.socket('push');
  serverSocket.bindSync(`tcp://127.0.0.1:${serverPort}`);
};

export const sendMessage = (message: Message): void => {
  serverSocket.send(JSON.stringify(message));
};
