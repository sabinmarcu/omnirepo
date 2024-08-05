import type {
  PathLike,
} from 'node:fs';
import {
  access,
} from 'node:fs';

export const exists = (
  path: PathLike,
): Promise<boolean> => new Promise(
  (resolve) => {
    access(path, (error) => {
      resolve(!error);
    });
  },
);
