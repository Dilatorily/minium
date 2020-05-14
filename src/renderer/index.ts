import 'core-js/stable';
import 'regenerator-runtime/runtime';
import render from './render';
import { initializeSockets } from './sockets';

const main = (): void => {
  initializeSockets((message) => {
    // TODO: Process a message through the socket
    console.log(message);
  });
  render();
};
main();

export default main;
