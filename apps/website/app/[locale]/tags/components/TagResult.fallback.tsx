import { Link } from '@/i18n/navigation';
import type { IndexEntry } from '@/models/ContentIndex';
import {
  resultMetaStyle,
  resultStyle,
  resultTitleStyle,
} from './TagResult.fallback.css';

export namespace TagResultFallback {
  export type Props = {
    entry: IndexEntry,
    matchedVia?: string,
  };
}

export function TagResultFallback({
  entry,
  matchedVia,
}: TagResultFallback.Props) {
  const period = entry.from
    ? [entry.from, entry.to].filter(Boolean).join(' - ')
    : undefined;

  return (
    <li className={resultStyle}>
      <Link
        className={resultTitleStyle}
        href={entry.location}
        locale={entry.locale}
      >
        <strong>{entry.title}</strong>
      </Link>
      {entry.excerpt ? <p>{entry.excerpt}</p> : null}
      {period || matchedVia
        ? (
          <div className={resultMetaStyle}>
            {period ? <span>{period}</span> : null}
            {matchedVia ? <span>{matchedVia}</span> : null}
          </div>
        )
        : null}
    </li>
  );
}
