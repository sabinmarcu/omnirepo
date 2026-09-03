import { InnerLine } from 'codehike/code';
import { shellPromptLineStyle } from './ShellPrompt.css';
import type { CodeAnnotationHandler } from './types';

export const shellPrompt: CodeAnnotationHandler = {
  name: 'shell-prompt',
  languages: ['sh'],
  onlyIfAnnotated: false,
  Line: (props) => (
    <InnerLine merge={props} className={shellPromptLineStyle} />
  ),
};
