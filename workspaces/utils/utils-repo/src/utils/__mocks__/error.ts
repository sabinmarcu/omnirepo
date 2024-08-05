import type { WalkFsFixture } from './index';

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
