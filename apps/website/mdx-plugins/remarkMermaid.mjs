const mermaidLanguage = 'mermaid';

/** Replaces mermaid fences before CodeHike runs, so they never reach code annotation parsing. */
function transform(node) {
  if (node.type === 'code' && node.lang === mermaidLanguage) {
    return {
      type: 'mdxJsxFlowElement',
      name: 'Mermaid',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'chart',
          value: node.value,
        },
      ],
      children: [],
      position: node.position,
    };
  }

  const children = Array.isArray(node.children)
    ? node.children.map(transform)
    : node.children;

  return children === node.children
    ? node
    : {
      ...node,
      children,
    };
}

export default function remarkMermaid() {
  return transform;
}
