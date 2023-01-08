import {
  readJson,
  readJsonSync,
} from '@sabinmarcu/utils-fs';
import type { PackageJson } from 'type-fest';
import { resolveManifest } from '../resolvers/index';

export const manifestOfSync = (
  path: string,
) => {
  const manifestPath = resolveManifest.sync(path);
  const manifest = readJsonSync<PackageJson>(manifestPath);
  return manifest;
};

export const manifestOf = async (
  path: string,
) => {
  const manifestPath = await resolveManifest.async(path);
  const manifest = await readJson<PackageJson>(manifestPath);
  return manifest;
};
