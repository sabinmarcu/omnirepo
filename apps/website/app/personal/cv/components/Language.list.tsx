import type { CVOverview } from '@/models/CV.types';
import { LanguageItem } from './Language.item';
import { languageListStyles } from './Language.list.css';

export namespace LanguageList {
  export type Props = {
    list: CVOverview['languages']
  };
}

export function LanguageList({ list }: LanguageList.Props) {
  return (
    <div className={languageListStyles}>
      {Object.entries(list).map(([key, value]) => (
        <LanguageItem
          key={key}
          language={key}
          level={value}
        />
      ))}
    </div>
  );
}
