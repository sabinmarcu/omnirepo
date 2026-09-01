import { TOCLayoutTOC } from './TOCLayout.toc';
import { PageLayout } from './PageLayout';

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
    <>
      <PageLayout {...props} />
      <TOCLayoutTOC toc={toc} maxDepth={maxDepth} />
    </>
  );
}
