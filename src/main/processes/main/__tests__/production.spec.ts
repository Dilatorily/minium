import { app } from 'electron';
import * as production from '../production';
import { killServer } from '../../server/production';

jest.mock('electron', () => ({ app: { on: jest.fn() } }));
jest.mock('../../server/production', () => ({ killServer: jest.fn() }));

describe('production', () => {
  describe('initializeEventListeners', () => {
    beforeEach(() => {
      (app.on as jest.Mock).mockClear();
      (killServer as jest.Mock).mockClear();
    });

    it('listens to before-quit events', async () => {
      await production.initializeEventListeners();
      expect(app.on).toHaveBeenCalledWith('before-quit', killServer);
    });
  });

  describe('initializeTools', () => {
    it('returns a promise', () => {
      const results = production.initializeTools();
      expect(results).toEqual(expect.any(Promise));
    });

    it('returns a promsie of nothing', async () => {
      const results = await production.initializeTools();
      expect(results).toBeUndefined();
    });
  });
});
