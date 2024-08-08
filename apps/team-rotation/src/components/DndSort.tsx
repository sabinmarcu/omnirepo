import type { PrimitiveAtom } from 'jotai';
import type { PropsWithChildren } from 'react';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { styled } from '@mui/material';
import { useDndSort } from '../hooks/useDndSort.ts';

export type DndSortProperties<T extends { id: string } = { id:string }> = PropsWithChildren<{
  atom: PrimitiveAtom<T[]>
}>;

export function DndSort<T extends { id: string }>({
  children, atom,
}: DndSortProperties<T>) {
  const {
    sensors, onDragEnd, items,
  } = useDndSort(atom);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export const DndSortDragHandle = styled('div')({
  position: 'absolute',
  inset: 0,
  '& ~ *': {
    position: 'relative',
  },
});