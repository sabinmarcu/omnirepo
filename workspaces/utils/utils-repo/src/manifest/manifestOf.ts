import {
  readJson,
  readJsonSync,
} from '@sabinmarcu/utils-fs';
import moizeImport, { type Moize } from 'moize';
import type { PackageJson } from 'type-fest';
import { resolveManifest } from '../resolvers/index.js';

const moize = moizeImport as unknown as Moize;

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
