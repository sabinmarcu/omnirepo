import {
  isObservable,
} from '@sabinmarcu/observable';
import { simpleConfig } from './config.list';
import { complexConfig } from './config.map';
import type { ConfigFunction } from './types';

export const config: ConfigFunction = (...input: any[]) => {
  if (Array.isArray(input) && input.length > 1) {
    return simpleConfig(...input);
  }
  if (isObservable(input[0])) {
    return simpleConfig(...input);
  }
  return complexConfig(input[0]);
};
