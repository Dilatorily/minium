import { ipcRenderer, IpcRenderer } from 'electron';

const mockZeroMQ = jest.fn();
jest.mock('zeromq', () => mockZeroMQ);

interface ExtendedWindow extends Window {
  ipcRenderer: IpcRenderer;
  zmq: unknown;
}

describe('preload', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    delete ((window as unknown) as ExtendedWindow).ipcRenderer;
    delete ((window as unknown) as ExtendedWindow).zmq;
  });

  it('adds the ipcRenderer to the window object', async () => {
    expect(((window as unknown) as ExtendedWindow).ipcRenderer).toBeUndefined();
    await import('..');
    expect(((window as unknown) as ExtendedWindow).ipcRenderer).toEqual(ipcRenderer);
  });

  it('adds the zmq to the window object', async () => {
    expect(((window as unknown) as ExtendedWindow).zmq).toBeUndefined();
    await import('..');
    expect(((window as unknown) as ExtendedWindow).zmq).toEqual(mockZeroMQ);
  });
});
