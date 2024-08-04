# @sabinmarcu/eslint-config

Modular config for widespread usage.

## Parsers: babel or typescript

If you have a typescript project, please install:

```sh
$ yarn add @typescript-eslint/{parser,eslint-plugin}
// or 
$ yarn add @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Otherwise, sad times, install:

```sh
$ yarn add @babel/{core,eslint-parser}
// or
$ yarn add @babel/core @babel/eslint-parser
```


## Extensions

Being modular, certain configs won't be applied unless you install its dependencies. 

### React / JSX

To take advantage of React and JSX linting, install the plugins required for that: 

```sh
$ yarn add eslint-plugin-{react{,-hooks},jsx-a11y}
// or
$ yarn add eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

### Storybook

To use storybook linting, install its plugin:

```sh
$yarn add eslint-plugin-storybook
```

### Type Testing

To do type testing (type unit tests), install the plugin:

```sh
$ yarn add eslint-plugin-expect-type
```

> [!NOTE]
  Maybe it doesn't need mentioning, but this also requires typescript
> 