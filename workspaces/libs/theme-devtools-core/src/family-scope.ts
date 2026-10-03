import type { ThemeManifest } from '@sabinmarcu/theme-core';

const mappingValue = /^var\(\s*(--[\w-]+)\s*\)$/;

/**
 * Family members whose contextual mappings apply to `element`, which must sit inside the
 * manifest's allocation root.
 *
 * Public contextual tokens resolve through mapping declarations (`--theme-x: var(--…-families-
 * <member>-x)`) written by the family harness (root default, `pick()`, `data-theme-family`
 * scopes) or by application CSS. The computed public tokens on `element` are compared with each
 * member's private outputs, which identifies the member whenever members' values differ. Ties
 * (members with identical values) fall back to the nearest `data-theme-family` scope, then the
 * last mapping rule (from any same-origin stylesheet) matching the element or an ancestor.
 * Returns several members only when they remain indistinguishable.
 */
export function appliedFamilyMembers(manifest: ThemeManifest, element: Element): readonly string[] {
  const members = manifest.families ?? [];
  const document = element.ownerDocument;
  const realm = document.defaultView;
  if (!realm || members.length < 2) return members;

  const memberOf = new Map<string, string>();
  for (const output of manifest.outputs) {
    if (output.role === 'derived' && output.path[0] === 'families' && output.path[1] !== undefined) {
      memberOf.set(output.name, output.path[1]);
    }
  }
  type MappingRule = { readonly selector: string; readonly member: string };
  // Public token → member → private output it maps to (owned sheet only).
  const tokens = new Map<string, Map<string, string>>();
  const visit = (list: CSSRuleList, rules: MappingRule[], collectTokens: boolean) => {
    for (const rule of list) {
      const inactiveMedia = rule instanceof realm.CSSMediaRule
        && !realm.matchMedia(rule.media.mediaText).matches;
      if (!inactiveMedia && rule instanceof realm.CSSStyleRule) {
        let ruleMember: string | undefined;
        for (const property of rule.style) {
          const target = mappingValue.exec(rule.style.getPropertyValue(property).trim())?.[1];
          const member = target === undefined ? undefined : memberOf.get(target);
          if (member !== undefined) {
            ruleMember ??= member;
            if (collectTokens) {
              const byMember = tokens.get(property) ?? new Map<string, string>();
              byMember.set(member, target!);
              tokens.set(property, byMember);
            }
          }
        }
        if (ruleMember !== undefined) {
          rules.push({
            selector: rule.selectorText,
            member: ruleMember,
          });
        }
      }
      if (!inactiveMedia
        && (rule instanceof realm.CSSGroupingRule || rule instanceof realm.CSSStyleRule)) {
        visit(rule.cssRules, rules, collectTokens);
      }
    }
  };
  const owned = [...document.querySelectorAll<HTMLStyleElement>('style[data-stylesheet-id]')]
    .find((node) => node.dataset.stylesheetId === manifest.root.sheetId);
  if (owned?.sheet) visit(owned.sheet.cssRules, [], true);
  if (tokens.size === 0) return members;

  const computed = realm.getComputedStyle(element);
  const consistent = members.filter((member) => [...tokens].every(([name, byMember]) => {
    const source = byMember.get(member);
    return source === undefined
      || computed.getPropertyValue(name).trim() === computed.getPropertyValue(source).trim();
  }));
  if (consistent.length === 1) return consistent;

  // Values cannot separate the candidates; use the nearest structural selection instead.
  const pool = new Set(consistent.length > 0 ? consistent : members);
  const rules: MappingRule[] = [];
  for (const sheet of [...document.styleSheets, ...document.adoptedStyleSheets]) {
    try {
      if (!sheet.disabled) visit(sheet.cssRules, rules, false);
    } catch {
      // Cross-origin sheets are unreadable; their mappings stay value-detectable only.
    }
  }
  const root = document.querySelector(manifest.root.selector);
  for (let node: Element | null = element; node; node = node === root ? null : node.parentElement) {
    const scoped = node instanceof realm.HTMLElement || node instanceof realm.SVGElement
      ? node.dataset.themeFamily
      : undefined;
    if (scoped !== undefined && pool.has(scoped)) return [scoped];
    const current = node;
    const matched = rules.filter((rule) => {
      if (!pool.has(rule.member)) return false;
      try {
        return current.matches(rule.selector);
      } catch {
        return false;
      }
    });
    // Later rules win between equally targeted mappings (document order; `pick()` appends).
    if (matched.length > 0) return [matched.at(-1)!.member];
  }
  return [...pool];
}
