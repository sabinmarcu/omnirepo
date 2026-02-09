'use server';

import { PageTOCLayoutAnchorClient } from './PageTOCLayout.anchor.runtime';

export namespace PageTOCLayoutAnchor {
  export type Props = PageTOCLayoutAnchorClient.Props;
}

export async function PageTOCLayoutAnchor(
  { children, ...rest }: PageTOCLayoutAnchor.Props,
) {
  return (
    <>
      <PageTOCLayoutAnchorClient {...rest} children={children} />
      {children}
    </>
  );
}
