import path from 'node:path';
import os from 'node:os';

export const fsRoot = (
  os.platform() === 'win32'
    ? process.cwd().split(path.sep)[0]
    : path.sep
);
