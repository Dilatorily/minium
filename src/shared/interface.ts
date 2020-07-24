export interface Message {
  payload?: unknown;
  type: string;
}

export type Messages<T> = {
  [key in keyof T]: (...payload: any[]) => (sendMessage: SendMessage) => void | Promise<void>;
};

export interface OnMessage {
  (sendMessage: SendMessage): void | Promise<void>;
}

export interface PlaidConfiguration {
  clientId: string;
  secret: string;
}

export interface SendMessage {
  (message: Message): void;
}
