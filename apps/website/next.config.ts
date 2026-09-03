import type { NextConfig } from 'next';
import {
  createVanillaExtractPlugin,
} from '@vanilla-extract/next-plugin';
import createMdx from '@next/mdx';
import {
  remarkCodeHike,
  recmaCodeHike,
  type CodeHikeConfig,
} from 'codehike/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import { remarkMdxToc } from 'remark-mdx-toc';
import remarkHeadingId from 'remark-heading-id';

const withVanillaExtract = createVanillaExtractPlugin();
const withNextIntl = createNextIntlPlugin();

// Comma-separated hostnames (wildcards allowed) permitted to fetch dev assets, e.g. Tailscale hosts.
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
  // cacheComponents: true,
  experimental: {
    externalDir: true,
    typedEnv: true,
    viewTransition: true,
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
      [remarkHeadingId, {
        defaults: true,
        uniqueDefaults: true,
      }],
      [remarkMdxToc as any, { name: 'toc' }],
      [remarkCodeHike, chConfig],
    ],
    recmaPlugins: [[recmaCodeHike, chConfig]],
    jsx: true,
  },
});

export default withNextIntl(withMdx(withVanillaExtract(nextConfig)));

