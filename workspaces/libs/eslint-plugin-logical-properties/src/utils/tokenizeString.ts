export type TemplateString = {
  quasis: string[],
  expressions: string[],
};

export const stringToTemplate = (
  input: string,
) => {
  let toParse = input;
  let index = toParse.indexOf(' ');
  const quasis: string[] = [];
  const expressions: string[] = [];
  const queue: string[] = [];
  let queuePointer = quasis;
  let toClose = 0;
  let justAddedExpression = false;
  const matchSegment = (current: string) => {
    if (/[(){}]/.test(current) || toClose !== 0) {
      if (queuePointer === quasis && queue.length > 0) {
        quasis.push(queue.join(' '));
        queue.length = 0;
      }
      queuePointer = expressions;
      if (quasis.length === 0 || justAddedExpression) {
        quasis.push('');
      }
      justAddedExpression = false;
      const open = current.match(/([({])/g)?.length ?? 0;
      const closed = current.match(/([)}])/g)?.length ?? 0;
      toClose = toClose + open - closed;
      queue.push(current);
      if (toClose === 0) {
        expressions.push(queue.join(' '));
        queue.length = 0;
        justAddedExpression = true;
      }
    } else {
      if (queuePointer === expressions && queue.length > 0) {
        expressions.push(queue.join(' '));
        queue.length = 0;
      }
      queuePointer = quasis;
      queue.push(current);
    }
  };

  while (index >= 0) {
    const current = toParse.slice(0, index);
    matchSegment(current);
    toParse = toParse.slice(index + 1);
    index = toParse.indexOf(' ');
  }
  if (toParse.length > 0) {
    matchSegment(toParse);
  }
  if (queue.length > 0) {
    if (queuePointer === quasis) {
      quasis.push(queue.join(' '));
    } else {
      expressions.push(queue.join(' '));
    }
  }
  if (quasis.length === expressions.length) {
    quasis.push('');
  }
  return {
    quasis,
    expressions,
  } as const satisfies TemplateString;
};

export type TokenizedString = {
  output: string,
  tokens: [string, string][],
};

export const getToken = (index = 0) => {
  const tag = `<!token-${index}>`;
  return tag;
};

export const tokenizeString = (input: TemplateString) => {
  const quasis = [...input.quasis];
  const expressions = [...input.expressions];
  const pieces: string[] = [];
  let pointer: string[] = quasis;
  const tokens: [string, string][] = [];

  while (quasis.length + expressions.length) {
    const current = pointer.shift()!;
    if (pointer === quasis) {
      pieces.push(current);
      pointer = expressions;
    } else {
      const tag = getToken(tokens.length);
      pieces.push(tag);
      tokens.push([tag, current]);
      pointer = quasis;
    }
  }
  const result = pieces.join(' ')
    .trim()
    .replaceAll(/(\s)\s+/g, '$1');
  return {
    output: result,
    tokens,
  } as const satisfies TokenizedString;
};
