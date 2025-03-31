import type { WalkFsFixture } from './index.js';

export default {
  setup: {
    '/path': '',
  },
  input: [
    '/path',
    () => true,
    (value: any) => `processed ${value}`,
  ],
  output: 'processed /path',
} satisfies WalkFsFixture;
