import type { tocSchema } from '@/models/schemas';
import type z from 'zod';

export function tocSlug(
  title: string,
  { prefix, suffix }: { prefix?: string, suffix?: string } = {},
) {
  return [
    prefix,
    title,
    suffix,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replaceAll(/[ _-]/g, '-');
}

export function tocAnchorProps(
  title: string,
  extra?: Parameters<typeof tocSlug>[1],
) {
  const slug = tocSlug(title, extra);
  return { id: slug };
}

export function tocLinkProps(
  title: string,
  extra?: Parameters<typeof tocSlug>[1],
) {
  const slug = tocSlug(title, extra);
  return { href: `#${slug}` };
}

export type TOCElement = {
  title: string,
  level: number,
  id: string,
};

type TOCTree = z.infer<typeof tocSchema>[number];

function tocElementToTocTree(link: TOCElement): TOCTree {
  return {
    depth: link.level,
    value: link.title,
    attributes: {
      id: link.id,
    },
    children: [],
  };
}

export namespace tocElementsToTree {
  export type Element = TOCElement;
  export type Output = TOCTree[];
}
export function tocElementsToTree(
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

    if (current.depth === Infinity) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (firstLevel === -1) {
      firstLevel = current.depth;
    }

    if (current.depth === firstLevel) {
      result.push(current);
    }

    while (stack.length > 0 && stack[0].depth >= current.depth) {
      stack.shift();
    }

    if (stack.length > 0) {
      stack[0].children.push(current);
    }

    stack.unshift(current);
  }

  return result;
}
