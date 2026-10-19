import remarkHeadingId from 'remark-heading-id';
import { visit } from 'unist-util-visit';

export default function remarkWebsiteHeadingId() {
  const assignIds = remarkHeadingId({ defaults: true });

  return (tree) => {
    const headings = [];
    const explicit = new Set();
    let hasSlides = false;

    visit(tree, 'heading', (node) => {
      headings.push(node);
      const last = node.children.at(-1);
      if (last?.type === 'text' && / \{#[^}]+\}\s*$/.test(last.value)) {
        explicit.add(node);
      }
      if (node.depth === 1 && /^!!slide(?:\s|$)/.test(node.children.at(0)?.value ?? '')) {
        hasSlides = true;
      }
    });

    assignIds(tree);
    if (!hasSlides) return;

    // remark-heading-id 1.x ignores uniqueDefaults. Only slide documents need
    // generated IDs deduplicated here; preserve explicit IDs and other content.
    const used = new Set([...explicit].map((node) => node.data.hProperties.id));
    for (const node of headings) {
      if (!explicit.has(node)) {
        const base = node.data.hProperties.id;
        let id = base;
        let suffix = 2;
        while (used.has(id)) {
          id = `${base}-${suffix}`;
          suffix += 1;
        }
        used.add(id);
        node.data.id = id;
        node.data.hProperties.id = id;
      }
    }
  };
}
