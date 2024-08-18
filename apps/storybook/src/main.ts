import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import fs from 'node:fs';

const localRequire = createRequire(import.meta.url);
const getStories = async () => {
  const rootPath = fileURLToPath(new URL('../../../', import.meta.url));
  const workspacesMappings = {
    Applications: 'apps/*',
    Libraries: 'workspaces/components/*',
  } as const;

  const workspacesRaw = await Promise.all(
    Object.entries(workspacesMappings)
      .flatMap(async ([
        category,
        paths,
      ]) => {
        const list = await glob(paths, { cwd: rootPath });
        return Promise.all(list
          .map((it) => path.join(rootPath, it))
          .filter((it) => fs.statSync(it).isDirectory())
          .map(async (it) => ({
            directory: it,
            titlePrefix: `${category}/`,
          } as const)));
      }),
  );
  const workspaces = workspacesRaw.flat().filter(Boolean);

  const storiesLocations = ['src'];
  const storiesPatterns = [
    '**/*.mdx',
    '**/*.stories.@(ts|tsx|cts|mts)',
  ];

  const stories: any[] = [];
  for (const {
    directory, ...rest
  } of workspaces) {
    for (const location of storiesLocations) {
      for (const pattern of storiesPatterns) {
        stories.push({
          ...rest,
          directory: path.join(directory, location),
          files: pattern,
        });
      }
    }
  }

  return stories;
};

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return path.dirname(localRequire.resolve(path.join(value, 'package.json')));
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: getStories,
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  docs: {
    autodocs: 'tag',
  },
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
};
export default config;
