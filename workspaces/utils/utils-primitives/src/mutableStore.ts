export type MutableStore<T> = {
  value: T | undefined
};

export const mutableStore = <T>(initialValue?: T) => ({
  value: initialValue,
} satisfies MutableStore<T>);
