import { Code } from './Code';
import { PageLayout } from '@/layouts/PageLayout';

export namespace CodehikeCode {
  export type Props = Code.Props;
}

export function CodehikeCode(props: CodehikeCode.Props) {
  return (
    <PageLayout.Inset>
      <Code {...props} />
    </PageLayout.Inset>
  );
}
