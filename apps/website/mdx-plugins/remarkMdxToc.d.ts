import type { Plugin } from 'unified';

// remark-mdx-toc's runtime is compatible with the MDX compiler's Unified 11 interface.
declare const remarkMdxToc: Plugin<[{ name?: string }?]>;
export default remarkMdxToc;
