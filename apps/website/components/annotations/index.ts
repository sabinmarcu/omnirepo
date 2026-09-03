import { shellPrompt } from './ShellPrompt';
import type { CodeAnnotationHandler } from './types';

export const blockAnnotations = [shellPrompt] as const satisfies readonly CodeAnnotationHandler[];

export const inlineAnnotations = [] as const satisfies readonly CodeAnnotationHandler[];

export type { CodeAnnotationHandler } from './types';
