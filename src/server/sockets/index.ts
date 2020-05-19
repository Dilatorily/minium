import { ClientMessage } from './messages';
import { SendMessage } from '../../shared/interface';

export interface Sockets {
  initializeSockets: (onMessage: (message: ClientMessage) => void) => void;
  sendMessage: SendMessage;
}

export default async (): Promise<Sockets> => {
  const isProduction = process.argv[2] === '--production';
  const { initializeSockets, sendMessage } = await import(
    `./${isProduction ? 'production' : 'development'}`
  );
  return { initializeSockets, sendMessage };
};
