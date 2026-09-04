const packageAnnotationPattern = /^!package(?=\s|$)/;

function transform(node) {
  const children = Array.isArray(node.children)
    ? node.children.map(transform)
    : node.children;

  if (
    node.type === 'code'
    && typeof node.meta === 'string'
    && packageAnnotationPattern.test(node.meta)
  ) {
    return {
      ...node,
      children,
      meta: node.meta.replace(packageAnnotationPattern, 'package-command'),
    };
  }

  return children === node.children
    ? node
    : {
      ...node,
      children,
    };
}

export default function remarkPackageCommands() {
  return transform;
}
