import type { RawCode } from 'codehike/code';
import {
  highlight,
  Pre,
} from 'codehike/code';
import type { ComponentProps } from 'react';
import { withStyles } from '@/hocs/withStyles';
import {
  blockAnnotations,
  inlineAnnotations,
} from './annotations';
import {
  codeStyles,
} from './Code.css';
import {
  codeTabsListStyle,
  codeTabsStyle,
  codeTabsTriggerStyle,
} from './CodeTabs.css';

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

  if (!filename) return pre;

  return (
    <div className={codeTabsStyle}>
      <div className={codeTabsListStyle}>
        <div className={codeTabsTriggerStyle({ active: true })}>
          {filename}
        </div>
      </div>
      {pre}
    </div>
  );
}, codeStyles);
