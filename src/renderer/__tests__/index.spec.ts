import render from '../render';
import { initializeSockets } from '../sockets';
import index from '..';

jest.mock('../render', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../sockets', () => ({ initializeSockets: jest.fn() }));

describe('renderer', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    jest.clearAllMocks();
  });

  it('calls initializeSockets with a function', () => {
    index();
    expect(initializeSockets).toHaveBeenCalledWith(expect.any(Function));
  });

  it('pass a callback to the initializeSockets function', () => {
    index();
    expect((initializeSockets as jest.Mock).mock.calls[0][0]).toEqual(expect.any(Function));
    (initializeSockets as jest.Mock).mock.calls[0][0]();
  });

  it('calls the render function', () => {
    index();
    expect(render).toHaveBeenCalled();
  });
});
