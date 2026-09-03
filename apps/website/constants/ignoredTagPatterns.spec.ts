import {
  describe,
  expect,
  it,
} from 'vitest';
import { isIgnoredTag } from './ignoredTagPatterns';

describe('isIgnoredTag', () => {
  it('allows tags when no patterns are ignored', () => {
    expect(isIgnoredTag('skills:typescript')).toBe(false);
    expect(isIgnoredTag('lang:typescript')).toBe(false);
    expect(isIgnoredTag('skills')).toBe(false);
  });
});
