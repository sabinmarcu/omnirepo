import { InnerLine } from 'codehike/code';
import {
  lineNumberStyle,
  numberedLineStyle,
} from './LineNumbers.css';
import type { CodeAnnotationHandler } from './types';

const shellLanguages = new Set([
  'bash',
  'bat',
  'batch',
  'cmd',
  'fish',
  'powershell',
  'ps1',
  'sh',
  'shell',
  'shellscript',
  'zsh',
]);

export const noLineNumbersAnnotation = 'no-line-numbers';

export const lineNumbers: CodeAnnotationHandler = {
  name: 'line-numbers',
  onlyIfAnnotated: true,
  enabledByDefault: (language) => !shellLanguages.has(language),
  Line: (props) => (
    <div className={numberedLineStyle}>
      <span className={lineNumberStyle} aria-hidden="true">
        {props.lineNumber}
      </span>
      <InnerLine merge={props} />
    </div>
  ),
};
