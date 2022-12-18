import path from 'path';
import os from 'os';

export const fsRoot = (
  os.platform() === 'win32'
    ? process.cwd().split(path.sep)[0]
    : path.sep
);
