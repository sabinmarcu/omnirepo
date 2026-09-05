import type { RawCode } from 'codehike/code';
import {
  highlight,
  Pre,
} from 'codehike/code';
import type { ComponentProps } from 'react';
import { withStyles } from '@/hocs/withStyles';
import { CopyButton } from './CopyButton';
import {
  blockAnnotations,
  inlineAnnotations,
  noLineNumbersAnnotation,
  noShellPromptAnnotation,
} from './annotations';
import { lineNumbers } from './annotations/LineNumbers';
import { shellPrompt } from './annotations/ShellPrompt';
import {
  codeStyles,
} from './Code.css';
import {
  codeContentStyle,
  codeLanguageStyle,
  codeOverlayItemStyle,
  codeOverlayRailStyle,
} from './CodeOverlay.css';
import {
  codeToolbarStyle,
  codeTabsListStyle,
  codeTabsStyle,
  codeTabsTriggerStyle,
} from './CodeTabs.css';
import { cls } from '@/utils/cls';

const noopAnnotationPattern = /^(\s*(?:\/\/|#|<!--)\s*)!noop\s+/gm;
const noopAnnotationPlaceholder = '__CODEHIKE_NOOP__';

function escapeNoopAnnotations(rawCode: RawCode): RawCode {
  return {
    ...rawCode,
    value: rawCode.value.replaceAll(
      noopAnnotationPattern,
      `$1${noopAnnotationPlaceholder}`,
    ),
  };
}

function restoreNoopAnnotationText(text: string) {
  return text.replaceAll(noopAnnotationPlaceholder, '!');
}

export namespace Code {
  export type Props = (
    & Omit<ComponentProps<typeof Pre>, 'code' | 'handlers'>
    & (
      | { code: RawCode, codeblock?: never }
      | { codeblock: RawCode, code?: never }
    )
  );
}

export const Code = withStyles(async function Code({
  code,
  codeblock,
  className,
  ...rest
}: Code.Props) {
  const rawCode = code ?? codeblock;
  const filename = rawCode.meta.trim();
  const highlighted = await highlight(
    escapeNoopAnnotations(rawCode),
    'github-from-css',
  );
  const hasNoLineNumbersAnnotation = highlighted.annotations.some(
    ({ name }) => name === noLineNumbersAnnotation,
  );
  const hasLineNumbersAnnotation = highlighted.annotations.some(
    ({ name }) => name === 'line-numbers',
  );
  const hasNoShellPromptAnnotation = highlighted.annotations.some(
    ({ name }) => name === noShellPromptAnnotation,
  );
  const hasShellPromptAnnotation = highlighted.annotations.some(
    ({ name }) => name === 'shell-prompt',
  );
  const hasCopyAnnotation = highlighted.annotations.some(
    ({ name }) => name === 'copy',
  );
  const hasNoCopyAnnotation = highlighted.annotations.some(
    ({ name }) => name === 'no-copy',
  );
  const hasNoLanguageAnnotation = highlighted.annotations.some(
    ({ name }) => name === 'no-language',
  );
  const hasLanguageAnnotation = highlighted.annotations.some(
    ({ name }) => name === 'language',
  );
  const disableLineNumbers = hasNoLineNumbersAnnotation
    && !hasLineNumbersAnnotation;
  const disableShellPrompt = hasNoShellPromptAnnotation
    && !hasShellPromptAnnotation;
  const isShell = shellPrompt.enabledByDefault?.(highlighted.lang) ?? false;
  const showCopy = hasCopyAnnotation || (isShell && !hasNoCopyAnnotation);
  const showLanguage = hasLanguageAnnotation || !hasNoLanguageAnnotation;
  const restoredHighlighted = {
    ...highlighted,
    code: restoreNoopAnnotationText(highlighted.code),
    value: restoreNoopAnnotationText(highlighted.value),
    tokens: highlighted.tokens.map((token) => {
      if (typeof token === 'string') return token;

      const restoredToken = [...token] as typeof token;
      restoredToken[0] = restoreNoopAnnotationText(restoredToken[0]);
      return restoredToken;
    }),
  };
  const pre = (
    <Pre
      {...rest}
      className={className}
      code={restoredHighlighted}
      handlers={[
        ...blockAnnotations,
        ...inlineAnnotations,
      ]
        .filter(({ languages }) => (
          !languages || languages.includes(restoredHighlighted.lang)
        ))
        .filter(({ name }) => (
          name !== lineNumbers.name || !disableLineNumbers
        ))
        .filter(({ name }) => (
          name !== 'shell-prompt' || !disableShellPrompt
        ))
        .map((handler) => (
          handler.enabledByDefault?.(highlighted.lang)
            ? {
              ...handler,
              onlyIfAnnotated: false,
            }
            : handler
        ))}
    />
  );

  return (
    <div className={codeTabsStyle}>
      {filename && (
        <div className={codeToolbarStyle}>
          <div className={codeTabsListStyle}>
            <div className={codeTabsTriggerStyle({ active: true })}>
              {filename}
            </div>
          </div>
        </div>
      )}
      <div className={codeContentStyle}>
        {pre}
        {(showLanguage || showCopy) && (
          <div className={codeOverlayRailStyle}>
            {showLanguage && (
              <span className={cls(codeLanguageStyle, codeOverlayItemStyle)}>{rawCode.lang}</span>
            )}
            {showCopy && <CopyButton text={highlighted.code} />}
          </div>
        )}
      </div>
    </div>
  );
}, codeStyles);
