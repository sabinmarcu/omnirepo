[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=flat&logo=github)](https://wallabyjs.com/oss/)

# omnirepo

## Repository Quality

The canonical reference for repository linting, testing, coverage, and Moon task execution is [TESTING_AND_LINTING.md](TESTING_AND_LINTING.md).

- `yarn lint` -> `yarn moon run :lint`
- `yarn test` -> `yarn moon run :test`
- `yarn coverage` -> `vitest --run --coverage`
- CI runs `yarn install --immutable`, `yarn constraints`, and `yarn moon ci`

## Wallaby.js

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=for-the-badge&logo=github)](https://wallabyjs.com/oss/)

This repository contributors are welcome to use
[Wallaby.js OSS License](https://wallabyjs.com/oss/) to get
test results immediately as you type, and see the results in
your editor right next to your code.
