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
    & Omit<ComponentProps<typeof Pre>, 'code'>
    & { code: RawCode }
  );
}

export const Code = withStyles(async function Code({
  code,
  ...rest
}: Code.Props) {
  const highlighted = await highlight(
    code,
    'github-from-css',
  );
  return (
    <Pre
      {...rest}
      code={highlighted}
    />
  );
}, codeStyles);