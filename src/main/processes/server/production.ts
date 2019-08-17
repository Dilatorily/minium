import { ChildProcess, fork } from 'child_process';
import { join } from 'path';
import { app } from 'electron';

let process: ChildProcess | null = null;

export const createServer = async (port: number): Promise<void> => {
  if (!process) {
    process = fork(join(app.getAppPath(), 'server.js'), ['--production', `${port}`]);
  }
};

export const killServer = (): void => {
  if (process) {
    process.kill();
    process = null;
  }
};
