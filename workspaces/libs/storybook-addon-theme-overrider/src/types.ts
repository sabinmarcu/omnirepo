import type { PartialDeep } from '@sabinmarcu/types';
import type { defaultOptions } from './defaults.js';

export type DefaultOptions = typeof defaultOptions;
export type IOptions = {
  [Key in string]: undefined | string | number | IOptions
};
export type MapOptionsToString<T extends IOptions> = {
  [Key in keyof T]: T[Key] extends IOptions
    ? MapOptionsToString<T[Key]>
    : string
};

export type Options = MapOptionsToString<DefaultOptions>;
export type InputOptions = PartialDeep<Options>;
