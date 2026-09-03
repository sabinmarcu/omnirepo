import {
  describe,
  expect,
  it,
} from 'vitest';
import { isIgnoredTag } from './ignoredTagPatterns';

describe('isIgnoredTag', () => {
  it('matches ignored tag patterns by segment', () => {
    expect(isIgnoredTag('skills:typescript')).toBe(true);
    expect(isIgnoredTag('lang:typescript')).toBe(false);
    expect(isIgnoredTag('skills')).toBe(false);
  });
});
