export interface Sockets {
  initializeSockets: (onMessage: (message: unknown) => void) => void;
  sendMessage: (message: unknown) => void;
}

export default async (): Promise<Sockets> => {
  const isProduction = process.argv[2] === '--production';
  const { initializeSockets, sendMessage } = await import(
    `./${isProduction ? 'production' : 'development'}`
  );
  return { initializeSockets, sendMessage };
};
