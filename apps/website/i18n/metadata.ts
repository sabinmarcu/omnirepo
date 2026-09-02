import type { Metadata } from 'next';
import { headers } from 'next/headers';
import {
  isConfiguredLocaleDomain,
  localeDomain,

  defaultLocale,
} from './domains';
import {
  isLocale,
  type Locale,
} from './locales';

export async function canonicalMetadata(
  locale: string,
  pathname: string,
  localizedPathnames: Partial<Record<Locale, string>> = {},
): Promise<Metadata> {
  const host = (await headers()).get('host')?.split(':', 1)[0] ?? '';
  const defaultDomain = localeDomain(defaultLocale);
  if (
    !isLocale(locale)
    || !isConfiguredLocaleDomain(host)
    || !localeDomain(locale)
    || !defaultDomain
  ) {
    return {};
  }

  const languages = Object.fromEntries(
    Object.entries(localizedPathnames).flatMap(([translatedLocale, localizedPathname]) => {
      const domain = localeDomain(translatedLocale as Locale);
      return domain
        ? [[translatedLocale, `https://${domain.domain}${localizedPathname}`]]
        : [];
    }),
  );

  if (localizedPathnames[defaultLocale]) {
    languages['x-default'] = `https://${defaultDomain.domain}${localizedPathnames[defaultLocale]}`;
  }

  return {
    alternates: {
      canonical: pathname,
      ...(Object.keys(languages).length > 0 ? { languages } : {}),
    },
  };
}
