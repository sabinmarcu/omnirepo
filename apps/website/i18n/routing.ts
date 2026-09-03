import {
  defineRouting,
  type Pathnames,
} from 'next-intl/routing';
import {
  defaultLocale,
  localeDomains,
} from './domains';
import { locales } from './locales';

const pathnames = {
  '/': '/',
  '/personal': '/personal',
  '/personal/cv': '/personal/cv',
  '/snippets': '/snippets',
  '/snippets/[slug]': '/snippets/[slug]',
  '/snippets/[slug]/[subpage]': '/snippets/[slug]/[subpage]',
  '/tags': '/tags',
  '/tags/[...tag]': '/tags/[...tag]',
  '/tools': '/tools',
  '/tools/[slug]': '/tools/[slug]',
} satisfies Pathnames<typeof locales>;

const baseRouting = {
  locales,
  defaultLocale,
  localePrefix: 'as-needed' as const,
  pathnames,
};

export const routing = defineRouting({
  ...baseRouting,
  localeDetection: false,
  domains: localeDomains.length > 0 ? localeDomains : undefined,
});

export const fallbackRouting = defineRouting({
  ...baseRouting,
  localeDetection: true,
});
