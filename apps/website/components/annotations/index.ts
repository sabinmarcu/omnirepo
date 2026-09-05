import { diff } from './Diff';
import { fold } from './Fold';
import { lineNumbers } from './LineNumbers';
import { mark } from './Mark';
import { shellPrompt } from './ShellPrompt';
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

export type { CodeAnnotationHandler } from './types';
