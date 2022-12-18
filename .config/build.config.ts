import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src',
      outDir: './esm',
      format: 'esm',
      ext: 'mjs',
    },
    {
      builder: 'mkdist',
      input: './src',
      outDir: './cjs',
      format: 'cjs',
      ext: 'cjs',
    }
  ],
  declaration: true,
  failOnWarn: false,
});