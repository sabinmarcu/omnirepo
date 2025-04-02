import type { PathWalkerFunction } from '../../types.js';

export type WalkFsFixture = {
  name: string,
  setup: Record<string, any>,
  input: Parameters<PathWalkerFunction>,
} & (
  | { output: ReturnType<PathWalkerFunction> }
  | { error: string }
);

const fixtures = () => [
  {
    name: 'error',
    setup: {
      '/path': '',
    },
    input: [
      '/path',
      () => false,
    ],
    error: 'Reached root',
  },
  {
    name: 'process',
    setup: {
      '/path': '',
    },
    input: [
      '/path',
      () => true,
      (value: any) => `processed ${value}`,
    ],
    output: 'processed /path',
  },
  {
    name: 'valid',

    setup: {
      '/path': '',
    },
    input: [
      '/path',
      () => true,
    ],
    output: '/path',
  },
] as const satisfies WalkFsFixture[];

export default fixtures;
