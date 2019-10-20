import createMain from '../processes/main';

jest.mock('../processes/main', () => ({ __esModule: true, default: jest.fn() }));

describe('main', () => {
  it('calls the createMain method', async () => {
    await import('..');
    expect(createMain).toHaveBeenCalled();
  });
});
