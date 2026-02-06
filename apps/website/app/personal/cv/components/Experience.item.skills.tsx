import type { Simplify } from '@sabinmarcu/types';
import { SkillPill } from '@/components/SkillPill';
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
          <SkillPill key={it} skill={it} />
        ))}
      </div>
    );
  }
  return null;
}
