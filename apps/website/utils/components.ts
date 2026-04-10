export function extendComponent<
  T extends unknown,
  const Extras extends Record<string, unknown>,
>(
  component: T,
  extras: Extras,
) {
  for (const [key, value] of Object.entries(extras)) {
    // eslint-disable-next-line no-param-reassign
    (component as any)[key] = value;
  }

  return component as T & Extras;
}
