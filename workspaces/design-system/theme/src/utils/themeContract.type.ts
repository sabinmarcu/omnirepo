import type {
  Simplify,
  UnionToIntersection,
  UnionToTuple,
} from '@sabinmarcu/types';
import type { rawContract } from './rawContract.js';
import type { variantContract } from './variantContract.js';

export type ContractType = (
  | ReturnType<typeof variantContract>
  | ReturnType<typeof rawContract>
);

export type ThemeStructureType = {
  [key in string]: ContractType | ThemeStructureType
};

export type ExtractContractsFromThemeStructure<
  Theme extends ThemeStructureType,
> = UnionToTuple<{
  [Key in keyof Theme]: (
    Theme[Key] extends ThemeStructureType
      ? ExtractContractsFromThemeStructure<Theme[Key]>[number]
      : Theme[Key]
  )
}[keyof Theme]>;

export type MapThemeToContract<
  Theme extends ThemeStructureType,
> = Simplify<{
  [Key in keyof Theme]: Theme[Key] extends ContractType
    ? Theme[Key][0]
    : Theme[Key] extends ThemeStructureType
      ? MapThemeToContract<Theme[Key]>
      : never
}>;

export type MapThemeToUpdateInput<
  Theme extends ThemeStructureType,
> = Simplify<UnionToIntersection<{
  [Key in keyof Theme]: Theme[Key] extends ContractType
    ? { [InputKey in Key]: Parameters<Theme[Key][1]>[0] }
    : Theme[Key] extends ThemeStructureType
      ? MapThemeToUpdateInput<Theme[Key]>
      : unknown
}[keyof Theme]>>;
