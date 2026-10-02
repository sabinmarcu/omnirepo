import {
  css,
  defineTheme,
  numberCodec,
  resolveThemeInputs,
  source,
  staticGenerator,
  stringCodec,
  variantSource,
  variableGenerator,
} from './index.js';
import type {
  ThemeInputs,
  ThemePatches,
} from './index.js';

const opaqueCodec = {
  encode(value: { readonly unit: string }) {
    return value.unit;
  },
  decode(value: string) {
    return { unit: value };
  },
};

const schema = {
  colors: variableGenerator({
    scope: 'shared',
    sources: {
      required: source(stringCodec),
      defaulted: source(numberCodec, 2),
      opaque: source(opaqueCodec),
      mode: variantSource(stringCodec, {
        light: 'white',
        dark: 'black',
      }),
    },
    build: (sources, { privateToken, token }) => ({
      tokens: {
        background: css`${sources.required}`,
        foreground: css`${privateToken('contrast')}`,
        forwarded: css`${token('background')}`,
      },
      privateTokens: {
        contrast: css`color-mix(in srgb, ${sources.mode.light}, ${sources.mode.dark})`,
      },
    }),
  }),
  queries: staticGenerator({ compact: '(width < 40rem)' }),
} as const;

const theme = defineTheme(schema, { prefix: 'consumer' });

type Inputs = ThemeInputs<typeof theme>;
type Patches = ThemePatches<typeof theme>;

const validInput: Inputs = {
  colors: {
    required: 'rebeccapurple',
    opaque: { unit: '1rem' },
    mode: {
      light: 'snow',
      dark: 'midnightblue',
    },
  },
};
const scalarVariantInput: Inputs = {
  colors: {
    required: 'rebeccapurple',
    opaque: { unit: '1rem' },
    mode: 'canvas',
  },
};
const partialDefaultedVariantInput: Inputs = {
  colors: {
    required: 'rebeccapurple',
    opaque: { unit: '1rem' },
    mode: { dark: 'black' },
  },
};
const validPatch: Patches = { colors: { mode: { dark: 'black' } } };
const scalarVariantPatch: Patches = { colors: { mode: 'canvas' } };

const exactPublicReference: 'var(--consumer-colors-background)' = theme.contract.colors.background;
const exactVariableReference: 'var(--consumer-colors-background)' = theme.variables.colors.background;
const exactStaticValue: '(width < 40rem)' = theme.contract.queries.compact;

const exactVariableKind: 'variable' = schema.colors.kind;
const exactVariableScope: 'shared' = schema.colors.scope;
const exactStaticKind: 'static' = schema.queries.kind;
// @ts-expect-error Generator discriminants and scope are immutable descriptor properties.
schema.colors.scope = 'contextual';

const missingRequired: Inputs = {
  // @ts-expect-error required source inputs cannot be omitted.
  colors: {
    opaque: { unit: '1rem' },
    mode: 'canvas',
  },
};
const staticAsInput: Inputs = {
  colors: {
    required: 'red',
    opaque: { unit: '1rem' },
    mode: 'canvas',
  },
  // @ts-expect-error static outputs are not update inputs.
  queries: { compact: 'x' },
};
// @ts-expect-error static outputs are omitted from variable-only views.
const staticAsVariable = theme.variables.queries;
// @ts-expect-error opaque source values are complete replacements, not recursively patchable.
const partialOpaquePatch: Patches = { colors: { opaque: {} } };
// @ts-expect-error variant source patches only accept the declared scalar or light/dark fields.
const unknownVariantPatch: Patches = { colors: { mode: { system: 'black' } } };
const wrongSourceType: Inputs = {
  colors: {
    // @ts-expect-error a source codec's input type is preserved.
    required: 2,
    opaque: { unit: '1rem' },
    mode: 'canvas',
  },
};

