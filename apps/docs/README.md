# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Workspace API guides

The TypeDoc API plugin publishes workspace README content at `/api/<package-slug>`, such as `/api/theme-core`. Cross-package links in these guides must target published API routes, for example `[theme-core](/api/theme-core)`, rather than repository paths such as `../theme-core/README.md`. Ordinary README links are rendered as site URLs, not rewritten to other package pages. Broken-link checking remains strict during the build.


### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
