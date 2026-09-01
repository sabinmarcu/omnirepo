import type z from 'zod';
import { Fragment } from 'react';
import { ThemedLink } from '@/components/ThemedLink';
import { ClientClickProxy } from '@/components/ClientClickProxy';
import type { tocSchema } from '@/models/schemas';
import { tocLayoutTOCStyles } from './TOCLayout.toc.css';
import { mobileTOCTriggerSelector } from './TOCLayout.toc.constants';
import { TOCMobileCloseButton } from './TOCLayout.toc.mobile';

export namespace TOCLayoutTOC {
  export type Props = {
    toc: z.infer<typeof tocSchema>,
    maxDepth?: number,
  };
}

function restrictLinksToMaxDepth(
  toc: TOCLayoutTOC.Props['toc'],
  maxDepth: Exclude<TOCLayoutTOC.Props['maxDepth'], undefined>,
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

namespace TOCLayoutList {
  export type Props = (
    & TOCLayoutTOC.Props
    & { root?: boolean }
  );
}

function TOCLayoutList({
  toc,
  maxDepth = Infinity,
  root,
}: TOCLayoutList.Props) {
  const restrictedLinks = restrictLinksToMaxDepth(toc, maxDepth);

  return (
    <ul>
      {root
        ? (<ClientClickProxy delegate={mobileTOCTriggerSelector} />
        )
        : null}
      {restrictedLinks.map(({
        value: title,
        attributes: { id: slug },
        children,
      }) => (
        <Fragment key={slug}>
          <li><ThemedLink href={`#${slug}`}>{title}</ThemedLink></li>
          {children && children.length > 0
            ? <TOCLayoutList toc={children} />
            : null}
        </Fragment>
      ))}
    </ul>
  );
}

export function TOCLayoutTOC({
  toc,
  maxDepth,
}: TOCLayoutTOC.Props) {
  return (
    <aside className={tocLayoutTOCStyles}>
      <nav>
        <h2>
          <span>Table of Contents</span>
          <TOCMobileCloseButton />
        </h2>
        <TOCLayoutList toc={toc} maxDepth={maxDepth} root />
      </nav>
    </aside>
  );
}
