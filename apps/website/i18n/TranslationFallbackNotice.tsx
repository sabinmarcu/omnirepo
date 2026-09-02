import { getTranslations } from 'next-intl/server';
import type { Resource } from '@/models/Resource';
import { translationFallbackNoticeStyle } from './TranslationFallbackNotice.css';

export namespace TranslationFallbackNotice {
  export type Props = {
    locale: string,
    resource: Resource,
  };
}

export async function TranslationFallbackNotice({
  locale,
  resource,
}: TranslationFallbackNotice.Props) {
  if (!await resource.isFallbackFor(locale)) {
    return null;
  }

  const translate = await getTranslations('translationFallback');
  return (
    <aside className={translationFallbackNoticeStyle}>
      {translate('notice')}
    </aside>
  );
}
