import {
  setupFsMockAll,
  vol,
} from '@sabinmarcu/utils-test';
import { generateWorkspacesScopes } from './generateWorkspacesScopes';

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

describe('generateWorkspacesScopes', () => {
  it('should be a function', () => {
    expect(typeof generateWorkspacesScopes).toBe('function');
  });
  it('should have no parameters (all have defaults)', () => {
    expect(generateWorkspacesScopes.length).toBe(0);
  });
  describe.each(fixtures)(
    '$name',
    ({
      setup,
      input: {
        path,
        withAliases,
      },
      ...outcome
    }) => {
      setupFsMockAll(setup);
      if ('error' in outcome) {
        it('should throw an error', () => {
          expect(() => generateWorkspacesScopes(
            path,
            withAliases,
          )).toThrow(outcome.error);
        });
      } else {
        it('should return expected', () => {
          expect(generateWorkspacesScopes(
            path,
            withAliases,
          )).toEqual(outcome.scopes);
        });
      }
    },
  );
});
