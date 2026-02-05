import { ExperienceItem } from './Experience.item';

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
    <>
      {list.map((item) => (
        <ExperienceItem
          key={computeKey(item)}
          {...item}
        />
      ))}
    </>
  );
}

