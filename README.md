[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=flat&logo=github)](https://wallabyjs.com/oss/)

# omnirepo

## Repository Quality

The canonical reference for repository linting, testing, coverage, and Moon task execution is [TESTING_AND_LINTING.md](TESTING_AND_LINTING.md).

- `yarn lint` -> `yarn moon run :lint`
- `yarn test` -> `yarn moon run :test`
- `yarn coverage` -> `vitest --run --coverage`
- CI runs `yarn install --immutable`, `yarn constraints`, and `yarn moon ci`

## Theme and inspector

- Engine references: [theme-core](workspaces/libs/theme-core/README.md), [theme-family](workspaces/libs/theme-family/README.md), and [stylesheet](workspaces/libs/stylesheet/README.md).
- Inspector integrations: [native Web Components](workspaces/libs/theme-devtools-core/README.md) and [thin React binding](workspaces/libs/theme-devtools-react/README.md).
- Website: [composition and default-off Theme devtools experiment](workspaces/private/website-theme/README.md).

## Wallaby.js

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=for-the-badge&logo=github)](https://wallabyjs.com/oss/)

This repository contributors are welcome to use
[Wallaby.js OSS License](https://wallabyjs.com/oss/) to get
test results immediately as you type, and see the results in
your editor right next to your code.
