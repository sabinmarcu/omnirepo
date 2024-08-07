import type { WalkFsFixture } from './index.js';

export default {
  setup: {
    '/path': '',
  },
  input: [
    '/path',
    () => false,
  ],
  error: 'Reached root',
} satisfies WalkFsFixture;
