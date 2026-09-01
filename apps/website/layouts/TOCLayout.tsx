import { TOCLayoutTOC } from './TOCLayout.toc';
import { PageLayout } from './PageLayout';
import { TOCDrawerTrigger } from './TOCLayout.toc.drawer';
import { tocLayoutStyles } from './TOCLayout.css';

export namespace TOCLayout {
  export type Props = (
    & PageLayout.Props
    & TOCLayoutTOC.Props
  );
}
export function TOCLayout({
  toc, maxDepth, ...props
}: TOCLayout.Props) {
  return (
    <div className={tocLayoutStyles}>
      <PageLayout {...props} />
      <TOCDrawerTrigger />
      <TOCLayoutTOC toc={toc} maxDepth={maxDepth} />
    </div>
  );
}
