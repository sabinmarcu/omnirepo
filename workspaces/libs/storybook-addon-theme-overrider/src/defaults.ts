import { merge as deepMerge } from 'ts-deepmerge';

const defaultFontFamily = `'Nunito Sans', -apple-system, '.SFNSText-Regular', 'San Francisco', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif`;

const defaultHeadingsCommonStyles = {
  margin: {
    start: '1.25rem',
    end: '0.5rem',
  },
  padding: {
    start: '0',
    end: '0',
  },
  weight: '700',
  border: '',
  color: '#fff',
} as const;

export const defaultOptions = {
  docs: {
    size: '1500px',
    padding: {
      block: '4rem',
      inline: '1.5rem',
    },
  },
  unstyled: {
    font: {
      size: '1rem',
      family: defaultFontFamily,
      weight: '16px',
    },
  },
  surfaces: {
    sidebar: {
      background: '#333',
      color: '#fff',
      border: '#7b7b7b',
      comboBox: {
        background: '#555',
        color: '#fff',
        border: '#787878',
        input: {
          background: '#333',
          active: '#555',
        },
      },
      notification: {
        background: '#555',
        color: '#fff',
      },
    },
    toolbar: {
      background: '#333',
      color: '#fff',
      badge: {
        background: '#555',
        color: '#fff',
      },
    },
    tooltips: {
      background: '#333',
      color: '#fff',
    },
    panel: {
      border: '#222',
      background: '#222',
      color: '#fff',
    },
    modal: {
      background: '#333',
      color: '#fff',
    },
    page: {
      background: '#222',
      color: '#fff',
      link: {
        base: '#0cf',
        hover: '#0ac',
        active: '#0df',
      },
    },
    preview: {
      background: '#555',
      color: '#fff',
      bar: {
        background: '#333',
        color: '#fff',
      },
    },
    docBlock: {
      codeToggle: {
        background: '#7b7b7b',
        color: '#f0f0f0',
      },
    },
    argsTable: {
      color: '#fff',
      border: '#7b7b7b',
      body: {
        background: '#555',
        code: {
          background: '#7b7b7b',
          color: '#fff',
          border: '#7b7b7b',
        },
      },
      input: {
        background: '#7b7b7b',
        color: '#fff',
      },
    },
    colorPalette: {
      header: '#fff',
      section: '#fff',
      color: '#fff',
    },
    separator: '#555',
    story: {
      background: '#555',
      color: '#fff',
      font: {
        family: defaultFontFamily,
      },
    },
  },
  headings: {
    ...defaultHeadingsCommonStyles,
    h1: deepMerge(defaultHeadingsCommonStyles, {
      ...defaultHeadingsCommonStyles,
      size: '1.75rem',
      weight: '700',
    }),
    h2: deepMerge(defaultHeadingsCommonStyles, {
      size: '1.25rem',
      margin: {
        end: '0.125rem',
      },
      border: '#555',
    }),
    h3: deepMerge(defaultHeadingsCommonStyles, {
      size: '1.125rem',
    }),
    h4: deepMerge(defaultHeadingsCommonStyles, {
      size: '1rem',
    }),
    h5: deepMerge(defaultHeadingsCommonStyles, {
      size: '0.875rem',
    }),
    h6: deepMerge(defaultHeadingsCommonStyles, {
      size: '0.75rem',
    }),
    font: {
      family: defaultFontFamily,
    },
  },
} as const;
