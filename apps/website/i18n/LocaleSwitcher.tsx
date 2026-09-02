'use client';

import type { ChangeEvent } from 'react';
import {
  useLocale,
  useTranslations,
} from 'next-intl';
import { useParams } from 'next/navigation';
import {
  type Locale,
  locales,
} from './locales';
import {
  usePathname,
  useRouter,
} from './navigation';
import { localeSwitcherStyle } from './LocaleSwitcher.css';

export namespace LocaleSwitcher {
  export type Props = {
    localeParams?: Partial<Record<Locale, Record<string, string>>>,
  };
}

export function LocaleSwitcher({ localeParams }: LocaleSwitcher.Props) {
  const locale = useLocale() as Locale;
  const translate = useTranslations('settings');
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const {
    locale: _,
    ...routeParams
  } = params;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    router.replace(
      {
        pathname,
        params: {
          ...routeParams,
          ...localeParams?.[nextLocale],
        },
      } as any,
      { locale: nextLocale },
    );
  };

  return (
    <select
      aria-label={translate('language')}
      className={localeSwitcherStyle}
      value={locale}
      onChange={handleChange}
    >
      {locales.map((availableLocale) => (
        <option key={availableLocale} value={availableLocale}>
          {translate(`locale.${availableLocale}`)}
        </option>
      ))}
    </select>
  );
}
