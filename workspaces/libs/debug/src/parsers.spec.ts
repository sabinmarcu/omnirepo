import {
  describe,
  it,
  expect,
} from 'vitest';
import {
  flatten,
  map,
  values,
  project,
} from 'ramda';
import {
  parseDebugString,
  parseDebugStringFragment,
} from './parsers.js';
import type { DebugRule } from './types.js';

const testCases: {
  input: string;
  output: DebugRule;
}[] = [
  {
    input: 'example',
    output: {
      path: 'example',
      namespace: undefined,
      channel: undefined,
      enabled: true,
    },
  },
  {
    input: 'example*',
    output: {
      namespace: undefined,
      path: 'example*',
      channel: undefined,
      enabled: true,
    },
  },
  {
    input: 'namespaced:*',
    output: {
      namespace: 'namespaced',
      path: '*',
      channel: undefined,
      enabled: true,
    },
  },
  {
    input: '#info',
    output: {
      namespace: undefined,
      path: undefined,
      channel: 'info',
      enabled: true,
    },
  },
  {
    input: 'example#info',
    output: {
      namespace: undefined,
      path: 'example',
      channel: 'info',
      enabled: true,
    },
  },
  {
    input: 'example:*#info',
    output: {
      namespace: 'example',
      path: '*',
      channel: 'info',
      enabled: true,
    },
  },
  {
    input: 'namespace:example#info',
    output: {
      namespace: 'namespace',
      path: 'example',
      channel: 'info',
      enabled: true,
    },
  },
  {
    input: '-thing',
    output: {
      namespace: undefined,
      path: 'thing',
      channel: undefined,
      enabled: false,
    },
  },
  {
    input: '-#info',
    output: {
      namespace: undefined,
      path: undefined,
      channel: 'info',
      enabled: false,
    },
  },
  {
    input: '-namespace:example#info',
    output: {
      namespace: 'namespace',
      path: 'example',
      channel: 'info',
      enabled: false,
    },
  },
];

describe('parseDebugStringFragment', () => {
  it('should parse a valid debug string fragment with namespace, path, and info', () => {
    const input = 'example:*#info';
    const expectedOutput = {
      namespace: 'example',
      path: '*',
      channel: 'info',
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
      channel: undefined,
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should error out if namespace is present, but no path', () => {
    const input = 'example:#info';
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(undefined);
  });

  it('should parse a valid debug string fragment with path and info', () => {
    const input = '*#info';
    const expectedOutput = {
      namespace: undefined,
      path: '*',
      channel: 'info',
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with namespace only', () => {
    const input = 'example';
    const expectedOutput = {
      path: 'example',
      namespace: undefined,
      channel: undefined,
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with path only', () => {
    const input = '*';
    const expectedOutput = {
      namespace: undefined,
      path: '*',
      channel: undefined,
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with channel only', () => {
    const input = '#info';
    const expectedOutput = {
      namespace: undefined,
      path: undefined,
      channel: 'info',
      enabled: true,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should parse a valid debug string fragment with disabled flag', () => {
    const input = '-example:*#info';
    const expectedOutput = {
      namespace: 'example',
      path: '*',
      channel: 'info',
      enabled: false,
    };
    const output = parseDebugStringFragment(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should return undefined when string is empty', () => {
    expect(parseDebugStringFragment('')).toEqual(undefined);
  });

  it('should return undefined when namespace pattern exists, but string is empty', () => {
    expect(parseDebugStringFragment(':example')).toEqual(undefined);
  });

  it('should return undefined when channel is not a valid debug channel', () => {
    expect(parseDebugStringFragment('#channel')).toEqual(undefined);
    expect(parseDebugStringFragment('namespace:path#invalid')).toEqual(undefined);
    expect(parseDebugStringFragment('example#invalid')).toEqual(undefined);
    expect(parseDebugStringFragment('#invalid')).toEqual(undefined);
  });

  describe('test cases', () => {
    it.each(testCases)('parseDebugStringFragment($input)', ({
      input, output,
    }) => {
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
      namespace: undefined,
      channel: undefined,
      enabled: true,
    };
    expect(parseDebugString(input)).toEqual([expectedOutput]);
  });

  it('should parse multiple debug rules separated by commas', () => {
    const input = 'example, another:example#info, -disabled';
    const expectedOutput = [
      {
        path: 'example',
        namespace: undefined,
        channel: undefined,
        enabled: true,
      },
      {
        path: 'example',
        namespace: 'another',
        channel: 'info',
        enabled: true,
      },
      {
        path: 'disabled',
        namespace: undefined,
        channel: undefined,
        enabled: false,
      },
    ];
    const output = parseDebugString(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should ignore whitespace around debug rules', () => {
    const input = 'example ,  another:example#info , -disabled ';
    const expectedOutput = [
      {
        path: 'example',
        namespace: undefined,
        channel: undefined,
        enabled: true,
      },
      {
        path: 'example',
        namespace: 'another',
        channel: 'info',
        enabled: true,
      },
      {
        path: 'disabled',
        namespace: undefined,
        channel: undefined,
        enabled: false,
      },
    ];
    expect(parseDebugString(input)).toEqual(expectedOutput);
  });

  it('should ignore empty debug rules', () => {
    const input = 'example, , another:example#info, -disabled';
    const expectedOutput = [
      {
        path: 'example',
        namespace: undefined,
        channel: undefined,
        enabled: true,
      },
      {
        path: 'example',
        namespace: 'another',
        channel: 'info',
        enabled: true,
      },
      {
        path: 'disabled',
        namespace: undefined,
        channel: undefined,
        enabled: false,
      },
    ];
    expect(parseDebugString(input)).toEqual(expectedOutput);
  });

  it('test cases (joined)', () => {
    const inputString = flatten(

      map(values as any, project(['input'], testCases)),
    ).join(',');
    const outputs = flatten(

      map(values as any, project(['output'], testCases)),
    );
    expect(parseDebugString(inputString)).toEqual(outputs);
  });
});
