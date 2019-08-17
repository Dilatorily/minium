import createServer from '..';

const mockCreateServer = jest.fn();
jest.mock('../development', () => ({ createServer: mockCreateServer }));

describe('server', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    jest.clearAllMocks();
  });

  it('calls the createServer method from the environment', async () => {
    await createServer([1234, 5678]);
    expect(mockCreateServer).toHaveBeenCalledWith([1234, 5678]);
  });
});
