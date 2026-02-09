import { ThemedLink } from '@/components/ThemedLink';
import type { usePageTOCContextProvider } from './PageTOCLayout.core';
import { pageTOCLayoutTOCStyles } from './PageTOCLayout.toc.css';

export namespace PageTOCLayoutTOC {
  export type Props = {
    links: usePageTOCContextProvider.TOCObject[],
    maxLevel?: number,
  };
}

function TOCLayoutList({
  links,
  maxLevel = Infinity,
}: PageTOCLayoutTOC.Props) {
  return (
    <ul>
      {links.map(({
        title,
        slug,
        children,
        level,
      }) => (level < maxLevel
        ? (
          <>
            <li><ThemedLink href={ `#${slug}` }>{title}</ThemedLink></li>
            {children
              ? <TOCLayoutList links={children} />
              : null
            }
          </>
        )
        : null))}
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
