import type { WalkFsFixture } from './index';

export default {
  setup: {
    '/path': '',
  },
  input: ['/path', () => true, (value) => `processed ${value}`],
  output: 'processed /path',
} satisfies WalkFsFixture;
