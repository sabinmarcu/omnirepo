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
    resolvers: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
} as const;
