import * as R from 'ramda';
import {
  parseDebugString,
  parseDebugStringFragment,
  parseDebugStringFragmentPath,
} from './parsers';
import type { RawDebugRule } from './types';

const testCases: {
  input: string;
  output: RawDebugRule;
}[] = [
  {
    input: 'example',
    output: {
      path: 'example',
      namespace: '',
      channel: '',
      enabled: true,
    },
  },
  {
    input: 'example*',
    output: {
      namespace: '',
      path: 'example*',
      channel: '',
      enabled: true,
    },
  },
  {
    input: 'namespaced:*',
    output: {
      namespace: 'namespaced',
      path: '*',
      channel: '',
      enabled: true,
    },
  },
  {
    input: '#channel',
    output: {
      namespace: '',
      path: '',
      channel: 'channel',
      enabled: true,
    },
  },
  {
    input: 'example#channel',
    output: {
      namespace: '',
      path: 'example',
      channel: 'channel',
      enabled: true,
    },
  },
  {
    input: 'example:*#channel',
    output: {
      namespace: 'example',
      path: '*',
      channel: 'channel',
      enabled: true,
    },
  },
  {
    input: 'namespace:example#channel',
    output: {
      namespace: 'namespace',
      path: 'example',
      channel: 'channel',
      enabled: true,
    },
  },
  {
    input: '-thing',
    output: {
      namespace: '',
      path: 'thing',
      channel: '',
      enabled: false,
    },
  },
  {
    input: '-#channel',
    output: {
      namespace: '',
      path: '',
      channel: 'channel',
      enabled: false,
    },
  },
  {
    input: '-namespace:example#channel',
    output: {
      namespace: 'namespace',
      path: 'example',
      channel: 'channel',
      enabled: false,
    },
  },
];

describe('parseDebugStringFragmentPath', () => {
  it('should return the correct path and namespace when given a valid input', () => {
    // const input = 'example:*#channel';
    const groups = {
      disabled: '',
      namespaceOrPath: 'example',
      path: '*',
      channel: 'channel',
    };
    const expectedOutput = {
      namespace: 'example',
      path: '*',
    };
    expect(parseDebugStringFragmentPath(groups)).toEqual(expectedOutput);
  });

  it('should return the correct path and namespace when given a valid input with no channel', () => {
    // const input = 'example:*';
    const groups = {
      disabled: '',
      namespaceOrPath: 'example',
      path: '*',
      channel: '',
    };
    const expectedOutput = {
      namespace: 'example',
      path: '*',
    };
    expect(parseDebugStringFragmentPath(groups)).toEqual(expectedOutput);
  });

  it('should return the correct path and namespace when given a valid input with no namespace', () => {
    // const input = '*#channel';
    const groups = {
      disabled: '',
      namespaceOrPath: '',
      path: '*',
      channel: 'channel',
    };
    const expectedOutput = {
      namespace: '',
      path: '*',
    };
    expect(parseDebugStringFragmentPath(groups)).toEqual(expectedOutput);
  });

  it('should return the correct path and namespace when given a valid input with no namespace and no channel', () => {
    // const input = '*';
    const groups = {
      disabled: '',
      namespaceOrPath: '',
      path: '*',
      channel: '',
    };
    const expectedOutput = {
      namespace: '',
      path: '*',
    };
    expect(parseDebugStringFragmentPath(groups)).toEqual(expectedOutput);
  });

  it('should return the correct path and namespace when given a valid input with no path', () => {
    // const input = 'example#channel';
    const groups = {
      disabled: '',
      namespaceOrPath: 'example',
      path: '',
      channel: 'channel',
    };
    const expectedOutput = {
      namespace: '',
      path: 'example',
    };
    expect(parseDebugStringFragmentPath(groups)).toEqual(expectedOutput);
  });

  it('should return the correct path and namespace when given a valid input with no namespace and no path', () => {
    // const input = '#channel';
    const groups = {
      disabled: '',
      namespaceOrPath: '',
      path: '',
      channel: 'channel',
    };
    const expectedOutput = {
      namespace: '',
      path: '',
    };
    expect(parseDebugStringFragmentPath(groups)).toEqual(expectedOutput);
  });

  it('should return the correct path and namespace when given a valid input with a disabled flag', () => {
    // const input = '-example:*#channel';
    const groups = {
      disabled: '-',
      namespaceOrPath: 'example',
      path: '*',
      channel: 'channel',
    };
    const expectedOutput = {
      namespace: 'example',
      path: '*',
    };
    expect(parseDebugStringFragmentPath(groups)).toEqual(expectedOutput);
  });
});

