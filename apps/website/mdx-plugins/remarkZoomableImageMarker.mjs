import { visit } from 'unist-util-visit';

export const zoomSentinel = '!zoom-image';

export default function remarkZoomableImageMarker() {
  // unified attachers return a transformer; mdast is intentionally mutated in place.
  // eslint-disable-next-line unicorn/consistent-function-scoping
  return (tree) => {
    visit(tree, 'image', (node) => {
      if (typeof node.alt !== 'string' || !/^!zoom(?:\s+|$)/.test(node.alt.trim())) return;
      // eslint-disable-next-line no-param-reassign
      node.alt = node.alt.trim().replace(/^!zoom\s*/, '');
      // eslint-disable-next-line no-param-reassign
      node.title = node.title ? `${zoomSentinel} ${node.title}` : zoomSentinel;
    });
  };
}
