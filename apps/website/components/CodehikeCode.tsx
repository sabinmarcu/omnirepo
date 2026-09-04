import { PageLayout } from '@/layouts/PageLayout';
import { Code } from './Code';
import { PackageManagerCode } from './PackageManagerCode';

export namespace CodehikeCode {
  export type Props = Code.Props;
}

export function CodehikeCode({
  code,
  codeblock: codeblockProp,
  ...props
}: CodehikeCode.Props) {
  const codeblock = code ?? codeblockProp;
  const packageAnnotation = /^package-command(?:\s+(.*))?$/.exec(codeblock.meta);

  if (packageAnnotation) {
    return (
      <PackageManagerCode
        codeblock={codeblock}
        command={packageAnnotation[1] ?? ''}
      />
    );
  }

  return (
    <PageLayout.Inset>
      <Code {...props} codeblock={codeblock} />
    </PageLayout.Inset>
  );
}
