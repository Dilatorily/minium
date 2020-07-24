import { getPassword, setPassword } from 'keytar';
import { Client } from 'plaid';
import { addAccount, createClient, saveConfiguration } from '..';
import AccountError from '../AccountError';
import ConfigurationError from '../ConfigurationError';
import { KEYTAR_ACCOUNTS, SERVICE_NAME } from '../constants';

jest.mock('keytar', () => ({ getPassword: jest.fn(), setPassword: jest.fn() }));
jest.mock('plaid', () => ({
  Client: jest.fn(),
  environments: jest.requireActual('plaid').environments,
}));

describe('plaid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    beforeEach(() => {
      (getPassword as jest.Mock).mockImplementation(async (service: string, account: string) => {
        switch (account) {
          case KEYTAR_ACCOUNTS.ACCOUNTS:
            return JSON.stringify(['test account 1', 'test account 2']);
          case KEYTAR_ACCOUNTS.CLIENT_ID:
            return 'test client id';
          case KEYTAR_ACCOUNTS.SECRET:
            return 'test secret';
          default:
            return null;
        }
      });
    });

    it('throws a ConfigurationError if the clientId is missing', async () => {
      (getPassword as jest.Mock).mockImplementation(async (service: string, account: string) => {
        switch (account) {
          case KEYTAR_ACCOUNTS.ACCOUNTS:
            return JSON.stringify(['test account 1', 'test account 2']);
          case KEYTAR_ACCOUNTS.SECRET:
            return 'test secret';
          default:
            return null;
        }
      });
      await expect(createClient()).rejects.toThrowError(ConfigurationError);
    });

    it('throws a ConfigurationError if the secret is missing', async () => {
      (getPassword as jest.Mock).mockImplementation(async (service: string, account: string) => {
        switch (account) {
          case KEYTAR_ACCOUNTS.ACCOUNTS:
            return JSON.stringify(['test account 1', 'test account 2']);
          case KEYTAR_ACCOUNTS.CLIENT_ID:
            return 'test client id';
          default:
            return null;
        }
      });
      await expect(createClient()).rejects.toThrowError(ConfigurationError);
    });

    it('throws an AccountError if the secret is missing', async () => {
      (getPassword as jest.Mock).mockImplementation(async (service: string, account: string) => {
        switch (account) {
          case KEYTAR_ACCOUNTS.CLIENT_ID:
            return 'test client id';
          case KEYTAR_ACCOUNTS.SECRET:
            return 'test secret';
          default:
            return null;
        }
      });
      await expect(createClient()).rejects.toThrowError(AccountError);
    });

    it('returns a Plaid client', async () => {
      const results = await createClient();
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.ACCOUNTS);
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.CLIENT_ID);
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.SECRET);
      expect(results).toEqual(expect.any(Client));
    });

    it('returns the same Plaid client if it was already created', async () => {
      const results1 = await createClient(true);
      const results2 = await createClient();
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.ACCOUNTS);
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.CLIENT_ID);
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.SECRET);
      expect(results1).toEqual(expect.any(Client));
      expect(results1).toBe(results2);
    });
  });

  describe('saveConfiguration', () => {
    it('saves the configuration', async () => {
      await saveConfiguration('test clientId', 'test secret');
      expect(setPassword).toHaveBeenCalledWith(
        SERVICE_NAME,
        KEYTAR_ACCOUNTS.CLIENT_ID,
        'test clientId',
      );
      expect(setPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.SECRET, 'test secret');
    });

    it('reads the configuration', async () => {
      await saveConfiguration('test clientId', 'test secret');
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.ACCOUNTS);
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.CLIENT_ID);
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.SECRET);
    });
  });

  describe('addAccount', () => {
    it('saves the account', async () => {
      await addAccount('test account 3');
      expect(setPassword).toHaveBeenCalledWith(
        SERVICE_NAME,
        KEYTAR_ACCOUNTS.ACCOUNTS,
        JSON.stringify(['test account 1', 'test account 2', 'test account 3']),
      );
    });

    it('reads the configuration', async () => {
      await addAccount('test account 3');
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.ACCOUNTS);
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.CLIENT_ID);
      expect(getPassword).toHaveBeenCalledWith(SERVICE_NAME, KEYTAR_ACCOUNTS.SECRET);
    });
  });
});
