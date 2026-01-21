import { skillPillStyle } from './SkillPill.css';

export namespace SkillPill {
  export type Props = {
    skill: string
  };
}
export function SkillPill({ skill }: SkillPill.Props) {
  return <span className={skillPillStyle}>{skill}</span>;
}