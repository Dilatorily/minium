import main from '../main';
import { createClient } from '../plaid';
import AccountError from '../plaid/AccountError';
import ConfigurationError from '../plaid/ConfigurationError';
import getSockets, { Sockets } from '../sockets';
import { MISSING_ACCOUNTS, MISSING_CONFIGURATION, SAVE_CONFIGURATION } from '../../shared/messages';

jest.mock('keytar', () => ({
  getPassword: jest.fn().mockResolvedValue('"test password"'),
  setPassword: jest.fn(),
}));
jest.mock('../plaid', () => ({ createClient: jest.fn(), saveConfiguration: jest.fn() }));
jest.mock('../sockets', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({ initializeSockets: jest.fn(), sendMessage: jest.fn() }),
}));

describe('main', () => {
  let sockets: Sockets;

  beforeEach(async () => {
    jest.clearAllMocks();
    sockets = await getSockets();
  });

  it('calls the initializeSockets method', async () => {
    await main();
    expect(sockets.initializeSockets).toHaveBeenCalledWith(expect.any(Function));
  });

  it('calls the initializeSockets method with a callback', async () => {
    await main();
    expect((sockets.initializeSockets as jest.Mock).mock.calls[0][0]).toEqual(expect.any(Function));
    (sockets.initializeSockets as jest.Mock).mock.calls[0][0]({
      payload: { clientKey: 'test clientKey', publicKey: 'test publicKey', secret: 'test secret' },
      type: SAVE_CONFIGURATION,
    });
  });

  it('sends a missing accounts message when it catches an AccountError', async () => {
    (createClient as jest.Mock).mockRejectedValue(new AccountError());
    await main();
    expect(sockets.sendMessage).toHaveBeenCalledWith({ type: MISSING_ACCOUNTS });
  });

  it('sends a missing configuration message when it catches a ConfigurationError', async () => {
    (createClient as jest.Mock).mockRejectedValue(new ConfigurationError());
    await main();
    expect(sockets.sendMessage).toHaveBeenCalledWith({ type: MISSING_CONFIGURATION });
  });

  it("rethrows the error if it's not a handled error type", async () => {
    const error = new Error('test error');
    (createClient as jest.Mock).mockRejectedValue(error);
    await expect(main()).rejects.toThrowError(error);
  });
});
