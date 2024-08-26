export const rulePrefix = 'logical-properties';
export const defaultFunctions = ['style', 'globalStyle'] as const;
export const defaultKeyframes = ['keyframes'] as const;
export const defaultJsxAttributes = ['style'] as const;

export const configSchema = {
  type: 'object',
  properties: {
    functions: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    jsxAttributes: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    keyframes: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
} as const;
