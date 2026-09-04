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

function countLinks(toc: TOCLayoutTOC.Props['toc']): number {
  let count = 0;
  for (const link of toc) {
    count += 1 + countLinks(link.children);
  }
  return count;
}

export function TOCLayout({
  toc,
  maxDepth = Infinity,
  ...props
}: TOCLayout.Props) {
  const restrictedToc = restrictLinksToMaxDepth(toc, maxDepth);

  if (countLinks(restrictedToc) < 2) {
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
