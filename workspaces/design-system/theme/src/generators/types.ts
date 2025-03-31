export type ThemeGenerator<Input extends unknown = unknown> = (
  input: Input
) => Record<string, string>;
export type TypeOfThemeGenerator<Generator extends ThemeGenerator> = (
  Generator extends ThemeGenerator<infer Type>
    ? Type
    : unknown
);
export type ThemeContract = (name: string, color: string) => void;
