/* eslint-disable no-undef */
import {
  fs,
  vol,
} from 'memfs';
import type {
  NestedDirectoryJSON,
  DirectoryJSON,
} from 'memfs/lib/volume.js';

export * from 'memfs';
export * as memfs from 'memfs';

export const mockFs = () => fs;
export const mockFsPromises = () => fs.promises;

export const setupFsMock = (json: DirectoryJSON) => {
  vol.fromJSON(json);
};

export const setupNestedFsMock = (json: NestedDirectoryJSON) => {
  vol.fromNestedJSON(json);
};

export const resetFsMock = vol.reset.bind(vol);
export const setupFsMockAll = (json: DirectoryJSON | NestedDirectoryJSON) => {
  beforeAll(() => {
    setupNestedFsMock(json);
  });
  afterAll(resetFsMock);
};

export const setupFsMockEach = (json: DirectoryJSON | NestedDirectoryJSON) => {
  beforeEach(() => {
    setupNestedFsMock(json);
  });
  afterEach(resetFsMock);
};
