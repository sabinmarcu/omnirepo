import type { WalkFsFixture } from './index.js';

export default {
  setup: {
    '/path': '',
  },
  input: [
    '/path',
    () => true,
  ],
  output: '/path',
} satisfies WalkFsFixture;
