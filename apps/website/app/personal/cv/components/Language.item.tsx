import { Grading } from '@/components/Grading';
import type { CVOverview } from '@/models/CV.types';
import { languageItemStyles } from './Language.item.css';

type CVLanguageMap = CVOverview['languages'];

export namespace LanguageItem {
  export type Props = {
    language: keyof CVLanguageMap,
    level: CVLanguageMap[keyof CVLanguageMap],
  };
}

export function LanguageItem({ language, level }: LanguageItem.Props) {
  return (
    <div className={languageItemStyles}>
      <span>{language}</span>

      <span><Grading max={5} value={level} /></span>
    </div>
  );
}
