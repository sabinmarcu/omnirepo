import type { NextConfig } from "next";
import {
  createVanillaExtractPlugin
} from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@sabinmarcu/theme'],
  experimental: {
    externalDir: true,
  }
};

export default withVanillaExtract(nextConfig);
