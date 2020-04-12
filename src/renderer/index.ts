import 'core-js/stable';
import 'regenerator-runtime/runtime';
import render from './render';
import { initializeSockets } from './sockets';

const main = (): void => {
  initializeSockets(() => {
    // TODO: Process a message through the socket
  });
  render();
};
main();

export default main;
