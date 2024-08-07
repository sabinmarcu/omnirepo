import { definitionIsEnabled } from './enabled.js';
import type {
  DebugDefinition,
  DebugRule,
} from './types.js';

type Rules = Readonly<
    {
      id: string,
      rules: Readonly<DebugRule[]>,
    }[]
  >;
type MapRulesToOutputs<
  T extends Rules,
> = Record<T[number]['id'], boolean>;

describe('definitionIsEnabled', () => {
  it('should be a function', () => {
    expect(typeof definitionIsEnabled).toBe('function');
  });
  it('should have two arguments', () => {
    expect(definitionIsEnabled.length).toBe(2);
  });
  describe('only paths test cases', () => {
    const rulesInput = [
      {
        id: 'foo',
        rules: [
          {
            path: 'foo',
            enabled: true,
          },
        ],
      },
      {
        id: 'fooStuff',
        rules: [
          {
            path: 'fooStuff',
            enabled: true,
          },
        ],
      },
      {
        id: 'fooWildcard',
        rules: [
          {
            path: 'foo*',
            enabled: true,
          },
        ],
      },
      {
        id: 'fooWildcardNoFooStuff',
        rules: [
          {
            path: 'foo*',
            enabled: true,
          },
          {
            path: 'fooStuff',
            enabled: false,
          },
        ],
      },
      {
        id: 'fooWildcardNoFooStuffWildcard',
        rules: [
          {
            path: 'foo*',
            enabled: true,
          },
          {
            path: 'fooStuff*',
            enabled: false,
          },
        ],
      },
      {
        id: 'fooWildcardNoFooStuffWildcardFooStuff',
        rules: [
          {
            path: 'foo*',
            enabled: true,
          },
          {
            path: 'fooStuff*',
            enabled: false,
          },
          {
            path: 'fooStuff',
            enabled: true,
          },
        ],
      },
    ] as const satisfies Rules;

    type Outputs = MapRulesToOutputs<typeof rulesInput>;

    const testCases = [
      {
        given: {
          path: 'foo',
          namespace: '',
          channel: 'debug',
        },
        expected: {
          foo: true,
          fooStuff: false,
          fooWildcard: true,
          fooWildcardNoFooStuff: true,
          fooWildcardNoFooStuffWildcard: true,
          fooWildcardNoFooStuffWildcardFooStuff: true,
        },
      },
      {
        given: {
          path: 'notFoo',
          namespace: '',
          channel: 'debug',
        },
        expected: {
          foo: false,
          fooStuff: false,
          fooWildcard: false,
          fooWildcardNoFooStuff: false,
          fooWildcardNoFooStuffWildcard: false,
          fooWildcardNoFooStuffWildcardFooStuff: false,
        },
      },
      {
        given: {
          path: 'fooStuff',
          namespace: '',
          channel: 'debug',
        },
        expected: {
          foo: false,
          fooStuff: true,
          fooWildcard: true,
          fooWildcardNoFooStuff: false,
          fooWildcardNoFooStuffWildcard: false,
          fooWildcardNoFooStuffWildcardFooStuff: true,
        },
      },
      {
        given: {
          path: 'fooStuffs',
          namespace: '',
          channel: 'debug',
        },
        expected: {
          foo: false,
          fooStuff: false,
          fooWildcard: true,
          fooWildcardNoFooStuff: true,
          fooWildcardNoFooStuffWildcard: false,
          fooWildcardNoFooStuffWildcardFooStuff: false,
        },
      },
    ] satisfies { given: DebugDefinition, expected: Outputs }[];

    describe.each(rulesInput)('enabled = $enabled, disabled = $disabled', ({
      rules, id,
    }) => {
      it.each(testCases)('definitionIsEnabled($given) = $expected', ({
        given, expected,
      }) => {
        const result = expected[id];
        expect(definitionIsEnabled(given, rules as any)).toBe(result);
      });
    });
  });
});
