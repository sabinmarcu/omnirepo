import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { configuredLocaleDomain } from '@/i18n/domains';
import { SnippetResource } from '@/models/SnippetResource';
import { ToolResource } from '@/models/ToolResource';

const staticPathnames = [
  '/',
  '/personal',
  '/personal/cv',
  '/snippets',
  '/tools',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host')?.split(':', 1)[0] ?? '';
  const domain = configuredLocaleDomain(host);
  if (!domain) {
    return [];
  }

  const origin = `https://${domain.domain}`;
  const [snippets, tools] = await Promise.all([
    SnippetResource.getLocalizedList(domain.defaultLocale),
    ToolResource.getLocalizedList(domain.defaultLocale),
  ]);
  const dynamicPathnames = await Promise.all([
    ...snippets.map(async (snippet) => `/snippets/${await snippet.slug}`),
    ...tools.map(async (tool) => `/tools/${await tool.slug}`),
  ]);

  return [
    ...staticPathnames,
    ...dynamicPathnames,
  ].map((pathname) => ({ url: new URL(pathname, origin).href }));
}
