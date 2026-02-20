export async function readRawContent(
  path: string,
) {
  return import(`./${path}`);
}