describe('parseDebugStringFragment', () => {
  it('should parse a valid debug string fragment with namespace, path, and channel', () => {
    const input = 'example:*#channel';
    const expectedOutput = {
      namespace: 'example',
      path: '*',
      channel: 'channel',
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with namespace and path', () => {
    const input = 'example:*';
    const expectedOutput = {
      namespace: 'example',
      path: '*',
      channel: '',
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should error out if namespace is present, but no path', () => {
    const input = 'example:#channel';
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(undefined);
  });

  it('should parse a valid debug string fragment with path and channel', () => {
    const input = '*#channel';
    const expectedOutput = {
      namespace: '',
      path: '*',
      channel: 'channel',
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with namespace only', () => {
    const input = 'example';
    const expectedOutput = {
      path: 'example',
      namespace: '',
      channel: '',
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with path only', () => {
    const input = '*';
    const expectedOutput = {
      namespace: '',
      path: '*',
      channel: '',
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with channel only', () => {
    const input = '#channel';
    const expectedOutput = {
      namespace: '',
      path: '',
      channel: 'channel',
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with disabled flag', () => {
    const input = '-example:*#channel';
    const expectedOutput = {
      namespace: 'example',
      path: '*',
      channel: 'channel',
      enabled: false,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });
  describe('test cases', () => {
    it.each(testCases)('parseDebugStringFragment($input)', ({ input, output }) => {
      expect(parseDebugStringFragment(input)).toEqual(output);
    });
  });
});
describe('parseDebugString', () => {
  it('should return undefined when given an empty string', () => {
    expect(parseDebugString('')).toEqual(undefined);
  });

  it('should parse a single debug rule', () => {
    const input = 'example';
    const expectedOutput = {
      path: 'example',
      namespace: '',
      channel: '',
      enabled: true,
    };
    expect(parseDebugString(input)).toEqual([expectedOutput]);
  });

  it('should parse multiple debug rules separated by commas', () => {
    const input = 'example, another:example#channel, -disabled';
    const expectedOutput = [
      {
        path: 'example',
        namespace: '',
        channel: '',
        enabled: true,
      },
      {
        path: 'example',
        namespace: 'another',
        channel: 'channel',
        enabled: true,
      },
      {
        path: 'disabled',
        namespace: '',
        channel: '',
        enabled: false,
      },
    ];
    const output = parseDebugString(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should ignore whitespace around debug rules', () => {
    const input = 'example ,  another:example#channel , -disabled ';
    const expectedOutput = [
      {
        path: 'example',
        namespace: '',
        channel: '',
        enabled: true,
      },
      {
        path: 'example',
        namespace: 'another',
        channel: 'channel',
        enabled: true,
      },
      {
        path: 'disabled',
        namespace: '',
        channel: '',
        enabled: false,
      },
    ];
    expect(parseDebugString(input)).toEqual(expectedOutput);
  });

  it('should ignore empty debug rules', () => {
    const input = 'example, , another:example#channel, -disabled';
    const expectedOutput = [
      {
        path: 'example',
        namespace: '',
        channel: '',
        enabled: true,
      },
      {
        path: 'example',
        namespace: 'another',
        channel: 'channel',
        enabled: true,
      },
      {
        path: 'disabled',
        namespace: '',
        channel: '',
        enabled: false,
      },
    ];
    expect(parseDebugString(input)).toEqual(expectedOutput);
  });

  it('test cases (joined)', () => {
    const inputString = R.flatten(
      // eslint-disable-next-line unicorn/no-array-callback-reference
      R.map(R.values as any, R.project(['input'], testCases)),
    ).join(',');
    const outputs = R.flatten(
      // eslint-disable-next-line unicorn/no-array-callback-reference
      R.map(R.values as any, R.project(['output'], testCases)),
    );
    expect(parseDebugString(inputString)).toEqual(outputs);
  });
});
