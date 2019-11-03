import 'core-js/stable';
import 'regenerator-runtime/runtime';
import render from './render';
import { initializeSockets } from './sockets';

const main = (): void => {
  initializeSockets(() => {});
  render();
};
main();

export default main;
