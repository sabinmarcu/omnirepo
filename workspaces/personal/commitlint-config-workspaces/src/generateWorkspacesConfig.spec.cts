import {
  setupFsMockAll,
  vol,
} from '@sabinmarcu/utils-test';
// eslint-disable-next-line import/extensions
import { generateWorkspacesConfig } from './generateWorkspacesConfig.cjs';

// eslint-disable-next-line import/extensions
import compileFixtures from './__mocks__/index.cjs';

const fixtures = compileFixtures();

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);
jest.mock('glob', () => (
  jest.requireActual('@sabinmarcu/utils-test').mockGlob(
    vol,
    jest.requireActual('glob'),
  )
));

describe('generateWorkspacesConfig', () => {
  it('should be a function', () => {
    expect(typeof generateWorkspacesConfig).toBe('function');
  });
  it('should have no parameters (all have defaults)', () => {
    expect(generateWorkspacesConfig.length).toBe(0);
  });
  describe.each(fixtures)(
    '$name',
    ({
      setup,
      input: {
        path,
        withAliases,
        extraScopes,
      },
      ...outcome
    }) => {
      setupFsMockAll(setup);
      if ('error' in outcome) {
        it('should throw an error', async () => {
          await expect(() => generateWorkspacesConfig(
            extraScopes,
            path,
            withAliases,
          )).rejects.toThrow(outcome.error);
        });
      } else {
        it('should return expected', async () => {
          const result = await generateWorkspacesConfig(
            extraScopes,
            path,
            withAliases,
          );
          expect(result.rules['scope-enum'][2]).toEqual(outcome.scopes);
        });
      }
    },
  );
});
