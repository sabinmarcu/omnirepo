import type { ReactNode } from 'react';
import type { families } from '@sabinmarcu/website-theme';
import { Card } from './Card';
import { ThemedLink } from './primitives/ThemedLink';
import {
  contentCardHeaderStyle,
  contentCardKindStyle,
  contentCardMetaStyle,
  contentCardSectionStyle,
  contentCardTagsListStyle,
  contentCardTitleStyle,
} from './ContentCard.css';

export namespace ContentCard {
  export type Props = {
    className?: string,
    title: ReactNode,
    kind?: ReactNode,
    kindTheme?: typeof families[number],
    metadata?: ReactNode,
    badges?: ReactNode,
    summary?: ReactNode,
    tags?: ReactNode,
  };
}

export function ContentCard({
  className,
  title,
  kind,
  kindTheme,
  metadata,
  badges,
  summary,
  tags,
}: ContentCard.Props) {
  return (
    <Card className={className}>
      <div
        className={contentCardHeaderStyle}
        {...{ [ThemedLink.undecoratedDataAttribute]: true }}
      >
        <Card.Title className={contentCardTitleStyle}>
          {title}
          {kind != null && (
            <span className={contentCardKindStyle} data-theme-family={kindTheme}>{kind}</span>
          )}
        </Card.Title>
        {metadata != null && <div className={contentCardSectionStyle}>{metadata}</div>}
        {badges != null && <div className={contentCardSectionStyle}>{badges}</div>}
      </div>
      {summary ? <div className={contentCardMetaStyle}>{summary}</div> : null}
      {tags != null && <div className={contentCardTagsListStyle}>{tags}</div>}
    </Card>
  );
}
