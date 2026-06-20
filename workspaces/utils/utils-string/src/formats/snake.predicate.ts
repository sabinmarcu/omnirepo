export const isSnakeCase = (
  input: string,
) => /^[a-z][a-z0-9_]*$/.test(input);
