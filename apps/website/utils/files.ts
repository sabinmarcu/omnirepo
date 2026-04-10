import path from 'node:path';

export function explainFile(filepath: string) {
  const filename = filepath.split('/').at(-1)!;
  const dirname = path.dirname(filepath);
  const extension = filename.split('.').at(-1);

  return {
    dirname,
    filepath,
    filename,
    extension,
  } as const;
}
