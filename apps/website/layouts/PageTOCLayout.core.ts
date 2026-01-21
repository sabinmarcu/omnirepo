'use client';

import {
  useContext,
  useState,
  createContext,
  useCallback,
  useMemo,
} from 'react';
import type { Simplify } from '@sabinmarcu/types';

type TOCElement = {
  title: string,
  slug: string,
  level: number,
};

type TOCTree = Simplify<(
  & TOCElement
  & { children: TOCTree[] }
)>;

export namespace usePageTOCContextProvider {
  export type TOCObject = TOCTree;
}

function tocElementToTocTree(link: TOCElement): TOCTree {
  return {
    ...link,
    children: [],
  };
}
function treeLinksToTree(
  links: TOCElement[],
): TOCTree[] {
  if (links.length === 0) {
    return [];
  }
  const result: TOCTree[] = [];
  const stack = [];
  let firstLevel = -1;
  for (const link of links) {
    const current = tocElementToTocTree(link);

    if (current.level === Infinity) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (firstLevel === -1) {
      firstLevel = current.level;
    }

    if (current.level === firstLevel) {
      result.push(current);
    }

    while (stack.length > 0 && stack[0].level >= current.level) {
      stack.shift();
    }

    if (stack.length > 0) {
      stack[0].children.push(current);
    }

    stack.unshift(current);
  }

  return result;
}

export function usePageTOCContextProvider() {
  const [links, setLinks] = useState<TOCElement[]>([]);

  const updateLink = useCallback(
    (toc: TOCElement) => {
      setLinks((previous) => {
        const element = previous.findIndex(({ slug }) => slug === toc.slug);

        if (element !== -1) {
          return previous.map(
            (it, index) => (index === element ? toc : it),
          );
        }

        return [...previous, toc];
      });
    },
    [setLinks],
  );

  const linksTree = useMemo(
    () => treeLinksToTree(links),
    [links],
  );

  return {
    links,
    linksTree,
    updateLink,
  };
}

export const PageTOCContext = createContext<ReturnType<typeof usePageTOCContextProvider>>(
  undefined as any,
);

export const usePageLinks = () => useContext(PageTOCContext)?.links;
export const usePageUpdate = () => useContext(PageTOCContext)?.updateLink;
