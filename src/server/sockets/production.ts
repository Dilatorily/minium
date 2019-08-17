import zmq, { Socket } from 'zeromq';

let rendererSocket: Socket;
let serverSocket: Socket;

export const initializeSockets = (onMessage: (...buffer: Buffer[]) => void): void => {
  const rendererPort = process.argv[3];
  const serverPort = process.argv[4];

  rendererSocket = zmq.socket('pull');
  rendererSocket.connect(`tcp://127.0.0.1:${rendererPort}`);
  rendererSocket.on('message', onMessage);

  serverSocket = zmq.socket('push');
  serverSocket.bindSync(`tcp://127.0.0.1:${serverPort}`);
};

export const sendMessage = (message: string): void => {
  serverSocket.send(message);
};
