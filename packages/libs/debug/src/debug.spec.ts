import { debugDefinitionFromString } from './debug';

describe('debugDefinitionFromString', () => {
  it('should parse a valid debug string fragment', () => {
    const input = 'my-app:server';
    const expected = {
      namespace: 'my-app',
      path: 'server',
      channel: 'debug',
    };
    expect(debugDefinitionFromString(input)).toEqual(expected);
  });

  it('should throw an error for an invalid debug string fragment', () => {
    const input = 'my-app:server:extra';
    expect(() => debugDefinitionFromString(input)).toThrow();
  });

  it('should parse a debug string fragment with a namespace containing hyphens', () => {
    const input = 'my-app-with-hyphens:server';
    const expected = {
      namespace: 'my-app-with-hyphens',
      path: 'server',
      channel: 'debug',
    };
    expect(debugDefinitionFromString(input)).toEqual(expected);
  });

  it('should parse a debug string fragment with a path containing hyphens', () => {
    const input = 'my-app:server-with-hyphens';
    const expected = {
      namespace: 'my-app',
      path: 'server-with-hyphens',
      channel: 'debug',
    };
    expect(debugDefinitionFromString(input)).toEqual(expected);
  });
});
