import type { BlockAnnotation } from 'codehike/code';
import { InnerLine } from 'codehike/code';
import {
  diffLineStyle,
  diffMarkerStyle,
} from './Diff.css';
import type { CodeAnnotationHandler } from './types';

const additionColor = '#3fb950';
const deletionColor = '#f85149';

export const diff: CodeAnnotationHandler = {
  name: 'diff',
  onlyIfAnnotated: true,
  transform: (annotation: BlockAnnotation) => [
    annotation,
    {
      ...annotation,
      name: 'mark',
      query: annotation.query === '-' ? deletionColor : additionColor,
    },
  ],
  Line: ({
    annotation,
    ...props
  }) => (
    <div className={diffLineStyle}>
      <span className={diffMarkerStyle} aria-hidden="true">
        {annotation?.query}
      </span>
      <InnerLine merge={props} />
    </div>
  ),
};
