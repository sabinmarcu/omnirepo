import type {
  BrowserStylesheet,
  Stylesheet,
  StylesheetChange,
  StylesheetDeclaration,
  StylesheetOptions,
  StylesheetRuleSet,
  StylesheetState,
} from './types.js';

export const stylesheetCommitEvent = 'stylesheet:commit';

const escapeAttribute = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

// Escape HTML end-tag openers only; CSS range-query comparison operators stay literal.
const escapeStyleText = (css: string) => css.replaceAll(/<(?=\/style)/gi, '\\3c ');

const declaration = (input: Exclude<StylesheetDeclaration, null>) => {
  if (typeof input === 'object') return { ...input };
  const value = String(input);
  const important = /\s*!important\s*$/i;
  return important.test(value)
    ? {
      value: value.replace(important, ''),
      priority: 'important' as const,
    }
    : { value };
};

const validate = (rules: readonly StylesheetRuleSet[]) => {
  for (const rule of rules) {
    if (!rule.selector.trim() || rule.selector.includes('\u{0}')) {
      throw new Error('Invalid stylesheet selector');
    }
    if (rule.layer !== undefined && !/^[\w-]+(?:\.[\w-]+)*$/.test(rule.layer)) {
      throw new Error('Invalid stylesheet layer');
    }
    for (const property of Object.keys(rule.rules ?? {})) {
      if (!/^(?:--[\w-]+|-?[a-zA-Z][\w-]*)$/.test(property)) {
        throw new Error(`Invalid CSS property: ${property}`);
      }
    }
  }
};

const serializeRules = (rules: readonly StylesheetRuleSet[]) => escapeStyleText(
  rules.map((rule) => {
    const declarations = Object.entries(rule.rules ?? {}).flatMap(([property, input]) => {
      if (input === null) return [];
      const { value, priority } = declaration(input);
      return [`${property}: ${value}${priority ? ' !important' : ''};`];
    }).join('\n');
    const css = `${rule.selector} {\n${declarations}\n}`;
    return rule.layer ? `@layer ${rule.layer} {\n${css}\n}` : css;
  }).join('\n'),
);

const mergeRules = (
  current: readonly StylesheetRuleSet[],
  patches: readonly StylesheetRuleSet[],
) => {
  const result = current.map((rule) => ({
    ...rule,
    rules: { ...rule.rules },
  }));
  for (const patch of patches) {
    let target = result.find(
      (rule) => rule.selector === patch.selector && rule.layer === patch.layer,
    );
    if (!target) {
      target = {
        selector: patch.selector,
        layer: patch.layer,
        rules: {},
      };
      result.push(target);
    }
    for (const [property, value] of Object.entries(patch.rules ?? {})) {
      if (value === null) Reflect.deleteProperty(target.rules, property);
      else target.rules[property] = typeof value === 'object' ? { ...value } : value;
    }
  }
  return result;
};

const commitChange = (
  patches: readonly StylesheetRuleSet[],
  canonicalSelector: (selector: string) => string = (selector) => selector,
): StylesheetChange => {
  const rules: Array<{
    selector: string;
    layer?: string;
    properties: string[];
    propertySet: Set<string>;
  }> = [];
  const selectors = new Map<string, Map<string | undefined, typeof rules[number]>>();
  for (const patch of patches.filter((entry) => Object.keys(entry.rules ?? {}).length > 0)) {
    const properties = Object.keys(patch.rules ?? {});
    const selector = canonicalSelector(patch.selector);
    let layers = selectors.get(selector);
    if (!layers) {
      layers = new Map();
      selectors.set(selector, layers);
    }
    let rule = layers.get(patch.layer);
    if (!rule) {
      rule = {
        selector,
        ...(patch.layer === undefined ? {} : { layer: patch.layer }),
        properties: [],
        propertySet: new Set(),
      };
      layers.set(patch.layer, rule);
      rules.push(rule);
    }
    for (const property of properties) {
      if (!rule.propertySet.has(property)) {
        rule.propertySet.add(property);
        rule.properties.push(property);
      }
    }
  }
  return Object.freeze({
    rules: Object.freeze(rules.map((rule) => Object.freeze({
      selector: rule.selector,
      ...(rule.layer === undefined ? {} : { layer: rule.layer }),
      properties: Object.freeze(rule.properties),
    }))),
  });
};

const serializeSheet = (sheet: CSSStyleSheet) => escapeStyleText(
  Array.from(sheet.cssRules, (rule) => rule.cssText).join('\n'),
);

const styleRule = (rule: CSSRule): rule is CSSStyleRule => 'selectorText' in rule && 'style' in rule;
const layerRule = (rule: CSSRule): rule is CSSLayerBlockRule => (
  Reflect.apply(Object.prototype.toString, rule, []) === '[object CSSLayerBlockRule]'
);

