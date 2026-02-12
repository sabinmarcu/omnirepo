import { ThemedLink } from '@/components/ThemedLink';
import type { ReactElement } from 'react';
import { ClientClickProxy } from '@/components/ClientClickProxy';
import type { usePageTOCContextProvider } from './PageTOCLayout.core';
import { pageTOCLayoutTOCStyles } from './PageTOCLayout.toc.css';
import { mobileTOCTriggerSelector } from './PageTOCLayout.toc.constants';

export namespace PageTOCLayoutTOC {
  export type Props = {
    links: usePageTOCContextProvider.TOCObject[],
    maxLevel?: number,
    header: ReactElement,
  };
}

function restrictLinksToMaxLevel(
  links: PageTOCLayoutTOC.Props['links'],
  maxLevel: Exclude<PageTOCLayoutTOC.Props['maxLevel'], undefined>,
) {
  const result: PageTOCLayoutTOC.Props['links'] = [];
  for (const link of links) {
    if (link.level <= maxLevel) {
      result.push({
        ...link,
        children: restrictLinksToMaxLevel(link.children, maxLevel),
      });
    }
  }
  return result;
}

function TOCLayoutList({
  links,
  maxLevel = Infinity,
}: Omit<PageTOCLayoutTOC.Props, 'header'>) {
  const restrictedLinks = restrictLinksToMaxLevel(links, maxLevel);

  return (
    <ul>
      {restrictedLinks.map(({
        title,
        slug,
        children,
      }) => (
          <>
            <li><ThemedLink href={ `#${slug}` }>{title}</ThemedLink></li>
            {children
              ? <TOCLayoutList links={children} />
              : null
            }
          </>
      ))}
    </ul>
  );
}

export function PageTOCLayoutTOC({
  links,
  maxLevel,
  header,
}: PageTOCLayoutTOC.Props) {
  return (
    <aside className={pageTOCLayoutTOCStyles}>
      <section>
        <nav>
          <ClientClickProxy delegate={mobileTOCTriggerSelector} />
          {header}
          <TOCLayoutList links={links} maxLevel={maxLevel} />
        </nav>
      </section>
    </aside>
  );
}
