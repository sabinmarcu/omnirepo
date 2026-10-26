import { visit } from 'unist-util-visit';
import { zoomSentinel } from './remarkZoomableImageMarker.mjs';

function imageTitle(child) {
  if (child.type === 'image') return child.title;
  if ((child.type === 'mdxJsxTextElement' || child.type === 'mdxJsxFlowElement') && child.name === 'img') {
    return child.attributes.find((attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'title')?.value;
  }
  return undefined;
}

export default function remarkZoomableImage() {
  // unified attachers return a transformer; mdast is intentionally mutated in place.
  // eslint-disable-next-line unicorn/consistent-function-scoping
  return (tree, file) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      const marked = node.children.filter((child) => {
        const title = imageTitle(child);
        return typeof title === 'string' && title.trim().startsWith(zoomSentinel);
      });
      if (marked.length === 0) return;
      const [image] = marked;
      if (marked.length > 1 || node.children.some((child) => child !== image && !(child.type === 'text' && child.value.trim() === ''))) {
        file.fail('A "!zoom" image must be the only content of its paragraph.', node);
      }
      const attributes = image.type === 'image'
        ? [
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: image.url,
          },
          {
            type: 'mdxJsxAttribute',
            name: 'alt',
            value: image.alt ?? '',
          },
        ]
        : image.attributes.filter((attribute) => !(attribute.type === 'mdxJsxAttribute' && attribute.name === 'title'));
      const title = imageTitle(image).trim().slice(zoomSentinel.length).trim();
      if (title) {
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'title',
          value: title,
        });
      }
      // eslint-disable-next-line no-param-reassign
      parent.children[index] = {
        type: 'mdxJsxFlowElement',
        name: 'ZoomableImage',
        attributes,
        children: [],
        position: node.position,
      };
    });
  };
}
