import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  css,
  defineTheme,
  numberCodec,
  source,
  staticGenerator,
  stringCodec,
  variableGenerator,
  variantSource,
} from '@sabinmarcu/theme-core';
import { createThemeFamily } from './index.js';

const createTheme = () => defineTheme({
  scene: {
    tint: variableGenerator({
      scope: 'contextual',
      sources: variantSource(stringCodec, {
        light: 'ivory',
        dark: 'midnightblue',
      }),
      build: (tint) => ({ tokens: { surface: css`light-dark(${tint.light}, ${tint.dark})` } }),
    }),
    density: variableGenerator({
      scope: 'shared',
      sources: source(numberCodec, 8),
      build: (density) => ({ tokens: { spacing: css`calc(${density} * 1px)` } }),
    }),
  },
  timing: variableGenerator({
    scope: 'contextual',
    sources: source(numberCodec),
    build: (duration) => ({ tokens: { duration: css`${duration}ms` } }),
  }),
  query: staticGenerator('(width < 40rem)'),
} as const, { prefix: 'theme' });

const createDefaultTheme = () => defineTheme({
  scene: {
    tint: variableGenerator({
      scope: 'contextual',
      sources: variantSource(stringCodec, {
        light: 'white',
        dark: 'black',
      }),
      build: (tint) => ({ tokens: { surface: css`light-dark(${tint.light}, ${tint.dark})` } }),
    }),
  },
} as const, { prefix: 'defaults' });

