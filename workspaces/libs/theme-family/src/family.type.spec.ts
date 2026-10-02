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
import type {
  FamilyInput,
  FamilyPatch,
  ResolvedFamilyInput,
} from './index.js';

const opaqueCodec = {
  encode(value: { readonly value: string }) { return value.value; },
  decode(value: string) { return { value }; },
};

const theme = defineTheme({
  scene: {
    tint: variableGenerator({
      scope: 'contextual',
      sources: variantSource(stringCodec, {
        light: 'white',
        dark: 'black',
      }),
      build: (tint) => ({ tokens: { surface: css`light-dark(${tint.light}, ${tint.dark})` } }),
    }),
    density: variableGenerator({
      scope: 'shared',
      sources: source(numberCodec, 8),
      build: (density) => ({ tokens: { spacing: css`${density}px` } }),
    }),
  },
  timing: variableGenerator({
    scope: 'contextual',
    sources: {
      duration: source(numberCodec),
      opaque: source(opaqueCodec),
    },
    build: ({ duration }) => ({ tokens: { value: css`${duration}ms` } }),
  }),
  query: staticGenerator('(width < 40rem)'),
} as const, { prefix: 'family-types' });

const family = createThemeFamily(theme, {
  id: 'typed',
  families: ['night'] as const,
});

type Input = FamilyInput<typeof theme.definition.schema, 'base' | 'night'>;
type Patch = FamilyPatch<typeof theme.definition.schema, 'base' | 'night'>;
type Resolved = ResolvedFamilyInput<typeof theme.definition.schema, 'base' | 'night'>;

const input: Input = {
  shared: { scene: { density: 12 } },
  families: {
    base: {
      timing: {
        duration: 100,
        opaque: { value: 'base' },
      },
    },
    night: {
      scene: { tint: 'navy' },
      timing: {
        duration: 200,
        opaque: { value: 'night' },
      },
    },
  },
};
const scalarVariant: Input = {
  families: {
    base: {
      timing: {
        duration: 100,
        opaque: { value: 'base' },
      },
    },
    night: {
      scene: { tint: 'black' },
      timing: {
        duration: 200,
        opaque: { value: 'night' },
      },
    },
  },
};
const partialVariant: Input = {
  families: {
    base: {
      timing: {
        duration: 100,
        opaque: { value: 'base' },
      },
    },
    night: {
      scene: { tint: { light: 'linen' } },
      timing: {
        duration: 200,
        opaque: { value: 'night' },
      },
    },
  },
};
const patch: Patch = {
  families: { night: { scene: { tint: { dark: 'navy' } } } },
};
const resolved: Resolved = family(input) && family.read();
const exactContract: 'var(--family-types-scene-tint-surface)' = family.contract.scene.tint.surface;
const exactSetupReturn: 'var(--family-types-scene-tint-surface)' = family.update(patch).scene.tint.surface;
const exactPrivateContextual: 'var(--family-types-family-typed-families-base-scene-tint-surface)' = family.themes.base.scene.tint.surface;
const exactSharedReference: 'var(--family-types-scene-density-spacing)' = family.themes.night.scene.density.spacing;
const exactStaticReference: '(width < 40rem)' = family.themes.night.query;
const baseMember: 'base' = family.families[0];
const nightSelector: '[data-theme-family="night"]' = family.selectors.night;

