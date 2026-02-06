import { Grading } from '@/components/Grading';
import type { overview } from '@/data/personal/cv.overview';
import { languageItemStyles } from './Language.item.css';

export namespace LanguageItem {
  export type Props = {
    language: keyof typeof overview.data.languages,
    level: typeof overview.data.languages[keyof typeof overview.data.languages],
  };
}

export function LanguageItem({ language, level }: LanguageItem.Props) {
  return (
    <p className={languageItemStyles}>
      <span>{language}</span>

      <span><Grading max={5} value={level} /></span>
    </p>
  );
}
