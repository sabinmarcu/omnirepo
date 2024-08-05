import { subject } from '@sabinmarcu/observable';
import type { Formatter } from './types';
import { basicFormatter } from './formatters/basic';

export const globalFormatter = subject<Formatter>(basicFormatter);
