import zmq from 'zeromq';
import { initializeSockets, sendMessage } from '../production';

const mockSocket = { bindSync: jest.fn(), connect: jest.fn(), on: jest.fn(), send: jest.fn() };
jest.mock('zeromq', () => ({ socket: jest.fn(() => mockSocket) }));

describe('production', () => {
  let backupArgv: string[];
  const onMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    backupArgv = process.argv;
    process.argv = ['', '', '', '1234', '5678'];
  });

  afterEach(() => {
    process.argv = backupArgv;
  });

  describe('initializeSockets', () => {
    it('creates a pull socket', () => {
      initializeSockets(onMessage);
      expect(zmq.socket).toHaveBeenCalledWith('pull');
    });

    it('connects to the renderer port', () => {
      initializeSockets(onMessage);
      expect(mockSocket.connect).toHaveBeenCalledWith('tcp://127.0.0.1:1234');
    });

    it('listens to message events on the renderer socket', () => {
      initializeSockets(onMessage);
      expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('calls the onMessage callback on empty message events on the renderer socket', () => {
      initializeSockets(onMessage);
      mockSocket.on.mock.calls[0][1]();
      expect(onMessage).toHaveBeenCalled();
    });

    it('calls the onMessage callback on non-empty message events on the renderer socket', () => {
      initializeSockets(onMessage);
      mockSocket.on.mock.calls[0][1](Buffer.from('"test"'));
      expect(onMessage).toHaveBeenCalledWith('test');
    });

    it('creates a push socket', () => {
      initializeSockets(onMessage);
      expect(zmq.socket).toHaveBeenCalledWith('push');
    });

    it('binds to the server port on serverPort events', () => {
      initializeSockets(onMessage);
      expect(mockSocket.bindSync).toHaveBeenCalledWith('tcp://127.0.0.1:5678');
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      initializeSockets(onMessage);
    });

    it('sends a message on the renderer socket', () => {
      sendMessage('test message');
      expect(mockSocket.send).toHaveBeenCalledWith('"test message"');
    });
  });
});
