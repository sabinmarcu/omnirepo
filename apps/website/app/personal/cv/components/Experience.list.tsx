import { ExperienceItem } from './Experience.item';
import { experienceListStyles } from './Experience.list.css';
import './Experience.list.mobile.css';

export namespace ExperienceList {
  export type Props = {
    list: ExperienceItem.Props[],
  };
}

function computeKey(item: ExperienceItem.Props) {
  const pieces: string[] = [];
  if ('metadata' in item) {
    pieces.push(item.metadata!.company);
  }

  if ('experience' in item) {
    pieces.push(item.experience.title);
  } else {
    pieces.push(item.project.title);
  }

  return pieces.join('-');
}

export function ExperienceList({ list }: ExperienceList.Props) {
  return (
    <div className={experienceListStyles}>
      {list.map((item) => (
        <ExperienceItem
          key={computeKey(item)}
          {...item}
        />
      ))}
    </div>
  );
}

ExperienceList.className = experienceListStyles;
