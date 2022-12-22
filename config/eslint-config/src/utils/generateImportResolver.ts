export const NO_PROJECTS_ERROR = 'No supplied projects';
export const PROJECTS_NOT_ARRAY = 'Supplied projects is not an array';
export const PROJECTS_EMPTY = 'Supplied projects is an empty array';
export const PROJECTS_NOT_STRINGS = 'Supplied projects contains non-string values';

export const generateImportResolver = (
  projects: string[],
) => {
  if (!projects) {
    throw new Error(NO_PROJECTS_ERROR);
  }
  if (!Array.isArray(projects)) {
    throw new TypeError(PROJECTS_NOT_ARRAY);
  }
  if (projects.length === 0) {
    throw new Error(PROJECTS_EMPTY);
  }
  if (projects.some((project) => typeof project !== 'string')) {
    throw new Error(PROJECTS_NOT_STRINGS);
  }
  return {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: projects,
        },
      },
    },
  } as const;
};
