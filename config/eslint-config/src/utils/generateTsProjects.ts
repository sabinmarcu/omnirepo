import path from 'node:path';
import fs from 'node:fs';
import glob from 'glob';

export const generateTsProjects = (
  rootDirectory: string,
  workspaces: string[],
) => {
  const tsConfigPaths = [
    '.',
    ...workspaces,
  ].flatMap(
    (workspace) => {
      const globPath = path.resolve(rootDirectory, workspace, 'tsconfig.json');
      const results = glob.sync(globPath, { cwd: rootDirectory });
      return results;
    },
  );
  const validPackages = tsConfigPaths.filter(
    (config) => fs.existsSync(
      path.resolve(
        path.dirname(
          path.resolve(config),
        ),
        'package.json',
      ),
    ),
  );
  const tsProjects = validPackages.map(
    (config) => path.relative(rootDirectory, config),
  );
  return tsProjects;
};
