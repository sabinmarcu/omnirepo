import type {
  createGlobalTheme,
  createGlobalThemeContract,
} from '@vanilla-extract/css';

export type ThemeUpdateFunction = typeof createGlobalTheme;
export type UpdaterFunction<Input extends unknown = unknown> = (
  input: Input,
  selector?: string,
  updateFunction?: ThemeUpdateFunction,
  family?: string,
) => void;

export type ContractMeta = {
  standalone?: boolean,
  raw?: boolean
};
export type ContractWithMeta<
  T extends ReturnType<typeof createGlobalThemeContract>,
> = (
  & T
  & ContractMeta
);
