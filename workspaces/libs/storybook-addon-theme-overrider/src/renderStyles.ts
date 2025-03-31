import { createStylesheet } from '@sabinmarcu/stylesheet';
import { merge as deepMerge } from 'ts-deepmerge';
import type {
  globalStyle,
  createContainer,
} from '@vanilla-extract/css';

const addContainer: typeof createContainer = (input) => (
  `${input}`
);

export const createStyle = (debugId = 'theme-overrider-styles') => {
  const collection: Record<
    string,
    Record<string, string>
  > = {};

  const addToColletion = (
    input: Parameters<typeof globalStyle>[0],
    rules: Parameters<typeof globalStyle>[1],
  ): void => {
    const updatedRules = Object.entries(rules)
      .map(
        ([key, value]) => [
          key.replaceAll(
            /([a-z])([A-Z])/g,
            (_, $1, $2) => `${$1}-${$2.toLowerCase()}`,
          ),
          value,
        ],
      );

    collection[input] = deepMerge(
      collection[input] ?? {},
      Object.fromEntries(updatedRules),
    ) as any;
  };

  const render = () => {
    const stylesheetRules = Object.entries(collection)
      .map(([selector, rules]) => ({
        selector,
        rules,
      }));

    const Stylesheet = createStylesheet({
      debugId,
      rules: stylesheetRules,
    });

    return Stylesheet.raw;
  };

  return {
    globalStyle: addToColletion,
    createContainer: addContainer,
    render,
  } as const;
};
