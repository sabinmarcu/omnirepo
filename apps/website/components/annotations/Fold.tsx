import { FoldContent } from './Fold.client';
import type { CodeAnnotationHandler } from './types';

export const fold: CodeAnnotationHandler = {
  name: 'fold',
  onlyIfAnnotated: true,
  Inline: ({ children }) => (
    <FoldContent>{children}</FoldContent>
  ),
};
