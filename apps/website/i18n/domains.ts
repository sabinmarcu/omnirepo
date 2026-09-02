import { z } from 'zod';
import {
  locales,
  type Locale,
} from './locales';

const localeSchema = z.enum(locales);
const domainEntrySchema = z.string().regex(
  /^[^=,\s]+=[^=,\s]+$/,
  'Expected a host=locale pair',
);

const domainMapSchema = z.array(domainEntrySchema)
  .transform((entries) => entries.map((entry) => {
    const [domain, defaultLocale] = entry.split('=', 2);
    return {
      domain,
      defaultLocale,
    };
  }))
  .pipe(z.array(z.object({
    domain: z.string().min(1),
    defaultLocale: localeSchema,
  })));

export const defaultLocale = localeSchema.parse(
  process.env.DEFAULT_LOCALE ?? 'en',
);

export const localeDomains = domainMapSchema.parse(
  process.env.LOCALE_DOMAINS?.split(',').filter(Boolean) ?? [],
).map(({ domain, defaultLocale }) => ({
  domain,
  defaultLocale,
  locales: [...locales],
}));

export const localeDomain = (locale: Locale) => (
  localeDomains.find(({ defaultLocale }) => defaultLocale === locale)
);

export const configuredLocaleDomain = (host: string) => (
  localeDomains.find(({ domain }) => domain === host)
);

export const isConfiguredLocaleDomain = (host: string) => (
  !!configuredLocaleDomain(host)
);

export type LocaleDomain = {
  domain: string;
  defaultLocale: Locale;
  locales: Locale[];
};
