 

const { pathToFileURL } = await import('node:url');
const { smart } = await import('@babel/template');

export function TransformImportMetaPlugin(
  _context,
  options,
) {
  return {
    name: 'transform-import-meta',
    visitor: {
      Program(path) {
        const metas = [];

        path.traverse({
          MemberExpression(memberExpPath) {
            const { node } = memberExpPath;

            if (
              node.object.type === 'MetaProperty'
              && node.object.meta.name === 'import'
              && node.object.property.name === 'meta'
              && node.property.type === 'Identifier'
              && node.property.name === 'url'
            ) {
              metas.push(memberExpPath);
            }
          },
        });

        if (metas.length === 0) {
          return;
        }

        for (const meta of metas) {
          meta.replaceWith(
            smart.ast`${
              options.filename
                ? JSON.stringify(pathToFileURL(options.filename))
                : "require('url').pathToFileURL(__filename).toString()"
            }`,
          );
        }
      },
    },
  };
}
