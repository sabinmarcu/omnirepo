import {
  describe,
  expect,
  it,
} from 'vitest';
import { formatSRGB } from './colors.js';

describe('color format serialization', () => {
  it('retains translucent and transparent alpha in every sRGB format', () => {
    expect(formatSRGB([1, 0, 0, 0.5], 'hex')).toBe('#ff000080');
    expect(formatSRGB([1, 0, 0, 0.5], 'rgb')).toBe('rgb(255 0 0 / 0.5)');
    expect(formatSRGB([1, 0, 0, 0.5], 'hsl')).toBe('hsl(0 100% 50% / 0.5)');
    expect(formatSRGB([0, 0, 0, 0], 'hex')).toBe('#00000000');
    expect(formatSRGB([0, 0, 0, 0], 'hsl')).toBe('hsl(0 0% 0% / 0)');
  });

  it('handles achromatic endpoints without undefined saturation or hue', () => {
    expect(formatSRGB([0, 0, 0, 1], 'hsl')).toBe('hsl(0 0% 0%)');
    expect(formatSRGB([1, 1, 1, 1], 'hsl')).toBe('hsl(0 0% 100%)');
    expect(formatSRGB([0.5, 0.5, 0.5, 1], 'hsl')).toBe('hsl(0 0% 50%)');
  });

  it('normalizes negative hue and preserves fractional RGB channels', () => {
    expect(formatSRGB([1, 0, 0.5, 1], 'hsl')).toBe('hsl(330 100% 50%)');
    expect(formatSRGB([0.25, 0.75, 0.25, 1], 'hsl')).toBe('hsl(120 50% 50%)');
    expect(formatSRGB([0.25, 0.75, 0.25, 1], 'rgb')).toBe('rgb(63.75 191.25 63.75)');
    expect(formatSRGB([0.25, 0.75, 0.25, 1], 'hex')).toBe('#40bf40');
  });

  it('clips wide-gamut channels when an sRGB-only format is requested', () => {
    expect(formatSRGB([1.09302, -0.22669, -0.150073, 1], 'hex')).toBe('#ff0000');
    expect(formatSRGB([1.09302, -0.22669, -0.150073, 1], 'rgb')).toBe('rgb(255 0 0)');
    expect(formatSRGB([1.09302, -0.22669, -0.150073, 1], 'hsl')).toBe('hsl(0 100% 50%)');
  });
});
