export const offsetListBy = <T = unknown>(
  list: T[], 
  offset: number
) => {
  const newList = [...list]
  while (offset !== 0) {
    const [move, removeFunc, addFunc] = offset < 0 
      ? [1, 'pop', 'unshift'] as const
      : [-1, 'shift', 'push'] as const;
    newList[addFunc](newList[removeFunc]() as any)
    offset += move;
  }
  return newList;
}

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