const collisionGenerator = variableGenerator({
  scope: 'shared',
  sources: {},
  build: () => ({ tokens: { value: css`none` } }),
});
const flattenedCollision = {
  a: { b: collisionGenerator },
  'a-b': collisionGenerator,
} as const;
// @ts-expect-error Flattened declaration names must be unique across nested schema paths.
const rejectedFlattenedCollision = defineTheme(flattenedCollision);
// @ts-expect-error Literal prefixes must be valid CSS custom-property namespace segments.
const rejectedPrefix = defineTheme(schema, { prefix: 'invalid prefix' });

const defaultTheme = defineTheme(schema);
const exactDefaultReference: 'var(--theme-colors-background)' = defaultTheme.contract.colors.background;
// @ts-expect-error Static descriptors cannot be patched.
const staticPatch: Patches = { queries: { compact: 'bad' } };
// @ts-expect-error Derived output names are not source input paths.
const derivedPatch: Patches = { colors: { background: 'red' } };
// @ts-expect-error Existing descriptors cannot be reclassified by the static authoring helper.
const reclassified = staticGenerator(schema.colors);
// @ts-expect-error Prefix characters are checked, not merely whitespace.
const rejectedPunctuation = defineTheme(schema, { prefix: 'theme!' });
// @ts-expect-error A bound namespace cannot be changed in place.
defaultTheme.prefix = 'different';

const staticOnlyTheme = defineTheme({ query: staticGenerator('(width < 40rem)') });
const staticOnlyPatch: ThemePatches<typeof staticOnlyTheme> = {
  // @ts-expect-error Even an entirely static schema has no assignable paths.
  query: '(width < 80rem)',
};
const requiredVariantTheme = defineTheme({
  mode: variableGenerator({
    scope: 'contextual',
    sources: variantSource(stringCodec),
    build: (value) => ({ tokens: { base: css`light-dark(${value.light}, ${value.dark})` } }),
  }),
});
const incompleteVariant: ThemeInputs<typeof requiredVariantTheme> = {
  // @ts-expect-error Missing variants cannot be defaulted without declared defaults.
  mode: { light: 'white' },
};
const variantPatch: ThemePatches<typeof requiredVariantTheme> = { mode: { dark: 'black' } };

const grouped = defineTheme({
  colors: { primary: schema.colors },
  layout: {
    gap: variableGenerator({
      scope: 'shared',
      sources: source(numberCodec, 8),
      build: (base) => ({ tokens: { m: css`${base}` } }),
    }),
    queries: schema.queries,
  },
  staticGroup: { queries: schema.queries },
});
const groupedInput: ThemeInputs<typeof grouped> = {
  colors: {
    primary: {
      required: 'red',
      opaque: { unit: 'px' },
    },
  },
};
const groupedResolved = resolveThemeInputs(grouped, groupedInput);
const resolvedDefault: number = groupedResolved.layout.gap;
const resolvedVariant: string = groupedResolved.colors.primary.mode.dark;
// @ts-expect-error Required nested generator sources require the enclosing group.
const missingGroup: ThemeInputs<typeof grouped> = {};
const invalidGroupPatch: ThemePatches<typeof grouped> = {
  // @ts-expect-error Entirely static nested groups have no source inputs.
  staticGroup: { queries: { compact: 'invalid' } },
};
const groupedPatch: ThemePatches<typeof grouped> = { colors: { primary: { mode: { light: 'red' } } } };

export const inputAssertions = {
  validInput,
  partialDefaultedVariantInput,
  scalarVariantInput,
  validPatch,
  scalarVariantPatch,
  missingRequired,
  staticAsInput,
  staticAsVariable,
  partialOpaquePatch,
  unknownVariantPatch,
  wrongSourceType,
  exactPublicReference,
  exactVariableReference,
  exactStaticValue,
  exactVariableKind,
  exactVariableScope,
  exactStaticKind,
  rejectedFlattenedCollision,
  rejectedPrefix,
  exactDefaultReference,
  staticPatch,
  derivedPatch,
  reclassified,
  rejectedPunctuation,
  staticOnlyPatch,
  incompleteVariant,
  variantPatch,
  groupedInput,
  resolvedDefault,
  resolvedVariant,
  missingGroup,
  invalidGroupPatch,
  groupedPatch,
};