const missingRequiredMember: Input = {
  // @ts-expect-error Required contextual sources are required for every member.
  families: {
    base: {
      timing: {
        duration: 100,
        opaque: { value: 'base' },
      },
    },
  },
};
const staticAsInput: Input = {
  families: {
    base: {
      timing: {
        duration: 100,
        opaque: { value: 'base' },
      },
    },
    night: {
      timing: {
        duration: 200,
        opaque: { value: 'night' },
      },
    },
  },
  // @ts-expect-error Static declarations are not source input paths.
  query: '(width < 80rem)',
};
const wrongScopeInput: Input = {
  shared: {
    // @ts-expect-error Contextual branches belong below families, never shared.
    timing: {
      duration: 100,
      opaque: { value: 'bad' },
    },
  },
  families: {
    base: {
      timing: {
        duration: 100,
        opaque: { value: 'base' },
      },
    },
    night: {
      timing: {
        duration: 200,
        opaque: { value: 'night' },
      },
    },
  },
};
const mixedScopeInput: Input = {
  families: {
    base: {
      scene: {
        // @ts-expect-error A family scene branch only exposes contextual declarations.
        density: 12,
      },
      timing: {
        duration: 100,
        opaque: { value: 'base' },
      },
    },
    night: {
      timing: {
        duration: 200,
        opaque: { value: 'night' },
      },
    },
  },
};
const unknownFamily: Patch = {
  families: {
    // @ts-expect-error Family patches accept only the declared members plus base.
    day: { timing: { duration: 100 } },
  },
};
const opaquePartial: Patch = {
  families: {
    base: {
      timing: {
        // @ts-expect-error Opaque values are complete replacements rather than deep patches.
        opaque: {},
      },
    },
  },
};
const invalidVariant: Patch = {
  families: {
    night: {
      scene: {
        tint: {
          // @ts-expect-error A variant source has only its declared light and dark variants.
          system: 'black',
        },
      },
    },
  },
};
const derivedPatch: Patch = {
  families: {
    night: {
      scene: {
        // @ts-expect-error Derived token paths cannot be used as source patches.
        surface: 'black',
      },
    },
  },
};

const wrapperTheme = defineTheme({
  value: variableGenerator({
    scope: 'contextual',
    sources: source(stringCodec, 'white'),
    build: (value) => ({ tokens: { value: css`${value}` } }),
  }),
} as const, { prefix: 'wrapper' });
const wrappers = createThemeFamily(wrapperTheme, {
  id: 'wrappers',
  families: ['shared', 'families'] as const,
});
const legalWrapperNames = wrappers({
  families: {
    base: {},
    shared: {},
    families: {},
  },
});

const reservedMember = createThemeFamily(wrapperTheme, {
  id: 'reserved',
  // @ts-expect-error Base is provided by composition and cannot be declared again.
  families: ['base'],
});
const duplicateMember = createThemeFamily(wrapperTheme, {
  id: 'duplicate',
  // @ts-expect-error Literal member lists cannot contain duplicates.
  families: ['night', 'night'],
});
const invalidConfig = createThemeFamily(wrapperTheme, {
  // @ts-expect-error Configuration IDs are immutable valid kebab namespaces.
  id: 'Not Valid',
  families: ['night'],
});
// @ts-expect-error Unknown members cannot be selected through the typed picker.
family.pick('unknown');
const requiredSharedTheme = defineTheme({
  density: variableGenerator({
    scope: 'shared',
    sources: source(numberCodec),
    build: (value) => ({ tokens: { spacing: css`${value}px` } }),
  }),
});
type RequiredShared = FamilyInput<typeof requiredSharedTheme.definition.schema, 'base' | 'night'>;
const requiredShared: RequiredShared = { shared: { density: 4 } };
// @ts-expect-error A required shared source makes its source container required.
const missingShared: RequiredShared = {};

export const familyTypeAssertions = {
  input,
  scalarVariant,
  partialVariant,
  patch,
  resolved,
  exactContract,
  exactSetupReturn,
  exactPrivateContextual,
  exactSharedReference,
  exactStaticReference,
  baseMember,
  nightSelector,
  missingRequiredMember,
  staticAsInput,
  wrongScopeInput,
  mixedScopeInput,
  unknownFamily,
  opaquePartial,
  invalidVariant,
  derivedPatch,
  legalWrapperNames,
  reservedMember,
  duplicateMember,
  invalidConfiguration: invalidConfig,
  requiredShared,
  missingShared,
};
