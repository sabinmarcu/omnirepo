import { diff } from './Diff';
import { fold } from './Fold';
import {
  lineNumbers,
  noLineNumbersAnnotation,
} from './LineNumbers';
import { mark } from './Mark';
import {
  noShellPromptAnnotation,
  shellPrompt,
} from './ShellPrompt';
import type { CodeAnnotationHandler } from './types';
import { wordWrap } from './WordWrap';

export const blockAnnotations = [
  mark,
  diff,
  lineNumbers,
  shellPrompt,
  wordWrap,
] as const satisfies readonly CodeAnnotationHandler[];

export const inlineAnnotations = [
  fold,
] as const satisfies readonly CodeAnnotationHandler[];

export {
  noLineNumbersAnnotation,
  noShellPromptAnnotation,
};

export type { CodeAnnotationHandler } from './types';
