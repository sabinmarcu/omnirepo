'use client';

import { PageLayout } from './PageLayout';
import {
  PageTOCContext,
  usePageTOCContextProvider,
} from './PageTOCLayout.core';
import { PageTOCLayoutTOC } from './PageTOCLayout.toc';

export namespace PageTOCLayoutClient {
  export type Props = (
    & PageLayout.Props
    & Omit<PageTOCLayoutTOC.Props, 'links'>
  );
}

export function PageTOCLayoutClient({
  children,
  maxLevel,
  ...props
}: PageTOCLayoutClient.Props) {
  const context = usePageTOCContextProvider();
  const { linksTree } = context;
  return (
    <>
      <PageTOCLayoutTOC links={linksTree} maxLevel={maxLevel} />
      <PageLayout {...props}>
        <PageTOCContext.Provider value={context}>
          {children}
        </PageTOCContext.Provider>
      </PageLayout>
    </>
  );
}