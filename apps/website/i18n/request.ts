import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './domains';
import { isLocale } from './locales';
import en from './messages/en';
import ro from './messages/ro';

const messages = {
  en,
  ro,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = isLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
