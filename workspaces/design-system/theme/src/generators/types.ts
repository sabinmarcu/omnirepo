export interface ThemeGenerator<Input extends unknown = unknown> {
  (input: Input): Record<string, string>
  (input: Input, defaultKey: string): Record<string, string>
  default: string,
}

export type TypeOfThemeGenerator<Generator extends ThemeGenerator> = (
  Generator extends ThemeGenerator<infer Type>
    ? Type
    : unknown
);
export type ThemeContract = (name: string, color: string) => void;
