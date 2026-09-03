import { Icon } from '@/components/Icon';
import { ThemedLink } from '@/components/primitives/ThemedLink';
import { infoTagTypes } from './InfoTag.types';
import { infoTagStyles } from './InfoTag.tag.css';

export const supportedTypes = infoTagTypes.map(
  ({ name }) => name,
) as typeof infoTagTypes[number]['name'][];

export namespace InfoTag {
  export type Props = {
    type: typeof supportedTypes[number],
    value: string
  };
}

export function InfoTag({
  type,
  value,
}: InfoTag.Props) {
  const processor = infoTagTypes.find(({ name }) => name === type)!;
  const link = 'link' in processor ? processor.link(value) : undefined;
  const text = 'text' in processor ? processor.text(value) : value;

  const inner = (
    <>
      <Icon icon={processor.icon} data-info-icon />
      <span data-info-text>{text}</span>
    </>
  );

  if (link) {
    return <ThemedLink
      variant="secondary"
      target="_blank"
      href={link as any}
      className={infoTagStyles}
    >{inner}</ThemedLink>;
  }

  return <p className={infoTagStyles}>{inner}</p>;
}
