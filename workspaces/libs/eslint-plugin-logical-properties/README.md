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

The recommended path is to use one of the presets.

### Presets

Since these properties should be all turned on, or off, the presets we offer are:

- recommended (all rules turned on, `error` severity)
- warning (all rules set to `warn` severity)
- disable (all rules turned off)

Using them is as easy as:

```ts
import logicalPropertiesPlugin from 'eslint-plugin-logical-properties';

const finalEslintConfig = [
  logicalPropertiesPlugin.configs.recommended, 
  // logicalPropertiesPlugin.configs.warning, 
  // logicalPropertiesPlugin.configs.disable, 
];
```

Of course, you could use them as part of your config:

```ts
import logicalPropertiesPlugin from 'eslint-plugin-logical-properties';

const customConfig = [
  {
    name: "My Custom Config",
    plugins: {
      'logical-properties': logicalPropertiesPlugin,
      [...]
    },
    rules: {
      ...logicalPropertiesPlugin.configs.recommended.rules,
      [...]
    }
  }
]
```

### Custom Configuration

That being said, if you want to customize the options, you have two options:

- go through every rule and set the options manually
- use the `createLogicalPropertiesConfig` helper:

```ts
import { createLogicalPropertiesConfig } from 'eslint-plugin-logical-properties';

const config = createLogicalPropertiesConfig('error', {
  functions: ['style', 'globalStyle'],
  keyframes: ['keyframes'],
  jsxAttributes: ['style'],
});
```

> [!NOTE]
> The helper generates an entire config,
with the plugin attached, not just rules,
so you can use it directly in your ESLint config.

## Configuration

All rules have the same options, three arrays:

- functions
- keyframes
- jsxAttributes

The difference lies in how they are processed:

- functions: expected to be called with CSS objects
or arrays of CSS objects (ignores all else, like strings)
- keyframes: expected to be called with an object
whose properties are CSS objects
- jsxAttributes: attributes on your JSX components
that should be treated as CSS objects

> [!NOTE]
> When referring to CSS Objects, it's understood
as an object whose keys are CSS properties

### Default Config

```ts
const options = {
  functions: ['style', 'globalStyle'],
  keyframes: ['keyframes'],
  jsxAttributes: ['style'],
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

## Rules

| Rule | Property | Replacement | Property | Value |
| --------------- | --------------- | --------------- | --- | --- |
| border | borderLeft | borderInlineStart | ✅ | ❌ |
| | borderLeftColor | borderInlineStartColor | ✅ | ❌ |
| | borderLeftStyle | borderInlineStartStyle | ✅ | ❌ |
| | borderLeftWidth | borderInlineStartWidth | ✅ | ❌ |
| | borderRight | borderInlineEnd | ✅ | ❌ |
| | borderRightColor | borderInlineEndColor | ✅ | ❌ |
| | borderRightStyle | borderInlineEndStyle | ✅ | ❌ |
| | borderRightWidth | borderInlineEndWidth | ✅ | ❌ |
| | borderTop | borderBlockStart | ✅ | ❌ |
| | borderTopColor | borderBlockStartColor | ✅ | ❌ |
| | borderTopStyle | borderBlockStartStyle | ✅ | ❌ |
| | borderTopWidth | borderBlockStartWidth | ✅ | ❌ |
| | borderBottom | borderBlockEnd | ✅ | ❌ |
| | borderBottomColor | borderBlockEndColor | ✅ | ❌ |
| | borderBottomStyle | borderBlockEndStyle | ✅ | ❌ |
| | borderBottomWidth | borderBlockEndWidth | ✅ | ❌ |
| border-radius | borderTopLeftRadius | borderStartStartRadius | ✅ | ❌ |
| | borderTopRightRadius | borderStartEndRadius | ✅ | ❌ |
| | borderBottomLeftRadius | borderEndStartRadius | ✅ | ❌ |
| | borderBottomRightRadius | borderEndEndRadius | ✅ | ❌ |
| | borderRadius | will use above depending on arguments | ✅ | ❌ |
| inset | top | insetBlockStart | ✅ | ❌ |
| | bottom | insetBlockEnd | ✅ | ❌   |
| | left | insetInlineStart | ✅ | ❌ |
| | right | insetInlineEnd | ✅ | ❌ |
| margin | marginLeft | marginInlineStart | ✅ | ❌ |
| | marginRight | marginInlineEnd | ✅ | ❌ |
| | marginTop | marginBlockStart | ✅ | ❌ |
| | marginBottom | marginBlockEnd | ✅ | ❌ |
| | margin | will use above depending on arguments | ✅ | ❌ |
| padding | paddingLeft | paddingInlineStart | ✅ | ❌ |
| | paddingRight | paddingInlineEnd | ✅ | ❌ |
| | paddingTop | paddingBlockStart | ✅ | ❌ |
| | paddingBottom | paddingBlockEnd | ✅ | ❌ |
| | padding | will use above depending on arguments | ✅ | ❌ |
| overflow | overflowX | overflowInline | ✅ | ❌ |
| | overflowY | overflowBlock | ✅ | ❌ |
| overscroll-behavior | overscrollBehaviorX | overscrollBehaviorInline | ✅ | ❌ |
| | overscrollBehaviorY | overscrollBehaviorBlock | ✅ | ❌ |
| float | left | inline-start | ❌ | ✅ |
| | right | inline-end | ❌ | ✅ |
| clear | left | inline-start | ❌ | ✅ |
| | right | inline-end | ❌ | ✅ |
| textAlign | left | inline-start | ❌ | ✅ |
| | right | inline-end | ❌ | ✅ |
