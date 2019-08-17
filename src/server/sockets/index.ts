export interface Sockets {
  initializeSockets: (onMessage: (...buffer: Buffer[]) => void) => void;
  sendMessage: (message: string) => void;
}

export default async (): Promise<Sockets> => {
  const isProduction = process.argv[2] === '--production';
  const { initializeSockets, sendMessage } = await import(
    `./${isProduction ? 'production' : 'development'}`
  );
  return { initializeSockets, sendMessage };
};
