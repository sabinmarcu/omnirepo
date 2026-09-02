'use client';

import {
  useSyncExternalStore,
} from 'react';
import {
  createTranslator,
  useLocale,
} from 'next-intl';
import {
  isLocale,
  type Locale,
} from './locales';
import { Link } from './navigation';
import en from './messages/en';
import ro from './messages/ro';
import {
  localeSuggestionBannerActionStyle,
  localeSuggestionBannerStyle,
} from './LocaleSuggestionBanner.css';

export namespace LocaleSuggestionBanner {
  export type Props = {
    pathname: string,
    availableLocales: readonly Locale[],
  };
}

const subscribe = () => () => {};
const messages = {
  en,
  ro,
};

function getSuggestedLocale(
  locale: Locale,
  availableLocales: readonly Locale[],
  storageKey: string,
) {
  const browserLocale = globalThis.navigator?.language
    .split('-', 1)[0]
    .toLowerCase();
  if (
    !isLocale(browserLocale)
    || browserLocale === locale
    || !availableLocales.includes(browserLocale)
    || localStorage.getItem(storageKey) === browserLocale
  ) {
    return undefined;
  }

  return browserLocale;
}

export function LocaleSuggestionBanner({
  pathname,
  availableLocales,
}: LocaleSuggestionBanner.Props) {
  const locale = useLocale() as Locale;
  const storageKey = `locale-suggestion:${pathname}`;
  const suggestedLocale = useSyncExternalStore(
    subscribe,
    () => getSuggestedLocale(locale, availableLocales, storageKey),
    () => undefined,
  );

  if (!suggestedLocale) {
    return null;
  }

  const translate = createTranslator({
    locale: suggestedLocale,
    messages: messages[suggestedLocale],
    namespace: 'languageSuggestion',
  });
  const translateSettings = createTranslator({
    locale: suggestedLocale,
    messages: messages[suggestedLocale],
    namespace: 'settings',
  });
  const suggestedLocaleLabel = translateSettings(`locale.${suggestedLocale}`);

  const dismiss = () => {
    localStorage.setItem(storageKey, suggestedLocale);
    location.reload();
  };

  return (
    <aside className={localeSuggestionBannerStyle} aria-live="polite">
      <span>{translate('available', { locale: suggestedLocaleLabel })}</span>
      <Link
        className={localeSuggestionBannerActionStyle}
        href={pathname as any}
        locale={suggestedLocale}
      >
        {translate('continue', { locale: suggestedLocaleLabel })}
      </Link>
      <button type="button" className={localeSuggestionBannerActionStyle} onClick={dismiss}>
        {translate('dismiss')}
      </button>
    </aside>
  );
}
