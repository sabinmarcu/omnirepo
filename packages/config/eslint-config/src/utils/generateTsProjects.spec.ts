import {
  setupFsMockAll,
  compileFixtures,
  vol,
} from '@sabinmarcu/utils-test';
import { generateTsProjects } from './generateTsProjects';

export type ExistsFixtures = {
  setup: Record<string, string>,
  input: {
    rootDirectory: string,
    workspaces: string[],
  },
  output: string[]
};

const fixtures = compileFixtures<ExistsFixtures>(
  new URL('__mocks__', import.meta.url),
);

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);
jest.mock('glob', () => (
  jest.requireActual('@sabinmarcu/utils-test').mockGlob(vol, jest.requireActual('glob'))
));

describe('generateTsProjects', () => {
  it('should be a function', () => {
    expect(generateTsProjects).toBeInstanceOf(Function);
  });
  it('should have two parameters', () => {
    expect(generateTsProjects.length).toBe(2);
  });
  describe.each(fixtures)(
    '$name',
    ({ setup, input: { rootDirectory, workspaces }, output }) => {
      setupFsMockAll(setup);
      it('returns expected', () => {
        expect(generateTsProjects(rootDirectory, workspaces)).toEqual(output);
      });
    },
  );
});
