import type {
  PartialDeep,
  UnionToIntersection,
} from '@sabinmarcu/types';
import { merge as deepMerge } from 'ts-deepmerge';
import type {
  InputOptions,
} from './types.js';

const minimalFonts = ({ font: family }: { font?: string }): InputOptions => (family
  ? ({
    unstyled: {
      font: {
        family,
      },
    },
    surfaces: {
      story: {
        font: {
          family,
        },
      },
    },
    headings: {
      font: {
        family,
      },
    },
  })
  : {});

const minimalColor = ({ color }: { color?: string }): InputOptions => (color
  ? ({
    surfaces: {
      sidebar: {
        color,
        comboBox: {
          color,
        },
        notification: {
          color,
        },
      },
      toolbar: {
        color,
        badge: {
          color,
        },
      },
      tooltips: {
        color,
      },
      modal: {
        color,
      },
      page: {
        color,
      },
      preview: {
        color,
        bar: {
          color,
        },
      },
      panel: {
        color,
      },
      docBlock: {
        codeToggle: {
          color,
        },
      },
      argsTable: {
        color,
        body: {
          code: {
            color,
          },
        },
        input: {
          color,
        },
      },
      colorPalette: {
        header: color,
        section: color,
        color,
      },
      story: {
        color,
      },
    },
    headings: {
      color,
      h1: { color },
      h2: { color },
      h3: { color },
      h4: { color },
      h5: { color },
      h6: { color },
    },
  })
  : {});

// #222
const minimalPageBackground = (
  { pageBackground: background }: { pageBackground?: string },
): InputOptions => (background
  ? {
    surfaces: {
      preview: {
        background,
      },
      panel: {
        background,
      },
      argsTable: {
        body: {
          background,
        },
      },
      story: {
        background,
      },
    },
  }
  : {});

// #333
const minimalSecondaryBackground = (
  { secondaryBackground: background }: { secondaryBackground?: string },
): InputOptions => (background
  ? {
    surfaces: {
      sidebar: {
        background,
        comboBox: {
          input: {
            background,
          },
        },
      },
      preview: {
        bar: {
          background,
        },
      },
      toolbar: {
        background,
      },
      tooltips: {
        background,
      },
      modal: {
        background,
      },
    },
  }
  : {});

// #555
const minimalBaseBackground = (
  { baseBackground: background }: { baseBackground?: string },
): InputOptions => (background
  ? {
    surfaces: {
      sidebar: {
        comboBox: {
          background,
          input: {
            active: background,
          },
        },
        notification: {
          background,
        },
      },
      toolbar: {
        badge: {
          background,
        },
      },
      page: {
        background,
      },
      separator: background,
    },
    headings: {
      h2: {
        border: background,
      },
    },
  }
  : {});

// #787878
const minimalBorder = (
  { border }: { border?: string },
): InputOptions => (border
  ? {
    surfaces: {
      sidebar: {
        border,
        comboBox: {
          border,
        },
      },
      panel: {
        border,
      },
      docBlock: {
        codeToggle: {
          background: border,
        },
      },
      argsTable: {
        border,
        body: {
          code: {
            background: border,
            border,
          },
        },
        input: {
          background: border,
        },
      },
    },
  }
  : {});

export const normalizers = [
  minimalFonts,
  minimalColor,
  minimalPageBackground,
  minimalBaseBackground,
  minimalSecondaryBackground,
  minimalBorder,
] as const;

export type MinimalOptions = PartialDeep<
  UnionToIntersection<
    Parameters<typeof normalizers[number]>[0]
  >
>;

const isMinimal = (input: any): input is MinimalOptions => (
  true
);

export const normalizeOptions = (
  input: InputOptions | MinimalOptions,
): InputOptions => {
  if (!isMinimal(input)) {
    return input;
  }

  const normalizedInput = normalizers.reduce(
    (accumulator, normalizer) => deepMerge(accumulator, normalizer(input)),
    {},
  );

  return normalizedInput;
};
