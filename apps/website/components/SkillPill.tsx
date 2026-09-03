import { Link } from '@/i18n/navigation';
import {
  normalizeTagSegment,
  tagToPathSegments,
} from '@/models/Tag';
import { resolveTag } from '@/models/TagRegistry';
import { skillPillStyle } from './SkillPill.css';

export namespace SkillPill {
  export type Props = {
    skill: string
  };
}
export function SkillPill({ skill }: SkillPill.Props) {
  if (!normalizeTagSegment(skill)) {
    return <span className={skillPillStyle}>{skill}</span>;
  }

  const id = resolveTag('skills', skill);
  return (
    <Link
      className={skillPillStyle}
      href={{
        pathname: '/tags/[...tag]',
        params: { tag: tagToPathSegments(id) },
      }}
    >
      {skill}
    </Link>
  );
}
