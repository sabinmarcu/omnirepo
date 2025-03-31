import type { PropsWithChildren } from 'react';
import type {
  StylesheetRuleSet,
} from './types.js';

namespace createStylesheet {
  export type Options<Rules extends StylesheetRuleSet> = {
    rules?: Rules[],
    nonce?: string;
    debugId?: string;
  };
  export type Props = PropsWithChildren<{
    nonce?: string,
  }>;
}

namespace global {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
  export const __webpack_nonce__: string | undefined = undefined;
}

const parseContentRegex = /^(?:@layer\s+([^\s]+)\s+\{\s+)?([^\s]+)\s*\{([^}]+)}(?:\s+})?\n*/gm;
const parseRuleRegex = /([-\w\d]+):([^;]+);/gm;
export function createStylesheet<
  const Rules extends StylesheetRuleSet,
>({
  // eslint-disable-next-line no-underscore-dangle
  nonce = global.__webpack_nonce__,
  debugId,
  rules = [],
}: createStylesheet.Options<Rules>) {
  const renderRules = (input: StylesheetRuleSet[]) => {
    const results: string[] = [];
    for (const {
      selector,
      layer,
      rules: selectorRules,
    } of input) {
      const selectorContent = Object.entries(selectorRules ?? {})
        .map(([key, value]) => `\t${key}: ${value};`)
        .join('\n');

      const renderedSelector = `${selector} {\n${selectorContent}\n}\n`.trim();
      const finalRender = layer
        ? `@layer ${layer} {\n${
          renderedSelector.split('\n').map((it) => `\t${it}`).join('\n')
        }\n}`
        : renderedSelector;
      results.push(finalRender);
    }

    return results.join('\n');
  };

  const updateRules = (
    existing: string,
    update: Parameters<typeof renderRules>[0],
  ) => {
    // Parse existing rules
    const parsedInput: Parameters<typeof renderRules>[0] = [];
    for (const [,layer, selector, content] of existing.matchAll(parseContentRegex)) {
      const parsedRules: Record<string, string> = {};
      for (const [,ruleName, ruleValue] of content.matchAll(parseRuleRegex)) {
        parsedRules[ruleName] = ruleValue;
      }
      parsedInput.push({
        selector,
        layer,
        rules: parsedRules,
      });
    }

    // Merge existing with update
    const mergedInput: typeof parsedInput = [...parsedInput];
    while (update.length > 0) {
      const {
        selector,
        layer,
        rules: rulesToUpdate,
      } = update.pop()!;
      const existingRules = mergedInput.find(
        ({
          selector: existingSelector,
          layer: existingLayer,
        }) => (
          existingSelector === selector
            && existingLayer === layer
        ),
      );
      if (existingRules) {
        existingRules.rules = {
          ...existingRules.rules,
          ...rulesToUpdate,
        };
      } else {
        mergedInput.push({
          selector,
          layer,
          rules: rulesToUpdate,
        });
      }
    }

    return renderRules(mergedInput as any);
  };

  const initialContent = renderRules(rules ?? {});

  function Stylesheet({ children, nonce: nonceProp }: createStylesheet.Props) {
    return (
      <style
        nonce={nonceProp ?? nonce}
        data-stylesheet={debugId ?? true}
        dangerouslySetInnerHTML={{
          __html: children ?? initialContent,
        }}
      />
    );
  }
  Stylesheet.displayName = `${debugId}(Stylesheet)`;

  const getCurrentStylesheets = (
    root: typeof document = document,
  ) => (
    root.querySelectorAll(`[data-stylesheet="${debugId}"]`)
  );

  const update = (
    newContent: Parameters<typeof renderRules>[0],
    root: typeof document = document,
  ) => {
    const nodes = getCurrentStylesheets(root);
    for (const element of (nodes as unknown as Element[])) {
      if (element) {
        element.innerHTML = updateRules(element.innerHTML, newContent);
      }
    }
  };

  const legacyRender = (
    root: typeof document = document,

  ) => {
    const head = root.querySelector('head');
    if (!head) {
      throw new Error('Could not find "head" element, probably not running in browser.');
    }
    const existing = getCurrentStylesheets(root);
    if (existing.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('Stylesheet already exists!', { existing });
      return undefined;
    }
    const script = document.createElement('style');
    script.innerHTML = initialContent;
    script.dataset['stylesheet'] = debugId ?? '';
    head.append(script);
    return script;
  };

  return {
    Component: Stylesheet,
    update,
    id: debugId,
    raw: `<style data-stylesheet="${debugId}" nonce="${nonce}">${initialContent}</style>`,
    legacyRender,
  } as const;
}

