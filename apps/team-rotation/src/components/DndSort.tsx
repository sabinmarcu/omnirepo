import type { PrimitiveAtom } from 'jotai';
import {
  forwardRef,
  type ComponentProps,
  type PropsWithChildren,
} from 'react';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { styled } from '@mui/material';
import {
  DragHandle,
  DragIndicator,
} from '@mui/icons-material';
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

export const DndSortDragHandleOverlay = styled('div')({
  position: 'absolute',
  inset: 0,
  '& ~ *': {
    position: 'relative',
  },
});

export const DndSortDragHandleRaw = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const DndSortDragHandleVerticalRaw = styled(DndSortDragHandleRaw)({
  padding: '1rem',
  background: 'rgba(from black r g b / 0.1)',
});

export const DndSortDragHandleHorizontalRaw = styled(DndSortDragHandleRaw)({
  paddingBlock: '1rem',
  paddingInline: '1rem',
  '&:first-child': {
    paddingInlineStart: 0,
  },
  '&:last-child': {
    paddingInlineEnd: 0,
  },
});

export const DndSortDragHandleVertical = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof DndSortDragHandleRaw>
>((properties) => (
  <DndSortDragHandleVerticalRaw {...properties}>
    <DragIndicator />
  </DndSortDragHandleVerticalRaw>
));

export const DndSortDragHandleHorizontal = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof DndSortDragHandleRaw>
>((properties) => (
  <DndSortDragHandleHorizontalRaw {...properties}>
    <DragHandle />
  </DndSortDragHandleHorizontalRaw>
));