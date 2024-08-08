import { useSortable } from '@dnd-kit/sortable';
import type { PrimitiveAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { CSS } from '@dnd-kit/utilities';

export const useDndSortable = <T extends { id: string }>(atom: PrimitiveAtom<T>) => {
  const { id } = useAtomValue(atom);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return {
    ...attributes,
    ...listeners,
    ref: setNodeRef,
    style,
  } as const;
};
