import fs from 'node:fs/promises';
import { explainFile } from '@/utils/files';
import { parseSourceCode } from './parseSourceCode';

export namespace parseSourceFile {
  export type Options = (
    & (
      | {
        filepath: string,
        lang?: string,
        source?: string
      }
      | {
        filepath: never,
        lang: string,
        source: string,
      }
    )
  );

  export type Result = ReturnType<typeof parseSourceFile>;
}

export async function parseSourceFile(options: parseSourceFile.Options) {
  const {
    lang,
    filepath,
    source,
  } = options;
  const { extension, filename } = explainFile(filepath);

  const partial = {
    lang: lang ?? extension,
    meta: filename,
  };

  console.log({
    source,
    filepath,
  });

  const contentGroups = parseSourceCode(
    source ?? await fs.readFile(
      filepath,
      'utf8',
    ),
  );

  return contentGroups.map((content) => ({

    title: content.title,
    variant: content.variant,
    comment: content.comment,
    content: {
      ...partial,
      value: content.content,
    },
  }));
}
