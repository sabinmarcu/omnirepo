import {
  InnerLine,
  InnerPre,
  InnerToken,
} from 'codehike/code';
import {
  wrappedLineStyle,
  wrappedPreStyle,
  wrappedTokenStyle,
} from './WordWrap.css';
import type { CodeAnnotationHandler } from './types';

export const wordWrap: CodeAnnotationHandler = {
  name: 'word-wrap',
  onlyIfAnnotated: true,
  Pre: (props) => (
    <InnerPre merge={props} className={wrappedPreStyle} />
  ),
  Line: (props) => {
    const {
      indentation,
      children,
    } = props;
    return (
      <InnerLine merge={props} className={wrappedLineStyle}>
        <div
          style={{
            marginInlineStart: `${indentation}ch`,
            textIndent: `${-indentation}ch`,
          }}
        >
          {children}
        </div>
      </InnerLine>
    );
  },
  Token: (props) => (
    <InnerToken merge={props} className={wrappedTokenStyle} />
  ),
};
