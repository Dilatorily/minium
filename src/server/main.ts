import { createClient } from './plaid';
import AccountError from './plaid/AccountError';
import ConfigurationError from './plaid/ConfigurationError';
import getSockets from './sockets';
import { onMessage } from './sockets/messages';
import { missingAccounts, missingConfiguration } from '../shared/messages';

export default async (): Promise<void> => {
  const { initializeSockets, sendMessage } = await getSockets();
  initializeSockets(({ payload, type }) => onMessage(type, payload)(sendMessage));

  try {
    await createClient();
  } catch (error) {
    if (error instanceof AccountError) {
      sendMessage(missingAccounts());
    } else if (error instanceof ConfigurationError) {
      sendMessage(missingConfiguration());
    } else {
      throw error;
    }
  }
};
