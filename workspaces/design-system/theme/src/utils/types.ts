import type { createGlobalTheme } from '@vanilla-extract/css';

export type ThemeUpdateFunction = typeof createGlobalTheme;
export type UpdaterFunction<Input extends unknown = unknown> = (
  input: Input,
  selector?: string,
  updateFunction?: ThemeUpdateFunction,
) => void;
