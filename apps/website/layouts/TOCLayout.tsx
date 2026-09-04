import { TOCLayoutTOC } from './TOCLayout.toc';
import { PageLayout } from './PageLayout';
import { TOCDrawerTrigger } from './TOCLayout.toc.drawer';
import { tocLayoutStyles } from './TOCLayout.css';

export namespace TOCLayout {
  export type Props = (
    & PageLayout.Props
    & TOCLayoutTOC.Props
    & {
      entryDepth?: number,
      maxDepth?: number,
    }
  );
}

function restrictLinksToDepthRange(
  toc: TOCLayoutTOC.Props['toc'],
  entryDepth: Exclude<TOCLayout.Props['entryDepth'], undefined>,
  maxDepth: Exclude<TOCLayout.Props['maxDepth'], undefined>,
) {
  const result: TOCLayoutTOC.Props['toc'] = [];
  for (const link of toc) {
    const children = restrictLinksToDepthRange(
      link.children,
      entryDepth,
      maxDepth,
    );
    if (link.depth < entryDepth) {
      result.push(...children);
    } else if (link.depth <= maxDepth) {
      result.push({
        ...link,
        children,
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
  entryDepth = -Infinity,
  maxDepth = Infinity,
  ...props
}: TOCLayout.Props) {
  const restrictedToc = restrictLinksToDepthRange(toc, entryDepth, maxDepth);

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
