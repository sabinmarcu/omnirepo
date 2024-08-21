export const deriveAlias = (
  name: string,
): [ string ] | [string, string] => {
  const [
    ,
    maybeScope,
    maybeName,
  ] = name.match(/(@[^/]+\/)?(.*)/)!;
  if (maybeScope) {
    return [maybeName, name];
  }
  return [name];
};
