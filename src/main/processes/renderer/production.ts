import { join } from 'path';
import { app } from 'electron';

export default `file://${join(app.getAppPath(), 'index.html')}`;
