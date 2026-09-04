import { TOCLayoutTOC } from './TOCLayout.toc';
import { PageLayout } from './PageLayout';
import { TOCDrawerTrigger } from './TOCLayout.toc.drawer';
import { tocLayoutStyles } from './TOCLayout.css';

export namespace TOCLayout {
  export type Props = (
    & PageLayout.Props
    & TOCLayoutTOC.Props
    & { maxDepth?: number }
  );
}

function restrictLinksToMaxDepth(
  toc: TOCLayoutTOC.Props['toc'],
  maxDepth: Exclude<TOCLayout.Props['maxDepth'], undefined>,
) {
  const result: TOCLayoutTOC.Props['toc'] = [];
  for (const link of toc) {
    if (link.depth <= maxDepth) {
      result.push({
        ...link,
        children: restrictLinksToMaxDepth(link.children, maxDepth),
      });
    }
  }
  return result;
}

export function TOCLayout({
  toc,
  maxDepth = Infinity,
  ...props
}: TOCLayout.Props) {
  const restrictedToc = restrictLinksToMaxDepth(toc, maxDepth);

  if (restrictedToc.length < 2) {
    return <PageLayout {...props} />;
  }

  return (
    <div className={tocLayoutStyles}>
      <PageLayout {...props} />
      <TOCDrawerTrigger />
      <TOCLayoutTOC toc={restrictedToc} />
    </div>
  );
}
