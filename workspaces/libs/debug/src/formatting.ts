import { subject } from '@sabinmarcu/observable';
import type { Formatter } from './types.js';
import { basicFormatter } from './formatters/basic.js';

export const globalFormatter = subject<Formatter>(basicFormatter);