const containers = (
  sheet: CSSStyleSheet,
  layer?: string,
): (CSSStyleSheet | CSSLayerBlockRule)[] => {
  if (layer === undefined) return [sheet];
  const matches: CSSLayerBlockRule[] = [];
  const visit = (rules: CSSRuleList, parent = '') => {
    for (const rule of rules) {
      if (layerRule(rule)) {
        const name = parent ? `${parent}.${rule.name}` : rule.name;
        if (name === layer) matches.push(rule);
        visit(rule.cssRules, name);
      }
    }
  };
  visit(sheet.cssRules);
  return matches;
};

const findRule = (sheet: CSSStyleSheet, selector: string, layer?: string) => {
  const matches = containers(sheet, layer).flatMap((container) => [...container.cssRules].filter(
    (rule): rule is CSSStyleRule => styleRule(rule) && rule.selectorText === selector,
  ));
  if (matches.length > 1) throw new Error(`Ambiguous stylesheet rule: ${selector}`);
  return matches[0];
};

export function createStylesheet(options: StylesheetOptions): Stylesheet {
  const {
    id, debugId = id, nonce,
  } = options;
  if (!id) throw new Error('A stylesheet ownership id is required');
  for (const character of id) {
    if (character.codePointAt(0)! < 32) throw new Error('Invalid stylesheet ownership id');
  }
  validate(options.rules ?? []);
  let serverRules = mergeRules([], options.rules ?? []);
  const mounts = new WeakMap<Document | ShadowRoot, BrowserStylesheet>();

  const html = (css: string, currentNonce: string | undefined, label: string) => {
    const attributes = `data-stylesheet-id="${escapeAttribute(id)}" data-stylesheet="${escapeAttribute(label)}"`;
    const nonceAttribute = currentNonce === undefined ? '' : ` nonce="${escapeAttribute(currentNonce)}"`;
    return `<style ${attributes}${nonceAttribute}>${escapeStyleText(css)}</style>`;
  };

  const state = (
    getCSS: () => string,
    readMany: StylesheetState['readMany'],
    commit: StylesheetState['update'],
    getNonce: () => string | undefined,
    getDebugId: () => string = () => debugId,
    changes: (patches: readonly StylesheetRuleSet[]) => StylesheetChange = commitChange,
    notifyCommit?: (stylesheet: StylesheetState, change: StylesheetChange) => void,
    subscribeToCommit?: (
      stylesheet: StylesheetState,
      listener: (stylesheet: StylesheetState, change: StylesheetChange) => void,
    ) => () => void,
  ): StylesheetState => {
    let listeners: Set<(stylesheet: StylesheetState, change: StylesheetChange) => void> | undefined;
    const owner: StylesheetState = {
      id,
      get debugId() { return getDebugId(); },
      get nonce() { return getNonce(); },
      get css() { return getCSS(); },
      get raw() { return owner.snapshot().html; },
      read(selector, property, layer) {
        return readMany(selector, [property], layer)[property];
      },
      readMany,
      update(patches) {
        if (patches.length === 0) return;
        validate(patches);
        const change = changes(patches);
        commit(patches);
        if (notifyCommit) notifyCommit(owner, change);
        else if (listeners) for (const listener of listeners) listener(owner, change);
      },
      snapshot(currentNonce = getNonce()) {
        const css = getCSS();
        return {
          css,
          html: html(css, currentNonce, getDebugId()),
        };
      },
      subscribe(listener) {
        return subscribeToCommit?.(owner, listener) ?? (() => {
          listeners ??= new Set();
          const localListeners = listeners;
          localListeners.add(listener);
          return () => { localListeners.delete(listener); };
        })();
      },
    };
    return owner;
  };
  const server = state(
    () => serializeRules(serverRules),
    (selector, properties, layer) => {
      const rule = serverRules.find(
        (candidate) => candidate.selector === selector && candidate.layer === layer,
      );
      const values: Record<string, string | undefined> = Object.create(null);
      for (const property of properties) {
        const value = rule?.rules[property];
        values[property] = value === undefined || value === null
          ? undefined
          : declaration(value).value;
      }
      return values;
    },
    (patches) => { serverRules = mergeRules(serverRules, patches); },
    () => nonce,
  );

  return Object.assign(server, {
    mount(root: Document | ShadowRoot = document): BrowserStylesheet {
      const ownerDocument = root.nodeType === 9 ? root as Document : root.ownerDocument!;
      const nodes = () => [...root.querySelectorAll<HTMLStyleElement>('style[data-stylesheet-id]')]
        .filter((node) => node.dataset.stylesheetId === id);
      const existing = nodes();
      if (existing.length > 1) throw new Error(`Ambiguous stylesheet ownership: ${id}`);
      const cached = mounts.get(root);
      if (cached && existing[0] === cached.element) return cached;
      let element = existing[0];
      if (!element) {
        element = ownerDocument.createElement('style');
        element.dataset.stylesheetId = id;
        element.dataset.stylesheet = debugId;
        if (nonce !== undefined) element.nonce = nonce;
        element.textContent = server.css;
        const target = root.nodeType === 9 ? ownerDocument.head : root;
        if (!target) throw new Error('Cannot mount stylesheet without a document head');
        target.append(element);
      }
      const ownedElement = element;
      const currentSheet = () => {
        const current = nodes();
        if (current.length !== 1 || current[0] !== ownedElement) {
          throw new Error(`Ambiguous or detached stylesheet ownership: ${id}`);
        }
        if (!ownedElement.sheet) throw new Error(`Stylesheet is unavailable (check CSP): ${id}`);
        return ownedElement.sheet;
      };
      try {
        currentSheet();
      } catch (error) {
        if (existing.length === 0) ownedElement.remove();
        throw error;
      }
      const realm = ownerDocument.defaultView;
      if (!realm) throw new Error('Stylesheet attachment requires an active document realm');
      const selectorCache = new Map<string, string>();
      const canonicalSelector = (selector: string) => {
        const cachedSelector = selectorCache.get(selector);
        if (cachedSelector !== undefined) return cachedSelector;
        const probe = new realm.CSSStyleSheet();
        probe.insertRule(`${selector} {}`);
        const rule = probe.cssRules[0]!;
        if (!styleRule(rule)) throw new Error('Expected a CSS style rule');
        const canonical = rule.selectorText;
        if (selectorCache.size >= 128) selectorCache.delete(selectorCache.keys().next().value!);
        selectorCache.set(selector, canonical);
        return canonical;
      };
      const browserState = state(
        () => serializeSheet(currentSheet()),
        (selector, properties, layer) => {
          const rule = findRule(currentSheet(), canonicalSelector(selector), layer);
          const values: Record<string, string | undefined> = Object.create(null);
          for (const property of properties) {
            values[property] = rule?.style.getPropertyValue(property) || undefined;
          }
          return values;
        },
        (patches) => {
          // Patch live CSSOM synchronously; a failed batch restores the previous sheet.
          // Constructable replaceSync would silently discard unrelated @import rules.
          const sheet = currentSheet();
          const previousCSS = serializeSheet(sheet);
          try {
            for (const patch of patches) {
              const selector = canonicalSelector(patch.selector);
              let rule = findRule(sheet, selector, patch.layer);
              if (!rule) {
                let container = containers(sheet, patch.layer).at(-1);
                if (!container) {
                  const index = sheet.insertRule(`@layer ${patch.layer} {}`, sheet.cssRules.length);
                  container = sheet.cssRules[index] as CSSLayerBlockRule;
                }
                const index = container.insertRule(`${selector} {}`, container.cssRules.length);
                rule = container.cssRules[index] as CSSStyleRule;
              }
              for (const [property, input] of Object.entries(patch.rules ?? {})) {
                if (input === null) rule.style.removeProperty(property);
                else {
                  const { value, priority } = declaration(input);
                  rule.style.setProperty(property, value, priority ?? '');
                }
              }
            }
            // One text commit keeps text-based mirrors current. Never retain CSSOM handles.
            ownedElement.textContent = serializeSheet(sheet);
            currentSheet();
          } catch (error) {
            ownedElement.textContent = previousCSS;
            throw error;
          }
        },
        () => ownedElement.nonce || undefined,
        () => ownedElement.dataset.stylesheet ?? debugId,
        (patches) => commitChange(patches, canonicalSelector),
        (owner, change) => {
          const event = new realm.CustomEvent<StylesheetChange>(stylesheetCommitEvent, {
            detail: change,
          });
          ownedElement.dispatchEvent(event);
        },
        (owner, listener) => {
          const onCommit = (event: Event) => {
            if (event instanceof realm.CustomEvent) {
              listener(owner, event.detail as StylesheetChange);
            }
          };
          ownedElement.addEventListener(stylesheetCommitEvent, onCommit);
          return () => { ownedElement.removeEventListener(stylesheetCommitEvent, onCommit); };
        },
      );
      Reflect.defineProperty(browserState, 'element', {
        value: ownedElement,
        enumerable: true,
      });
      const mounted = browserState as BrowserStylesheet;
      mounts.set(root, mounted);
      return mounted;
    },
  });
}
