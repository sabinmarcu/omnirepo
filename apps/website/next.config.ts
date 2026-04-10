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

import { remarkMdxToc } from 'remark-mdx-toc';
import remarkHeadingId from 'remark-heading-id';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
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

export default withMdx(withVanillaExtract(nextConfig));

