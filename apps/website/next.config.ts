import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';
import {
  createVanillaExtractPlugin,
} from '@vanilla-extract/next-plugin';
import createMdx from '@next/mdx';
import type { CodeHikeConfig } from 'codehike/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: {
    mode: 'auto',
    glob: ['**/*.css.ts', '**/*.css.tsx'],
  },
});
const withNextIntl = createNextIntlPlugin();
const remarkCodeHikePlugin = fileURLToPath(
  new URL('mdx-plugins/remarkCodeHike.mjs', import.meta.url),
);
const remarkMdxTocPlugin = fileURLToPath(
  new URL('mdx-plugins/remarkMdxToc.mjs', import.meta.url),
);
const remarkPackageCommandsPlugin = fileURLToPath(
  new URL('mdx-plugins/remarkPackageCommands.mjs', import.meta.url),
);
const recmaCodeHikePlugin = fileURLToPath(
  new URL('mdx-plugins/recmaCodeHike.mjs', import.meta.url),
);

// Comma-separated hostnames (wildcards allowed) permitted to fetch dev assets,
// such as Tailscale hosts.
const allowedDevelopmentOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: allowedDevelopmentOrigins,
  transpilePackages: ['@sabinmarcu/theme'],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  outputFileTracingIncludes: {
    '/*': [
      'content/**/*.mdx',
      'app/**/*.mdx',
      'app/personal/**/*',
      '../../node_modules/@hackernoon/pixel-icon-library/**/*',
    ],
  },
  supportsImmutableAssets: false,
  experimental: {
    externalDir: true,
    typedEnv: true,
  },
};

const chConfig: CodeHikeConfig = {
  components: {
    code: 'CodehikeCode',
    inlineCode: 'CodehikeInlineCode',
  },
};

const withMdx = createMdx({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      ['remark-heading-id', {
        defaults: true,
        uniqueDefaults: true,
      }],
      [remarkMdxTocPlugin, { name: 'toc' }],
      remarkPackageCommandsPlugin,
      [remarkCodeHikePlugin, chConfig],
      'remark-mdx-images',
    ],
    recmaPlugins: [[recmaCodeHikePlugin, chConfig]],
    jsx: true,
  },
});

export default withNextIntl(withMdx(withVanillaExtract(nextConfig)));

