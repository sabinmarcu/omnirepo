import { ShowcaseCard } from '@/components/ShowcaseCard';
import type { Locale } from '@/i18n/locales';
import type { IndexEntry } from '@/models/ContentIndex';
import {
  CVResource,
  getExperienceAnchor,
  getProjectAnchor,
} from '@/models/CVResource';
import { SnippetResource } from '@/models/SnippetResource';
import { ToolResource } from '@/models/ToolResource';
import { DegreeItem } from '../../personal/cv/components/Degree.item';
import { ExperienceItem } from '../../personal/cv/components/Experience.item';
import { PublicationItem } from '../../personal/cv/components/Publications.item';
import { TagResultFallback } from './TagResult.fallback';
import {
  resultMetaStyle,
  richResultStyle,
} from './TagResult.fallback.css';

export namespace TagResult {
  export type Props = {
    entry: IndexEntry,
    locale: Locale,
    matchedVia?: string,
  };
}

function MatchReason({ matchedVia }: Pick<TagResult.Props, 'matchedVia'>) {
  return matchedVia
    ? <p className={resultMetaStyle}>{matchedVia}</p>
    : null;
}

async function ShowcaseResult({
  entry,
  matchedVia,
}: TagResult.Props) {
  if (
    entry.location.pathname !== '/tools/[slug]'
    && entry.location.pathname !== '/snippets/[slug]'
  ) {
    return undefined;
  }

  const resource = entry.type === 'tool'
    ? await ToolResource.fromSlug(entry.location.params.slug, entry.locale)
    : await SnippetResource.fromSlug(entry.location.params.slug, entry.locale);
  if (!resource) {
    return undefined;
  }

  return (
    <li className={richResultStyle}>
      <ShowcaseCard
        resource={resource}
        pathname={entry.type === 'tool' ? '/tools' : '/snippets'}
      />
      <MatchReason matchedVia={matchedVia} />
    </li>
  );
}

async function CvResult({
  entry,
  locale,
  matchedVia,
}: TagResult.Props) {
  if (entry.location.pathname !== '/personal/cv') {
    return undefined;
  }

  const { hash } = entry.location;
  const cv = CVResource.fromDefault(locale);

  if (entry.type === 'project') {
    const project = (await cv.projects).find((item) => (
      getProjectAnchor(item) === hash
    ));
    return project
      ? (
        <li className={richResultStyle}>
          <ExperienceItem
            {...project}
            tagProject
            sourceLink={{
              location: entry.location,
              locale: entry.locale,
            }}
          />
          <MatchReason matchedVia={matchedVia} />
        </li>
      )
      : undefined;
  }

  if (entry.type === 'experience') {
    const experience = (await cv.experiences).find((item) => (
      getExperienceAnchor(item) === hash
    ));
    return experience
      ? (
        <li className={richResultStyle}>
          <ExperienceItem
            {...experience}
            sourceLink={{
              location: entry.location,
              locale: entry.locale,
            }}
          />
          <MatchReason matchedVia={matchedVia} />
        </li>
      )
      : undefined;
  }

  if (entry.type === 'degree') {
    const degree = (await cv.degrees).find((item) => (
      getExperienceAnchor(item) === hash
    ));
    return degree
      ? (
        <li className={richResultStyle}>
          <DegreeItem
            {...degree}
            sourceLink={{
              location: entry.location,
              locale: entry.locale,
            }}
          />
          <MatchReason matchedVia={matchedVia} />
        </li>
      )
      : undefined;
  }

  if (entry.type === 'publication') {
    const publication = (await cv.publications).find((item) => (
      item.publication.title === entry.title
      && item.publication.from === entry.from
    ));
    return publication
      ? (
        <PublicationItem
          source={publication.publication.where}
          publications={[publication]}
          sourceLink={{
            location: entry.location,
            locale: entry.locale,
          }}
        />
      )
      : undefined;
  }

  return undefined;
}

export async function TagResult({
  entry,
  locale,
  matchedVia,
}: TagResult.Props) {
  const props = {
    entry,
    locale,
    matchedVia,
  };
  switch (entry.type) {
    case 'tool':
    case 'snippet': {
      return await ShowcaseResult(props)
        ?? <TagResultFallback entry={entry} matchedVia={matchedVia} />;
    }
    case 'degree':
    case 'experience':
    case 'project':
    case 'publication': {
      return await CvResult(props)
        ?? <TagResultFallback entry={entry} matchedVia={matchedVia} />;
    }
    case 'article':
    case 'skill':
    {
      return <TagResultFallback entry={entry} matchedVia={matchedVia} />;
    }
    default: {
      return <TagResultFallback entry={entry} matchedVia={matchedVia} />;
    }
  }
}
