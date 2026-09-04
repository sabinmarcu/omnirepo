import type z from 'zod';
import { getTranslations } from 'next-intl/server';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { ClientClickProxy } from '@/components/ClientClickProxy';
import type { tocSchema } from '@/models/schemas';
import { tocLayoutTOCStyles } from './TOCLayout.toc.css';
import { tocPopoverId } from './TOCLayout.toc.constants';
import { TOCDrawerCloseButton } from './TOCLayout.toc.drawer';

export namespace TOCLayoutTOC {
  export type Props = {
    toc: z.infer<typeof tocSchema>,
  };
}

namespace TOCLayoutList {
  export type Props = (
    & TOCLayoutTOC.Props
    & { root?: boolean }
  );
}

function TOCLayoutList({
  toc,
  root,
}: TOCLayoutList.Props) {
  return (
    <ul>
      {root
        ? (<ClientClickProxy delegate={tocPopoverId} />
        )
        : null}
      {toc.map(({
        value: title,
        attributes: { id: slug },
        children,
      }) => (
        <li key={slug}>
          <ThemedLink href={`#${slug}`}>{title}</ThemedLink>
          {children && children.length > 0
            ? <TOCLayoutList toc={children} />
            : null}
        </li>
      ))}
    </ul>
  );
}

export async function TOCLayoutTOC({
  toc,
}: TOCLayoutTOC.Props) {
  const translate = await getTranslations('tableOfContents');
  return (
    <aside
      id={tocPopoverId}
      popover="auto"
      className={tocLayoutTOCStyles}
      {...{ [ThemedLink.undecoratedDataAttribute]: true }}
    >
      <nav>
        <h2>
          <span>{translate('label')}</span>
          <TOCDrawerCloseButton />
        </h2>
        <TOCLayoutList toc={toc} root />
      </nav>
    </aside>
  );
}
