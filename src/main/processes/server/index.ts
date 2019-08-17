export default async (ports: [number, number]): Promise<void> => {
  const { createServer } = await import(`./${process.env.NODE_ENV}`);
  createServer(ports);
};
