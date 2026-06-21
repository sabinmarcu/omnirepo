# eslint-plugin-logical-properties

Transform your normal TS/JS-based CSS
into RTL-ready CSS (think: vanilla extract or JSX style attribute).

This works by targeting certain JSX attributes
and TS/JS function calls to identify what
objects need transforming. Needless to say, this works on pure TS/JS Objects.

## Usage

> [!WARNING]
> This plugin will only work with a flat config ESLint (please upgrade, it's great!)

As with any eslint plugin, it comes with presets
and ways of adapting it to your own needs.

### Basic Setup (Preset Only)

The simplest way to use this plugin is with one of the presets:

```ts
import logicalPropertiesPlugin from 'eslint-plugin-logical-properties';

const finalEslintConfig = [
  logicalPropertiesPlugin.configs.recommended,
  // logicalPropertiesPlugin.configs.warning, 
  // logicalPropertiesPlugin.configs.disable, 
];
```

Available presets:
- `recommended` (all rules turned on, `error` severity)
- `warning` (all rules set to `warn` severity)
- `disable` (all rules turned off)

These presets include the plugin and default settings automatically.

### Advanced Setup (Preset + Custom Settings)

```ts
import logicalPropertiesPlugin from 'eslint-plugin-logical-properties';

const customConfig = [
  {
    name: 'logical-properties',
    plugins: {
      'logical-properties': logicalPropertiesPlugin,
    },
    settings: {
      'logical-properties': {
        functions: ['style', 'globalStyle', 'myStyleFactory'],
        keyframes: ['keyframes', 'myKeyframes'],
        jsxAttributes: ['style', 'sx'],
        resolvers: ['selectors.*', '@media.*', '@supports.*', 'variants.*.*', 'custom.tokens.*'],
      },
    },
    rules: {
      ...logicalPropertiesPlugin.configs.recommended.rules,
    },
  },
];
```

### Per-Rule Override

If one rule needs custom behavior, rule options override shared settings:

```ts
import logicalPropertiesPlugin from 'eslint-plugin-logical-properties';

const finalEslintConfig = [
  logicalPropertiesPlugin.configs.recommended,
  {
    name: 'logical-properties-overrides',
    rules: {
      'logical-properties/padding': ['error', {
        functions: ['myStyleFactory'],
        resolvers: ['custom.tokens.*'],
      }],
    },
  },
];
```

### From Scratch (No Preset)

For complete control, you can build the config manually without presets:

```ts
import logicalPropertiesPlugin from 'eslint-plugin-logical-properties';

const finalEslintConfig = [
  {
    name: 'logical-properties',
    plugins: {
      'logical-properties': logicalPropertiesPlugin,
    },
    settings: {
      'logical-properties': {
        functions: ['style', 'globalStyle'],
        keyframes: ['keyframes'],
        jsxAttributes: ['style'],
        resolvers: ['selectors.*', '@media.*'],
      },
    },
    rules: {
      'logical-properties/padding': 'error',
      'logical-properties/margin': 'error',
      'logical-properties/inset': 'error',
      // ... add other rules as needed
    },
  },
];
```

### Custom Configuration

If you want explicit all-rules overrides in one place, use `createLogicalPropertiesConfig`.
This helper keeps its previous behavior and generates a complete ESLint config.

- helper-based all-rules config:

```ts
import { createLogicalPropertiesConfig } from 'eslint-plugin-logical-properties';

const config = createLogicalPropertiesConfig('error', {
  functions: ['style', 'globalStyle'],
  keyframes: ['keyframes'],
  jsxAttributes: ['style'],
  resolvers: ['selectors.*', '@media.*'],
});
```

> [!NOTE]
> The helper generates an entire config,
with the plugin attached, not just rules,
so you can use it directly in your ESLint config.

### Configuration Priority

Option resolution happens in this order:

1. Internal defaults
2. Shared plugin settings (`settings['logical-properties']`)
3. Per-rule options (`rules['logical-properties/<rule>'][1]`)

## Configuration

All rules share the same options:

- functions
- keyframes
- jsxAttributes
- resolvers

The difference lies in how they are processed:

- functions: expected to be called with CSS objects
or arrays of CSS objects (ignores all else, like strings)
- keyframes: expected to be called with an object
whose properties are CSS objects
- jsxAttributes: attributes on your JSX components
that should be treated as CSS objects
- resolvers: nested object paths to recursively inspect for CSS objects

> [!NOTE]
> When referring to CSS Objects, it's understood
as an object whose keys are CSS properties

### Default Config

```ts
const options = {
  functions: ['style', 'globalStyle', 'recipe', 'sprinkles', 'defineProperties'],
  keyframes: ['keyframes'],
  jsxAttributes: ['style'],
  resolvers: [
    'selectors.*',
    '@media.*',
    '@supports.*',
    'base',
    'variants.*.*',
    'compoundVariants.*.style',
  ],
}

// Helper
const generatedConfig = createLogicalPropertiesConfig('error', options);

// Manual Config
const manualConfig = {
  rules: {
    'logical-properties/padding': ['error', options]
  }
};
```

## Shorthand Behavior

For shorthand rules (`padding`, `margin`, `borderRadius`), fixes are conservative:

- 1 value: unchanged
- 2 values: rewritten to logical pair properties
- 3 values: expanded to block-start, inline (single), block-end
- 4 values: expanded to primitive logical properties

Examples:

```ts
// 1 value -> unchanged
style({ padding: '8px' })

// 2 values -> logical pair
style({ padding: '8px 16px' })
// becomes
style({ paddingBlock: '8px', paddingInline: '16px' })

// 3 values -> block-start, single inline, block-end
style({ padding: '8px 16px 4px' })
// becomes
style({
  paddingBlockStart: '8px',
  paddingInline: '16px',
  paddingBlockEnd: '4px',
})

// 4 values -> primitive logical properties
style({ padding: '8px 16px 4px 12px' })
// becomes
style({
  paddingBlockStart: '8px',
  paddingInlineEnd: '16px',
  paddingBlockEnd: '4px',
  paddingInlineStart: '12px',
})
```

The same logic also works for quoted strings and template strings.

## Migration Notes

If you are upgrading from a version that always expanded shorthand values to four properties,
the biggest changes are two-value and three-value shorthand behavior.

### Before/After Autofix

```ts
// Before (old behavior - 2 values)
style({ padding: '8px 16px' })
// autofix
style({
  paddingBlockStart: '8px',
  paddingBlockEnd: '8px',
  paddingInlineStart: '16px',
  paddingInlineEnd: '16px',
})

// After (current behavior - 2 values)
style({ padding: '8px 16px' })
// autofix
style({
  paddingBlock: '8px',
  paddingInline: '16px',
})
```

```ts
// Before (old behavior - 3 values)
style({ padding: '8px 16px 4px' })
// autofix
style({
  paddingBlockStart: '8px',
  paddingInlineStart: '16px',
  paddingInlineEnd: '16px',
  paddingBlockEnd: '4px',
})

// After (current behavior - 3 values)
style({ padding: '8px 16px 4px' })
// autofix
style({
  paddingBlockStart: '8px',
  paddingInline: '16px',
  paddingBlockEnd: '4px',
})
```

```ts
// Before and after for one-value shorthand
style({ padding: '8px' })
// no autofix
style({ padding: '8px' })
```

```ts
// Before and after for 4 values
style({ padding: '8px 16px 4px 12px' })
// autofix (unchanged)
style({
  paddingBlockStart: '8px',
  paddingInlineEnd: '16px',
  paddingBlockEnd: '4px',
  paddingInlineStart: '12px',
})
```

## Rules

| Rule | Source | Replacement | Type |
| --- | --- | --- | --- |
| border | borderLeft | borderInlineStart | property |
| border | borderLeftColor | borderInlineStartColor | property |
| border | borderLeftStyle | borderInlineStartStyle | property |
| border | borderLeftWidth | borderInlineStartWidth | property |
| border | borderRight | borderInlineEnd | property |
| border | borderRightColor | borderInlineEndColor | property |
| border | borderRightStyle | borderInlineEndStyle | property |
| border | borderRightWidth | borderInlineEndWidth | property |
| border | borderTop | borderBlockStart | property |
| border | borderTopColor | borderBlockStartColor | property |
| border | borderTopStyle | borderBlockStartStyle | property |
| border | borderTopWidth | borderBlockStartWidth | property |
| border | borderBottom | borderBlockEnd | property |
| border | borderBottomColor | borderBlockEndColor | property |
| border | borderBottomStyle | borderBlockEndStyle | property |
| border | borderBottomWidth | borderBlockEndWidth | property |
| border | border | borderInlineStart, borderInlineEnd, borderBlockStart, borderBlockEnd | shorthand mapping |
| border-radius | borderTopLeftRadius | borderStartStartRadius | property |
| border-radius | borderTopRightRadius | borderStartEndRadius | property |
| border-radius | borderBottomLeftRadius | borderEndStartRadius | property |
| border-radius | borderBottomRightRadius | borderEndEndRadius | property |
| border-radius | borderRadius (2 values) | borderStartStartRadius + borderEndEndRadius, borderStartEndRadius + borderEndStartRadius | shorthand pair mapping |
| border-radius | borderRadius (3-4 values) | primitive logical radius properties | shorthand expansion |
| inset | top | insetBlockStart | property |
| inset | bottom | insetBlockEnd | property |
| inset | left | insetInlineStart | property |
| inset | right | insetInlineEnd | property |
| margin | marginLeft | marginInlineStart | property |
| margin | marginRight | marginInlineEnd | property |
| margin | marginTop | marginBlockStart | property |
| margin | marginBottom | marginBlockEnd | property |
| margin | margin (2 values) | marginBlock, marginInline | shorthand pair mapping |
| margin | margin (3 values) | marginBlockStart, marginInline, marginBlockEnd | shorthand 3-value |
| margin | margin (4 values) | primitive logical margin properties | shorthand expansion |
| padding | paddingLeft | paddingInlineStart | property |
| padding | paddingRight | paddingInlineEnd | property |
| padding | paddingTop | paddingBlockStart | property |
| padding | paddingBottom | paddingBlockEnd | property |
| padding | padding (2 values) | paddingBlock, paddingInline | shorthand pair mapping |
| padding | padding (3 values) | paddingBlockStart, paddingInline, paddingBlockEnd | shorthand 3-value |
| padding | padding (4 values) | primitive logical padding properties | shorthand expansion |
| overflow | overflowX | overflowInline | property |
| overflow | overflowY | overflowBlock | property |
| overscroll-behavior | overscrollBehaviorX | overscrollBehaviorInline | property |
| overscroll-behavior | overscrollBehaviorY | overscrollBehaviorBlock | property |
| size | width | inlineSize | property |
| size | height | blockSize | property |
| size | minWidth | minInlineSize | property |
| size | minHeight | minBlockSize | property |
| size | maxWidth | maxInlineSize | property |
| size | maxHeight | maxBlockSize | property |
| float | float: left | float: inline-start | value |
| float | float: right | float: inline-end | value |
| clear | clear: left | clear: inline-start | value |
| clear | clear: right | clear: inline-end | value |
