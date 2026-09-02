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
  '/tools': '/tools',
  '/tools/[slug]': '/tools/[slug]',
} satisfies Pathnames<typeof locales>;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  domains: localeDomains.length > 0 ? localeDomains : undefined,
  pathnames,
});
