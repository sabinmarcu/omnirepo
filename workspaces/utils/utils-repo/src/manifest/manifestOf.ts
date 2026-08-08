import {
  readJson,
  readJsonSync,
} from '@sabinmarcu/utils-fs';
// eslint-disable-next-line import/extensions -- Moize's ESM entry requires its .mjs extension.
import moize from 'moize/mjs/index.mjs';
import type { PackageJson } from '@sabinmarcu/types';
import { resolveManifest } from '../resolvers/index.js';

const manifestOfSyncRaw = (
  path: string,
) => {
  const manifestPath = resolveManifest.sync(path);
  const manifest = readJsonSync<PackageJson>(manifestPath);
  return manifest;
};
export const manifestOfSync = moize(manifestOfSyncRaw) as typeof manifestOfSyncRaw;

const manifestOfRaw = async (
  path: string,
) => {
  const manifestPath = await resolveManifest.async(path);
  const manifest = await readJson<PackageJson>(manifestPath);
  return manifest;
};
export const manifestOf = moize.promise(manifestOfRaw) as typeof manifestOfRaw;
