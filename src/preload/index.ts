import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { ipcRenderer } from 'electron';
import zmq from 'zeromq';

Object.defineProperties(window, {
  ipcRenderer: { configurable: true, value: ipcRenderer },
  zmq: { configurable: true, value: zmq },
});
