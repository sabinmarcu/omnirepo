import { ThemedLink } from '@/components/ThemedLink';
import type { usePageTOCContextProvider } from './PageTOCLayout.core';
import { pageTOCLayoutTOCStyles } from './PageTOCLayout.toc.css';

export namespace PageTOCLayoutTOC {
  export type Props = {
    links: usePageTOCContextProvider.TOCObject[],
    maxLevel?: number,
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
}: PageTOCLayoutTOC.Props) {
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
}: PageTOCLayoutTOC.Props) {
  return (
    <aside className={pageTOCLayoutTOCStyles}>
      <section>
        <nav>
          <h1>Table of Contents</h1>
          <TOCLayoutList links={links} maxLevel={maxLevel} />
        </nav>
      </section>
    </aside>
  );
}
