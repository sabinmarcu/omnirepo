import type { WalkFsFixture } from './index';

export default {
  setup: {
    '/path': '',
  },
  input: ['/path', () => true],
  output: '/path',
} satisfies WalkFsFixture;
