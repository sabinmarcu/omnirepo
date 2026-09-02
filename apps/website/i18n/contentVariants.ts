import { existsSync } from 'node:fs';
import path from 'node:path';
import { defaultLocale } from './domains';
import {
  locales,
  type Locale,
} from './locales';

export function siblingContentLocales(contentPath: string): Locale[] {
  return locales.filter((locale) => {
    const localizedPath = locale === defaultLocale
      ? contentPath
      : contentPath.replace(/\.mdx$/, `.${locale}.mdx`);
    return existsSync(path.resolve(process.cwd(), localizedPath));
  });
}
