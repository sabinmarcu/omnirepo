# @sabinmarcu/eslint-config

Modular config for widespread usage.

## Parsers: babel or typescript

> [!WARNING]
  For the time being, `eslint-plugin-import` has some issues with `eslint-import-resolver-typescript`
So if you write ESM code with `type: module` (aka `module: node16/nodenext` in your `tsconfig.json`), you will encounter the following type of error:

```sh
  Missing file extension "ts" for "..."
``` 
To fix this, apply the following diff to `eslint-plugin-import` (yarn 4 does that automatically if you put the linked file under `.yarn/patches` and put a resolution of `patch:eslint-plugin-import@npm%3A2.29.1#~/.yarn/patches/eslint-plugin-import-npm-2.29.1-b94305f7dc.patch`): [https://github.com/sabinmarcu/omnirepo/tree/master/.yarn/patches/eslint-plugin-import-npm-2.29.1-b94305f7dc.patch](https://github.com/sabinmarcu/omnirepo/tree/master/.yarn/patches/eslint-plugin-import-npm-2.29.1-b94305f7dc.patch).

---

Let's carry on with configuration.

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