export const isKebabCase = (
  input: string,
) => /^[a-z][a-z0-9-]*$/.test(input);
