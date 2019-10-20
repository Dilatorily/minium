import { ipcRenderer } from 'electron';
import zmq from 'zeromq';
import { initializeSockets, sendMessage } from '../development';

const mockSocket = { bindSync: jest.fn(), connect: jest.fn(), on: jest.fn(), send: jest.fn() };
jest.mock('electron', () => ({ ipcRenderer: { on: jest.fn() } }));
jest.mock('zeromq', () => ({ socket: jest.fn(() => mockSocket) }));

describe('development', () => {
  const onMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeSockets', () => {
    it('creates a pull socket', () => {
      initializeSockets(onMessage);
      expect(zmq.socket).toHaveBeenCalledWith('pull');
    });

    it('creates a push socket', () => {
      initializeSockets(onMessage);
      expect(zmq.socket).toHaveBeenCalledWith('push');
    });

    it('listens to rendererPort events', () => {
      initializeSockets(onMessage);
      expect(ipcRenderer.on).toHaveBeenCalledWith('rendererPort', expect.any(Function));
    });

    it('connects to the renderer port on rendererPort events', () => {
      initializeSockets(onMessage);
      (ipcRenderer.on as jest.Mock).mock.calls[0][1](null, 1234);
      expect(mockSocket.connect).toHaveBeenCalledWith('tcp://127.0.0.1:1234');
    });

    it('listens to message events on the renderer socket', () => {
      initializeSockets(onMessage);
      (ipcRenderer.on as jest.Mock).mock.calls[0][1](null, 1234);
      expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('calls the onMessage callback on message events on the renderer socket', () => {
      initializeSockets(onMessage);
      (ipcRenderer.on as jest.Mock).mock.calls[0][1](null, 1234);
      mockSocket.on.mock.calls[0][1]();
      expect(onMessage).toHaveBeenCalled();
    });

    it('listens to serverPort events', () => {
      initializeSockets(onMessage);
      expect(ipcRenderer.on).toHaveBeenCalledWith('serverPort', expect.any(Function));
    });

    it('binds to the server port on serverPort events', () => {
      initializeSockets(onMessage);
      (ipcRenderer.on as jest.Mock).mock.calls[1][1](null, 1234);
      expect(mockSocket.bindSync).toHaveBeenCalledWith('tcp://127.0.0.1:1234');
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      initializeSockets(onMessage);
    });

    it('sends a message on the renderer socket', () => {
      sendMessage('test message');
      expect(mockSocket.send).toHaveBeenCalledWith('test message');
    });
  });
});
