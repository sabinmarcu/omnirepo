import { ThemedLink } from '@/components/primitives/ThemedLink';
import {
  tagToPathSegments,
  type TagId,
} from '@/models/Tag';
import {
  tagPillCountStyle,
  tagPillStyle,
} from './TagPill.css';

export namespace TagPill {
  export type Props = {
    id: TagId,
    label: string,
    count?: number,
  };
}

export function TagPill({
  id,
  label,
  count,
}: TagPill.Props) {
  return (
    <ThemedLink
      decoration="none"
      className={tagPillStyle}
      href={{
        pathname: '/tags/[...tag]',
        params: { tag: tagToPathSegments(id) },
      }}
    >
      <span>{label}</span>
      {count === undefined
        ? null
        : <span className={tagPillCountStyle}>{count}</span>}
    </ThemedLink>
  );
}
