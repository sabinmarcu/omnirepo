import path from 'node:path';
import { defaultLocale } from '@/i18n/domains';
import { isLocale } from '@/i18n/locales';

export function explainFile(filepath: string) {
  const filename = filepath.split('/').at(-1)!;
  const dirname = path.dirname(filepath);
  const extension = filename.split('.').at(-1);
  const name = filename.replace(new RegExp(`\.${extension}$`), '');
  const parts = name.split('.');
  const locale = parts.at(-1);
  const hasLocaleSuffix = isLocale(locale);

  return {
    dirname,
    filepath,
    filename,
    extension,
    id: (hasLocaleSuffix ? parts.slice(0, -1) : parts).join('.'),
    locale: hasLocaleSuffix ? locale : defaultLocale,
  } as const;
}
