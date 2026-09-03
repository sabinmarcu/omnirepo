import { ShowcaseCard } from '@/components/ShowcaseCard';
import { ProjectCard } from '@/components/ProjectCard';
import type { Locale } from '@/i18n/locales';
import type { IndexEntry } from '@/models/ContentIndex';
import {
  CVResource,
  getExperienceAnchor,
  getProjectAnchor,
} from '@/models/CVResource';
import { SnippetResource } from '@/models/SnippetResource';
import { ProjectResource } from '@/models/ProjectResource';
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

async function ProjectResult({ entry, matchedVia }: TagResult.Props) {
  if (entry.location.pathname !== '/projects/[slug]' || entry.type !== 'project') {
    return undefined;
  }
  const resource = await ProjectResource.fromSlug(entry.location.params.slug, entry.locale);
  return resource
    ? (
      <li className={richResultStyle}>
        <ProjectCard resource={resource} pathname="/projects" />
        <MatchReason matchedVia={matchedVia} />
      </li>
    )
    : undefined;
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

  if (entry.type === 'cv-project') {
    const project = (await cv.projects).find((item) => (
      getProjectAnchor(item) === hash
    ));
    return project
      ? (
        <li className={richResultStyle}>
          <ExperienceItem
            {...project}
            tagResult
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
            tagResult
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
    case 'project': {
      return await ProjectResult(props)
        ?? <TagResultFallback entry={entry} matchedVia={matchedVia} />;
    }
    case 'degree':
    case 'experience':
    case 'cv-project':
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
