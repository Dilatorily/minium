import { addAccount, saveConfiguration } from '../plaid';
import {
  ADD_ACCOUNT,
  addedAccount,
  SAVE_CONFIGURATION,
  savedConfiguration,
} from '../../shared/messages';
import { Messages, PlaidConfiguration, OnMessage } from '../../shared/interface';

interface ClientConfiguration {
  [ADD_ACCOUNT]: string;
  [SAVE_CONFIGURATION]: PlaidConfiguration;
}

type ClientMessages = {
  [key in keyof ClientConfiguration]: {
    payload: ClientConfiguration[key];
    type: keyof ClientConfiguration;
  };
};

export type ClientMessage = ClientMessages[keyof ClientConfiguration];

const messages: Messages<ClientConfiguration> = {
  [ADD_ACCOUNT]: (account) => async (sendMessage): Promise<void> => {
    await addAccount(account);
    sendMessage(addedAccount());
  },
  [SAVE_CONFIGURATION]: ({ clientId, secret }) => async (sendMessage): Promise<void> => {
    await saveConfiguration(clientId, secret);
    sendMessage(savedConfiguration());
  },
};

export const onMessage = (type: keyof ClientConfiguration, ...payload: any[]): OnMessage => {
  return messages[type](...payload);
};
