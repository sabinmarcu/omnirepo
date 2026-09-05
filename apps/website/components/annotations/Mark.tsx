import { InnerLine } from 'codehike/code';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  markColor,
  markedInlineStyle,
  markedLineStyle,
} from './Mark.css';
import type { CodeAnnotationHandler } from './types';

function colorStyle(query: string) {
  return query
    ? assignInlineVars({ [markColor]: query })
    : undefined;
}

export const mark: CodeAnnotationHandler = {
  name: 'mark',
  onlyIfAnnotated: true,
  Line: ({
    annotation,
    ...props
  }) => (
    <div
      className={annotation ? markedLineStyle : undefined}
      style={annotation ? colorStyle(annotation.query) : undefined}
    >
      <InnerLine merge={props} />
    </div>
  ),
  Inline: ({
    annotation,
    children,
  }) => (
    <span
      className={markedInlineStyle}
      style={colorStyle(annotation.query)}
    >
      {children}
    </span>
  ),
};
