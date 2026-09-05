import { InnerLine } from 'codehike/code';
import { shellPromptLineStyle } from './ShellPrompt.css';
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

export const noShellPromptAnnotation = 'no-shell-prompt';

export const shellPrompt: CodeAnnotationHandler = {
  name: 'shell-prompt',
  onlyIfAnnotated: true,
  enabledByDefault: (language) => shellLanguages.has(language),
  Line: (props) => (
    <InnerLine merge={props} className={shellPromptLineStyle} />
  ),
};