describe('createThemeFamily', () => {
  it('keeps member sources isolated, applies descriptor defaults independently, and preserves variants across patches', () => {
    const family = createThemeFamily(createDefaultTheme(), {
      id: 'isolated',
      families: ['night'] as const,
    });

    family({ families: { base: { scene: { tint: { light: 'linen' } } } } });
    expect(family.read()).toEqual({
      shared: {},
      families: {
        base: {
          scene: {
            tint: {
              light: 'linen',
              dark: 'black',
            },
          },
        },
        night: {
          scene: {
            tint: {
              light: 'white',
              dark: 'black',
            },
          },
        },
      },
    });

    family.update({ families: { night: { scene: { tint: { dark: 'navy' } } } } });
    family.update({ families: { night: { scene: { tint: { light: 'snow' } } } } });
    expect(family.read().families).toEqual({
      base: {
        scene: {
          tint: {
            light: 'linen',
            dark: 'black',
          },
        },
      },
      night: {
        scene: {
          tint: {
            light: 'snow',
            dark: 'navy',
          },
        },
      },
    });
  });

  it('uses the original contract while reading, updating, picking, and mounting a complete aggregate input', () => {
    const theme = createTheme();
    const family = createThemeFamily(theme, {
      id: 'demo',
      families: ['night'] as const,
      selector: ':root',
    });
    const input = {
      shared: { scene: { density: 12 } },
      families: {
        base: { timing: 100 },
        night: {
          scene: { tint: 'black' },
          timing: 240,
        },
      },
    } as const;

    expect(family(input)).toBe(theme.contract);
    expect(family.update({ families: { base: { scene: { tint: { dark: 'navy' } } } } })).toBe(theme.contract);
    const beforePick = family.read();
    expect(family.pick('night')).toBe(theme.contract);
    expect(family.read()).toEqual(beforePick);
    expect(family.contract).toBe(theme.contract);
    expect(family.families).toEqual(['base', 'night']);
    expect(family.selectors).toEqual({
      base: '[data-theme-family="base"]',
      night: '[data-theme-family="night"]',
    });
    expect(family.read()).toEqual({
      shared: { scene: { density: 12 } },
      families: {
        base: {
          scene: {
            tint: {
              light: 'ivory',
              dark: 'navy',
            },
          },
          timing: 100,
        },
        night: {
          scene: {
            tint: {
              light: 'black',
              dark: 'black',
            },
          },
          timing: 240,
        },
      },
    });
    expect(theme.contract.query).toBe('(width < 40rem)');
  });

  it('notifies initial observers once with complete independent member state', () => {
    const family = createThemeFamily(createDefaultTheme(), {
      id: 'initial',
      families: ['night'],
    });
    const observed: unknown[] = [];
    family.stylesheet.subscribe(() => { observed.push(family.read()); });
    family({ families: { night: { scene: { tint: 'navy' } } } });
    expect(observed).toEqual([{
      shared: {},
      families: {
        base: {
          scene: {
            tint: {
              light: 'white',
              dark: 'black',
            },
          },
        },
        night: {
          scene: {
            tint: {
              light: 'navy',
              dark: 'navy',
            },
          },
        },
      },
    }]);
  });

  it('commits every family update once, exports live source state, and retains authoritative stylesheet source edits', () => {
    const family = createThemeFamily(createTheme(), {
      id: 'live',
      families: ['night'] as const,
    });
    family({
      families: {
        base: { timing: 100 },
        night: { timing: 200 },
      },
    });
    let notifications = 0;
    family.stylesheet.subscribe(() => { notifications += 1; });

    family.update({
      shared: { scene: { density: 16 } },
      families: { night: { scene: { tint: { dark: 'navy' } } } },
    });
    expect(notifications).toBe(1);

    const baseTintDark = family.bindings.find((binding) => (
      binding.member === 'base'
      && binding.variant === 'dark'
      && binding.inputPath.join('.') === 'families.base.scene.tint.dark'
    ));
    expect(baseTintDark).toMatchObject({
      name: '--theme-family-live-families-base-source-scene-tint-dark',
      scope: 'contextual',
      member: 'base',
    });
    family.stylesheet.update([{
      selector: family.selector,
      rules: { [baseTintDark!.name]: 'slateblue' },
    }]);
    family.update({ families: { night: { timing: 260 } } });
    expect(family.read().families.base.scene.tint.dark).toBe('slateblue');
    expect(family.read().families.night.timing).toBe(260);
  });

  it('exposes source ownership metadata without leaking static or derived output paths into inputs', () => {
    const family = createThemeFamily(createTheme(), {
      id: 'manifest',
      families: ['night'] as const,
    });
    family({
      families: {
        base: { timing: 1 },
        night: { timing: 2 },
      },
    });

    expect(family.bindings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        scope: 'shared',
        inputPath: ['shared', 'scene', 'density'],
      }),
      expect.objectContaining({
        scope: 'contextual',
        member: 'night',
        inputPath: ['families', 'night', 'timing'],
      }),
    ]));
    expect(family.bindings.every((binding) => !binding.inputPath.includes('query'))).toBe(true);
    expect(family.bindings.every((binding) => !binding.inputPath.includes('surface'))).toBe(true);
    expect(() => family.update({ shared: { timing: 5 } } as never)).toThrow();
    expect(() => family.update({
      families: { base: { scene: { density: 5 } } },
    } as never)).toThrow();
    expect(() => family.update({ families: { night: { query: 'bad' } } } as never)).toThrow();
  });

  it('rejects null member/shared payloads and preserves a valid current state', () => {
    const family = createThemeFamily(createDefaultTheme(), {
      id: 'null-inputs',
      families: ['night'],
    });
    expect(() => family({ families: { base: null } } as never)).toThrow();
    family({});
    const before = family.read();
    expect(() => family.update({ families: { night: null } } as never)).toThrow();
    expect(() => family.update({ shared: null } as never)).toThrow();
    expect(family.read()).toEqual(before);
  });

  it('rejects flattened allocations that collide across different valid member paths', () => {
    const metric = variableGenerator({
      scope: 'contextual',
      sources: source(numberCodec, 1),
      build: (value) => ({ tokens: { value: css`${value}` } }),
    });
    const theme = defineTheme({
      c: metric,
      'b-c': metric,
    });
    expect(() => {
      createThemeFamily(theme, {
        id: 'collision',
        families: ['a', 'a-b'],
      });
    }).toThrow();
  });

  it('rejects invalid member namespaces and incomplete required member payloads', () => {
    const theme = createTheme();
    expect(() => {
      createThemeFamily(theme, {
        id: 'invalid',
        families: ['base'] as readonly string[],
      });
    }).toThrow();
    expect(() => {
      createThemeFamily(theme, {
        id: 'invalid',
        families: ['night', 'night'] as readonly string[],
      });
    }).toThrow();
    expect(() => {
      createThemeFamily(theme, {
        id: 'invalid',
        families: ['constructor'] as readonly string[],
      });
    }).toThrow();
    expect(() => {
      createThemeFamily(theme, {
        id: 'invalid',
        families: ['__proto__'] as readonly string[],
      });
    }).toThrow();
    expect(() => {
      createThemeFamily(theme, {
        id: 'Invalid' as string,
        families: ['night'] as readonly string[],
      });
    }).toThrow();
    expect(() => {
      createThemeFamily(theme, {
        id: 'valid',
        families: ['not safe'] as readonly string[],
      });
    }).toThrow();

    const family = createThemeFamily(theme, {
      id: 'required',
      families: ['night'] as const,
    });
    expect(() => family({ families: { base: { timing: 1 } } } as never)).toThrow();
    expect(() => family.pick('unknown' as never)).toThrow();
  });
});
