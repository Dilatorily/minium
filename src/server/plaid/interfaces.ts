import { PlaidConfiguration } from '../../shared/interface';

export interface Configuration {
  accounts: string[];
  plaid: PlaidConfiguration;
}
