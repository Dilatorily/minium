import 'core-js/stable';
import 'regenerator-runtime/runtime';
import getSockets from './sockets';

(async (): Promise<void> => {
  const { initializeSockets } = await getSockets();
  initializeSockets(() => {
    // TODO: Process a message through the socket
  });
})();
