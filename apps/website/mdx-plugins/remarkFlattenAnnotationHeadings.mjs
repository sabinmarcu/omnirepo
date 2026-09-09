/**
 * remark-gfm autolinks email addresses (and URLs) into `link` nodes,
 * splitting heading text into multiple children. CodeHike's `parseHeading`
 * only reads `heading.children[0].value`, so autolinked values are lost.
 *
 * This plugin flattens all children of CodeHike annotation headings
 * (headings whose text starts with `!`) back into a single text node,
 * so CodeHike sees the full value.
 *
 * Must run after `remark-gfm` and before `remarkCodeHike`.
 */
import { visit } from 'unist-util-visit';

function nodeToText(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(nodeToText).join('');
  return '';
}

export default function remarkFlattenAnnotationHeadings() {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      const first = node.children[0];
      if (!first || first.type !== 'text') return;
      if (!first.value.trim().startsWith('!')) return;
      const fullText = node.children.map(nodeToText).join('');
      node.children = [{ type: 'text', value: fullText }];
    });
  };
}
