import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  clampZoom,
  identityZoom,
  isDefaultZoom,
  maxZoomScale,
  panBy,
  wheelFactor,
  zoomAt,
} from './ZoomFrame.utils';

describe('zoom geometry', () => {
  it('keeps the content point under the pointer fixed', () => {
    const result = zoomAt(identityZoom, 2, 100, 50, 400, 200);
    expect(result).toEqual({
      scale: 2,
      x: -100,
      y: -50,
    });
    expect(result.x + 100 * result.scale).toBe(100);
    expect(result.y + 50 * result.scale).toBe(50);
  });

  it.each([
    [{
      scale: 2,
      x: 50,
      y: 40,
    }, {
      scale: 2,
      x: 0,
      y: 0,
    }],
    [{
      scale: 2,
      x: -900,
      y: -800,
    }, {
      scale: 2,
      x: -400,
      y: -200,
    }],
  ])('prevents panning gaps for %o', (state, expected) => {
    expect(clampZoom(state, 400, 200)).toEqual(expected);
  });

  it.each([1, 0.5, -1])('resets translation at scale %s', (scale) => {
    const state = clampZoom({
      scale,
      x: -100,
      y: -50,
    }, 400, 200);
    expect(state).toEqual(identityZoom);
    expect(isDefaultZoom(state)).toBe(true);
  });

  it('caps zoom without shifting a point at the cap', () => {
    const state = {
      scale: maxZoomScale,
      x: -100,
      y: -50,
    };
    expect(zoomAt(state, 2, 100, 50, 400, 200)).toEqual(state);
  });

  it('handles a frame that has not been measured', () => {
    expect(clampZoom({
      scale: 2,
      x: -100,
      y: 50,
    }, 0, 0)).toEqual({
      scale: 2,
      x: 0,
      y: 0,
    });
  });

  it('pans in unscaled frame pixels and clamps at an edge', () => {
    const state = {
      scale: 2,
      x: -100,
      y: -50,
    };
    expect(panBy(state, 20, -30, 400, 200)).toEqual({
      scale: 2,
      x: -80,
      y: -80,
    });
    expect(panBy(state, 1000, -1000, 400, 200)).toEqual({
      scale: 2,
      x: 0,
      y: -200,
    });
    expect(isDefaultZoom(state)).toBe(false);
  });
});

describe('wheel normalization', () => {
  it('zooms in opposite directions and normalizes line and page deltas', () => {
    expect(wheelFactor(100, 0)).toBeLessThan(1);
    expect(wheelFactor(-100, 0)).toBeGreaterThan(1);
    expect(wheelFactor(10, 1)).toBe(wheelFactor(160, 0));
    expect(wheelFactor(1, 2)).toBe(wheelFactor(100, 0));
  });

  it('bounds extreme deltas', () => {
    expect(wheelFactor(100_000, 2)).toBe(0.2);
    expect(wheelFactor(-100_000, 2)).toBe(5);
  });
});
