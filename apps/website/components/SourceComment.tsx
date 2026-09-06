import { evaluate } from '@mdx-js/mdx';
import type { CodeHikeConfig } from 'codehike/mdx';
import {
  recmaCodeHike,
  remarkCodeHike,
} from 'codehike/mdx';
import {
  Fragment,
  jsx,
  jsxs,
} from 'react/jsx-runtime';
import { mdxComponents } from '@/mdx-components';

const codeHikeConfig: CodeHikeConfig = {
  components: {
    code: 'CodehikeCode',
    inlineCode: 'CodehikeInlineCode',
  },
};

export async function SourceComment({ comment }: { comment: string[] }) {
  const { default: Content } = await evaluate(comment.join('\n'), {
    Fragment,
    jsx: jsx as never,
    jsxs: jsxs as never,
    format: 'md',
    remarkPlugins: [[remarkCodeHike, codeHikeConfig]],
    recmaPlugins: [[recmaCodeHike, codeHikeConfig]],
  });

  return <Content components={mdxComponents} />;
}
