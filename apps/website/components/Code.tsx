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
    rawCode,
    'github-from-css',
  );
  const pre = (
    <Pre
      {...rest}
      className={className}
      code={highlighted}
      handlers={[
        ...blockAnnotations,
        ...inlineAnnotations,
      ]
        .filter(({ languages }) => (
          !languages || languages.includes(highlighted.lang)
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
