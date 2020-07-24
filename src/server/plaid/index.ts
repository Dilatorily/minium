import { getPassword, setPassword } from 'keytar';
import { Client, environments } from 'plaid';
import AccountError from './AccountError';
import ConfigurationError from './ConfigurationError';
import { SERVICE_NAME, KEYTAR_ACCOUNTS } from './constants';
import { Configuration } from './interfaces';

let client: Client;
let configuration: Configuration;

const readConfiguration = async (): Promise<void> => {
  const [accountsString, clientId, secret] = await Promise.all([
    getPassword(SERVICE_NAME, KEYTAR_ACCOUNTS.ACCOUNTS),
    getPassword(SERVICE_NAME, KEYTAR_ACCOUNTS.CLIENT_ID),
    getPassword(SERVICE_NAME, KEYTAR_ACCOUNTS.SECRET),
  ]);

  if (!clientId || !secret) {
    throw new ConfigurationError();
  }

  configuration = {
    accounts: accountsString ? JSON.parse(accountsString) : [],
    plaid: { clientId, secret },
  };

  if (configuration.accounts.length <= 0) {
    throw new AccountError();
  }
};

export const createClient = async (force = false): Promise<Client> => {
  if (!client || force) {
    await readConfiguration();
    client = new Client({
      clientID: configuration.plaid.clientId,
      env: environments.development,
      options: { version: '2019-05-29' },
      secret: configuration.plaid.secret,
    });
  }

  return client;
};

export const saveConfiguration = async (clientId: string, secret: string): Promise<void> => {
  await Promise.all([
    setPassword(SERVICE_NAME, KEYTAR_ACCOUNTS.CLIENT_ID, clientId),
    setPassword(SERVICE_NAME, KEYTAR_ACCOUNTS.SECRET, secret),
  ]);
  await createClient(true);
};

export const addAccount = async (account: string): Promise<void> => {
  const accounts = [...configuration.accounts, account];
  await setPassword(SERVICE_NAME, KEYTAR_ACCOUNTS.ACCOUNTS, JSON.stringify(accounts));
  await readConfiguration();
};
