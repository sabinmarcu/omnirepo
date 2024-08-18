import path from 'node:path';
import { createRequire } from 'node:module';
import packageJson from '../package.json' with { type: 'json' };

const localRequire = createRequire(import.meta.url);
const dependencyDetectionPath = 'package.json'
const dependencies = Object.entries(packageJson.peerDependencies ?? {})
  .filter(([,resolution]) => resolution.includes('workspace:'))
  .map(([name]) => localRequire.resolve(path.join(name, dependencyDetectionPath)))
  .map((resolvedPath) => resolvedPath.replace(dependencyDetectionPath, ''));

const storiesLocations = ['src/']
const storiesPatterns = [
  '**/*.mdx',
  '**/*.stories.@(ts|tsx|cts|mts)'
]

const stories: string[] = [];
for (const dependency of dependencies) {
  for (const location of storiesLocations) {
    for (const pattern of storiesPatterns) {
      stories.push([
        dependency,
        location,
        pattern,
      ].join(""))
    }
  }
}

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return path.dirname(localRequire.resolve(path.join(value, 'package.json')));
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
};
export default config;
