import type { AnnotationHandler } from 'codehike/code';

export type CodeAnnotationHandler = AnnotationHandler & {
  languages?: readonly string[],
  enabledByDefault?: (language: string) => boolean,
};
