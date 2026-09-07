/* eslint-disable import/extensions */
import { remarkCodeHike } from 'codehike/mdx';

const mermaidLanguage = 'mermaid';

/**
 * Wraps CodeHike so mermaid fences are always ignored, even if `remarkMermaid`
 * did not claim them. Config from `next.config.ts` must stay Turbopack-serializable,
 * so the `ignoreCode` predicate has to live here.
 */
export default function remarkCodeHikePlugin(config = {}) {
  return remarkCodeHike({
    ...config,
    ignoreCode: (codeblock) => codeblock.lang === mermaidLanguage,
  });
}
