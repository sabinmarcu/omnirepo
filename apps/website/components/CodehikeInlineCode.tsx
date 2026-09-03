import {
  highlight,
  Inline,
  type RawCode,
} from 'codehike/code';
import { codehikeInlineCodeStyle } from './CodehikeInlineCode.css';

export namespace CodehikeInlineCode {
  export type Props = {
    codeblock: RawCode,
  };
}

export async function CodehikeInlineCode({
  codeblock,
}: CodehikeInlineCode.Props) {
  const highlighted = await highlight(codeblock, 'github-from-css');
  return (
    <Inline
      className={codehikeInlineCodeStyle}
      code={highlighted}
    />
  );
}
