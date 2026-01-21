import moize from 'moize';

async function readRawContentRaw(
  path: string,
) {
  return import(`./${path}`);
}

export const readRawContent = (
  moize.promise(readRawContentRaw) as
  unknown as typeof readRawContentRaw
);
