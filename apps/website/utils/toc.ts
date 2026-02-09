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
