import { Message } from './interface';

// Message Types
export const ADD_ACCOUNT = 'client/ADD_ACCOUNT';
export const SAVE_CONFIGURATION = 'client/SAVE_CONFIGURATION';
export const ADDED_ACCOUNT = 'server/ADDED_ACCOUNT';
export const MISSING_ACCOUNTS = 'server/MISSING_ACCOUNTS';
export const MISSING_CONFIGURATION = 'server/MISSING_CONFIGURATION';
export const SAVED_CONFIGURATION = 'server/SAVED_CONFIGURATION';

// Message Creators
export const addedAccount = (): Message => ({ type: ADDED_ACCOUNT });
export const missingAccounts = (): Message => ({ type: MISSING_ACCOUNTS });
export const missingConfiguration = (): Message => ({ type: MISSING_CONFIGURATION });
export const savedConfiguration = (): Message => ({ type: SAVED_CONFIGURATION });
