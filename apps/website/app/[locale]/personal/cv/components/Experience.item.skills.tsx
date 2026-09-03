import type { Simplify } from '@sabinmarcu/types';
import { TagPill } from '@/components/TagPill';
import { resolveTag } from '@/models/TagRegistry';
import type {
  ExperienceItemData,
} from './Experience.item.types';
import { experienceItemSkillsStyle } from './Experience.item.skills.css';
import { grids } from './Experience.item.grid';

export namespace ExperienceItemSkills {
  export type Props = Simplify<(
    & ExperienceItemData
  )>;
}
export function ExperienceItemSkills(props: ExperienceItemSkills.Props) {
  if ('project' in props) {
    const { project: { skill } } = props;
    return (
      <div
        className={experienceItemSkillsStyle}
        {...grids.selector('skills')}
      >
        {skill.map((it) => (
          <TagPill key={it} id={resolveTag('skills', it)} label={it} />
        ))}
      </div>
    );
  }
  return null;
}
