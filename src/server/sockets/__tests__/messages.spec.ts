import { onMessage } from '../messages';
import { addAccount, saveConfiguration } from '../../plaid';
import {
  ADD_ACCOUNT,
  ADDED_ACCOUNT,
  SAVE_CONFIGURATION,
  SAVED_CONFIGURATION,
} from '../../../shared/messages';

jest.mock('../../plaid', () => ({ addAccount: jest.fn(), saveConfiguration: jest.fn() }));

describe('onMessage', () => {
  const sendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles the ADD_ACCOUNT message type', async () => {
    await onMessage(ADD_ACCOUNT, 'test account')(sendMessage);
    expect(addAccount).toHaveBeenCalledWith('test account');
    expect(sendMessage).toHaveBeenCalledWith({ type: ADDED_ACCOUNT });
  });

  it('handles the SAVE_CONFIGURATION message type', async () => {
    await onMessage(SAVE_CONFIGURATION, {
      clientId: 'test clientId',
      publicKey: 'test publicKey',
      secret: 'test secret',
    })(sendMessage);
    expect(saveConfiguration).toHaveBeenCalledWith(
      'test clientId',
      'test publicKey',
      'test secret',
    );
    expect(sendMessage).toHaveBeenCalledWith({ type: SAVED_CONFIGURATION });
  });
});
