import { propertyTraverseWildcard } from './propertyTraverse.constants.js';

export const pathToSegments = (path: string) => (
  path
    .replaceAll(/(\w+)(\[[^\]]])/g, '$1.$2')
    .split('.')
);

export const segmentsToPath = (segments: string[]) => (
  segments.join('.')
);

export const isWildcard = (input: string) => (
  input === propertyTraverseWildcard
);

export const segmentsIsEmpty = (input: string[]) => (
  input.length === 0
  || (input.length === 1 && input[0] === '')
);

function normlizePackInput(input: string, separator = '`') {
  const segments = [...input];
  let nextIndex = segments.indexOf(separator);
  let open = true;
  if (nextIndex < 0) {
    return input;
  }
  do {
    if (open) {
      segments.splice(nextIndex, 1, `"${separator}`);
      open = false;
    } else {
      segments.splice(nextIndex, 1, `${separator}"`);
      open = true;
    }
    nextIndex = segments.indexOf(separator, nextIndex + 2);
  } while (nextIndex >= 0);
  return segments.join('');
}

function normalizePackOutput(input: string, separator = '`') {
  return input
    .replaceAll(`"${separator}`, `${separator}`)
    .replaceAll(`${separator}"`, `${separator}`);
}

export const packer = {
  unpack: (input: string) => {
    const normalized = normlizePackInput(
      normlizePackInput(input, '`'),
      '\'',
    );
    try {
      const parsed = JSON.parse(normalized);
      return parsed;
    } catch {
      throw new Error(normalized);
    }
  },
  pack: (input: any) => {
    const stringified = JSON.stringify(input);
    const normalized = normalizePackOutput(
      normalizePackOutput(stringified, '`'),
      '\'',
    );
    return normalized;
  },
};

export const generateObjectStringFromPath = (
  input: string | string[],
  insert: string,
) => {
  const segments = Array.isArray(input)
    ? input
    : pathToSegments(input);

  if (segmentsIsEmpty(segments)) {
    return insert;
  }

  const [current, ...nextSegments] = segments;
  const nextString = generateObjectStringFromPath(nextSegments, insert);
  const next = packer.unpack(nextString);

  const maybeAccessor = current.match(/^\[(\d+)]$/);
  if (maybeAccessor) {
    const [,match] = maybeAccessor;
    const index = Number.parseInt(match, 10)!;
    const newArray = Array.from({ length: index + 2 });
    newArray[index] = next;
    return packer.pack(newArray);
  }

  const newObject: any = { [current]: next };
  return packer.pack(newObject);
};

export const generateObjectStringsFromPaths = (
  input: string[] | readonly string[],
  insert: string,
) => {
  const paths = input.includes('')
    ? input
    : ['', ...input];

  return paths.map((path) => generateObjectStringFromPath(path, insert));
};

export type ObjectStringTestCaseDeclaration = {
  testName: string,
  functionName: string,
};
export const generateObjectStringTestCaseDeclaration = (
  { testName, functionName }: ObjectStringTestCaseDeclaration,
  objectString: string,
) => `const ${testName} = ${functionName}(${objectString})`;

export type ObjectStringTestCaseOptions = (
  & ObjectStringTestCaseDeclaration
  & { resolvers: string[] | readonly string[] }
);
export type ObjectStringTestCase = {
  input: Record<any, any> | string,
  output?: Record<any, any> | string,

};

export const generateObjectStringTestCases = (
  {
    resolvers,
    ...declarationOptions
  }: ObjectStringTestCaseOptions,
  {
    input,
    output,
  }: ObjectStringTestCase,
) => {
  const inputObject = typeof input === 'string' ? input : packer.pack(input);
  const outputObject = output
    ? (typeof output === 'string' ? output : packer.pack(output))
    : undefined;
  const declarationGenerator = generateObjectStringTestCaseDeclaration.bind(
    undefined,
    declarationOptions,
  );
  const inputObjectStrings = generateObjectStringsFromPaths(
    resolvers,
    inputObject,
  ).map(declarationGenerator);
  const outputObjectStrings = outputObject
    ? generateObjectStringsFromPaths(
      resolvers,
      outputObject,
    ).map(declarationGenerator)
    : [];

  const result: { code: string, output?: string }[] = [];
  for (const [index, code] of Object.entries(inputObjectStrings)) {
    result.push({
      code,
      output: (outputObjectStrings as any)[index],
    });
  }
  return result;
};
