import type { overview } from '@/data/personal/cv';
import { LanguageItem } from './Language.item';

export namespace LanguageList {
  export type Props = {
    list: typeof overview.data.languages
  };
}

export function LanguageList({ list }: LanguageList.Props) {
  return (
    <div>
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
