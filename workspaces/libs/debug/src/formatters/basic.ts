import type {
  Formatter,
  FormatterFunction,
} from '../types.js';

export const basicFormatterFunction: FormatterFunction = (
  __,
  ...messages
) => messages;

export const basicFormatter: Formatter = () => basicFormatterFunction;
