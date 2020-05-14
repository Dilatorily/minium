import { initializeSockets, sendMessage, WindowZmq } from '../sockets';

interface WindowIpcRenderer {
  ipcRenderer: { on: jest.Mock };
}

describe('socket', () => {
  const onMessage = jest.fn();
  const socket = { bindSync: jest.fn(), connect: jest.fn(), on: jest.fn(), send: jest.fn() };

  beforeAll(() => {
    Object.defineProperties(window, {
      ipcRenderer: { value: { on: jest.fn() } },
      zmq: { value: { socket: jest.fn(() => socket) } },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeSockets', () => {
    it('creates a push socket', () => {
      initializeSockets(onMessage);
      expect(
        ((window as unknown) as Window & WindowIpcRenderer & WindowZmq).zmq.socket,
      ).toHaveBeenCalledWith('push');
    });

    it('creates a pull socket', () => {
      initializeSockets(onMessage);
      expect(
        ((window as unknown) as Window & WindowIpcRenderer & WindowZmq).zmq.socket,
      ).toHaveBeenCalledWith('pull');
    });

    it('listens to rendererPort events', () => {
      initializeSockets(onMessage);
      expect(
        ((window as unknown) as Window & WindowIpcRenderer & WindowZmq).ipcRenderer.on,
      ).toHaveBeenCalledWith('rendererPort', expect.any(Function));
    });

    it('binds to the renderer port on rendererPort events', () => {
      initializeSockets(onMessage);
      ((window as unknown) as Window &
        WindowIpcRenderer &
        WindowZmq).ipcRenderer.on.mock.calls[0][1](null, 1234);
      expect(socket.bindSync).toHaveBeenCalledWith('tcp://127.0.0.1:1234');
    });

    it('listens to serverPort events', () => {
      initializeSockets(onMessage);
      expect(
        ((window as unknown) as Window & WindowIpcRenderer & WindowZmq).ipcRenderer.on,
      ).toHaveBeenCalledWith('serverPort', expect.any(Function));
    });

    it('connects to the server port on serverPort events', () => {
      initializeSockets(onMessage);
      ((window as unknown) as Window &
        WindowIpcRenderer &
        WindowZmq).ipcRenderer.on.mock.calls[1][1](null, 1234);
      expect(socket.connect).toHaveBeenCalledWith('tcp://127.0.0.1:1234');
    });

    it('listens to message events on the server socket', () => {
      initializeSockets(onMessage);
      ((window as unknown) as Window &
        WindowIpcRenderer &
        WindowZmq).ipcRenderer.on.mock.calls[1][1](null, 1234);
      expect(socket.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('does not call the onMessage callback on empty message events on the server socket', () => {
      initializeSockets(onMessage);
      ((window as unknown) as Window &
        WindowIpcRenderer &
        WindowZmq).ipcRenderer.on.mock.calls[1][1](null, 1234);
      socket.on.mock.calls[0][1]();
      expect(onMessage).not.toHaveBeenCalled();
    });

    it('calls the onMessage callback on non-empty message events on the server socket', () => {
      initializeSockets(onMessage);
      ((window as unknown) as Window &
        WindowIpcRenderer &
        WindowZmq).ipcRenderer.on.mock.calls[1][1](null, 1234);
      socket.on.mock.calls[0][1](Buffer.from('"test"'));
      expect(onMessage).toHaveBeenCalledWith('test');
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      initializeSockets(onMessage);
    });

    it('sends a message on the renderer socket', () => {
      sendMessage({ type: 'test message' });
      expect(socket.send).toHaveBeenCalledWith('{"type":"test message"}');
    });
  });
});
