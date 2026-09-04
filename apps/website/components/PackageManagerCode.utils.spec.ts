import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  packageManagers,
  parsePackageCommand,
} from './PackageManagerCode.utils';

function format(input: string) {
  const command = parsePackageCommand(input);
  return Object.fromEntries(packageManagers.map((manager) => [
    manager.name,
    manager.format(command),
  ]));
}

describe('package manager commands', () => {
  it('formats package installation', () => {
    expect(format('install X Y Z')).toEqual({
      yarn: 'yarn install X Y Z',
      pnpm: 'pnpm install X Y Z',
      npm: 'npm install X Y Z',
    });
  });

  it('formats one-off execution', () => {
    expect(format('exec nodemon --watch src')).toEqual({
      yarn: 'yarn dlx nodemon --watch src',
      pnpm: 'pnpm dlx nodemon --watch src',
      npm: 'npx nodemon --watch src',
    });
  });

  it('formats execution from a named package', () => {
    expect(format('exec --package typescript tsc --watch')).toEqual({
      yarn: 'yarn dlx -p typescript tsc --watch',
      pnpm: 'pnpm dlx --package typescript tsc --watch',
      npm: 'npx --package typescript tsc --watch',
    });
  });

  it('rejects unsupported operations', () => {
    expect(() => parsePackageCommand('remove X')).toThrow('Unsupported !package command');
  });
});
