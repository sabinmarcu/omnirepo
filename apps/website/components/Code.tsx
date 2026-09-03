import type { RawCode } from 'codehike/code';
import {
  highlight,
  Pre,
} from 'codehike/code';
import type { ComponentProps } from 'react';
import { withStyles } from '@/hocs/withStyles';
import { codeStyles } from './Code.css';

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
  ...rest
}: Code.Props) {
  const rawCode = code ?? codeblock;
  const highlighted = await highlight(
    rawCode,
    'github-from-css',
  );
  return (
    <Pre
      {...rest}
      code={highlighted}
    />
  );
}, codeStyles);
