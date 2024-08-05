import {
  setupFsMockAll,
  vol,
} from '@sabinmarcu/utils-test';
import { generateWorkspacesConfig } from './generateWorkspacesConfig';

import compileFixtures from './__mocks__';

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
        it('should throw an error', () => {
          expect(() => generateWorkspacesConfig(
            extraScopes,
            path,
            withAliases,
          )).toThrow(outcome.error);
        });
      } else {
        it('should return expected', () => {
          expect(generateWorkspacesConfig(
            extraScopes,
            path,
            withAliases,
          ).rules['scope-enum'][2]).toEqual(outcome.scopes);
        });
      }
    },
  );
});
