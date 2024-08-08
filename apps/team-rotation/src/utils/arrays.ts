import type { DragEndEvent } from '@dnd-kit/core';

export const offsetListBy = <T = unknown>(
  list: T[],
  offsetInput: number,
) => {
  let offset = offsetInput;
  const newList = [...list];
  while (offset !== 0) {
    const [
      move,
      removeFunction,
      addFunction,
    ] = offset < 0
      ? [
        1,
        'pop',
        'unshift',
      ] as const
      : [
        -1,
        'shift',
        'push',
      ] as const;
    newList[addFunction](newList[removeFunction]() as any);
    offset += move;
  }
  return newList;
};

export const selectMemberForOffset = (
  weekNumber: number,
  total: number,
  offset: number,
) => {
  const today = weekNumber % total;
  if (offset === 0) {
    return today;
  }
  const diff = today + offset;
  if (diff < 0) {
    return (total - Math.abs(diff)) % total;
  }
  return diff % total;
};

export const swapElementsInArray = <T extends { id: string }>(
  list: T[],
  event: DragEndEvent,
) => {
  const {
    active,
    over,
  } = event;
  if (!active || !over || active.id === over.id) {
    return list;
  }
  const oldIndex = list.findIndex(({ id }) => id === active.id);
  const newIndex = list.findIndex(({ id }) => id === over.id);
  const newList = [...list];
  const [oldItem] = newList.splice(oldIndex, 1);
  newList.splice(newIndex, 0, oldItem);
  return newList;
};
