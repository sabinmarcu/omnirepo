import { getTranslations } from 'next-intl/server';
import {
  experienceItemCanonicalLinkStyle,
  experienceItemStyles,
} from './Experience.item.css';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { ExperienceItemDuration } from './Experience.item.duration';
import { grids } from './Experience.item.grid';
import { ExperienceItemLocation } from './Experience.item.location';
import { ExperienceItemSkills } from './Experience.item.skills';
import { ExperienceItemTitle } from './Experience.item.title';
import type {
  ExperienceItemData,
  ExperienceItemMetadata,
} from './Experience.item.types';
import type { ContentLocation } from '@/models/ContentIndex';
import type { Locale } from '@/i18n/locales';

export namespace ExperienceItem {
  export type Props = (
    & ExperienceItemMetadata
    & ExperienceItemData
    & { tagResult?: boolean }
    & { sourceLink?: { location: ContentLocation, locale: Locale } }
  );
}

export async function ExperienceItem({
  metadata,
  tagResult,
  sourceLink,
  ...props
}: ExperienceItem.Props) {
  const {
    children,
  } = 'experience' in props
    ? props.experience
    : props.project;
  const canonical = 'project' in props ? props.project.canonical : undefined;
  const translate = canonical ? await getTranslations('cv') : undefined;
  const summary = (
    <>
      <ExperienceItemTitle {...props} metadata={metadata} sourceLink={sourceLink} />
      {(metadata && metadata.location) || ((props as any).from)
        ? (
          <div {...grids.selector('metadata')}>
            <ExperienceItemDuration {...props} />
            <ExperienceItemLocation metadata={metadata} />
          </div>
        )
        : null}
    </>
  );
  return (
    <section className={experienceItemStyles}>
      {tagResult
        ? (
          <div {...grids.selector('summary')}>
            {summary}
          </div>
        )
        : summary}
      {children || canonical
        ? (
          <div {...grids.selector('content')}>
            {children}
            {canonical
              ? (
                <p className={experienceItemCanonicalLinkStyle}>
                  <ThemedLink
                    href={{
                      pathname: '/projects/[slug]',
                      params: { slug: canonical },
                    }}
                  >
                    {translate?.('fullWriteUp')}
                  </ThemedLink>
                </p>
              )
              : null}
          </div>
        )
        : null}
      <ExperienceItemSkills {...props} />
    </section>
  );
}

ExperienceItem.className = experienceItemStyles;
