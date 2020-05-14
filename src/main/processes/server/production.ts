import { ChildProcess, fork } from 'child_process';
import { join } from 'path';
import { app } from 'electron';

let process: ChildProcess | null = null;

export const createServer = async (ports: [number, number]): Promise<void> => {
  if (!process) {
    process = fork(join(app.getAppPath(), 'server.js'), [
      '--production',
      `${ports[0]}`,
      `${ports[1]}`,
    ]);
  }
};

export const killServer = (): void => {
  if (process) {
    process.kill();
    process = null;
  }
};
