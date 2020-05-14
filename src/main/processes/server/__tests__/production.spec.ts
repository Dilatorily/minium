import { fork } from 'child_process';
import { createServer, killServer } from '../production';

const mockKill = jest.fn();
jest.mock('electron', () => ({ app: { getAppPath: (): string => '/test/app/path' } }));
jest.mock('child_process', () => ({ fork: jest.fn(() => ({ kill: mockKill })) }));

describe('production', () => {
  beforeEach(() => {
    killServer();
    jest.clearAllMocks();
  });

  describe('createServer', () => {
    it('creates a child process if one does not exist already', () => {
      createServer([1234, 5678]);
      expect(fork).toHaveBeenCalledTimes(1);
      expect(fork).toHaveBeenCalledWith('/test/app/path/server.js', [
        '--production',
        '1234',
        '5678',
      ]);
    });

    it('does not create a child process if one already exists', () => {
      createServer([1234, 5678]);
      createServer([1234, 5678]);
      expect(fork).toHaveBeenCalledTimes(1);
    });
  });

  describe('killServer', () => {
    it('kills the child process if it exists', () => {
      createServer([1234, 5678]);
      killServer();
      expect(mockKill).toHaveBeenCalled();
      expect(mockKill).toHaveBeenCalledTimes(1);
    });

    it('does nothing if no child process exists', () => {
      createServer([1234, 5678]);
      killServer();
      killServer();
      expect(mockKill).toHaveBeenCalledTimes(1);
    });
  });
});
