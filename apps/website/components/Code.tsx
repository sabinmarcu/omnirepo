import type { RawCode } from 'codehike/code';
import {
  highlight,
  Pre,
} from 'codehike/code';
import type { ComponentProps } from 'react';
import { codeStyles } from './Code.css';

export namespace Code {
  export type Props = (
    & Omit<ComponentProps<typeof Pre>, 'code'>
    & { code: RawCode }
  );
}

export async function Code({
  code,
  className,
  ...rest
}: Code.Props) {
  const highlighted = await highlight(
    code,
    'github-from-css',
  );
  return (
    <Pre
      {...rest}
      className={[className, codeStyles].join(' ')}
      code={highlighted}
    />
  );
}
