type StyleKey = 'panel' | 'editor' | 'window';

type SheetCache = Map<StyleKey, Map<string, CSSStyleSheet>>;
type Attachment = { references: number };

const sheetsByDocument = new WeakMap<Document, SheetCache>();
const attachmentsByRoot = new WeakMap<ShadowRoot, Map<CSSStyleSheet, Attachment>>();

function createConstructableSheet(
  root: ShadowRoot,
  key: StyleKey,
  css: string,
): CSSStyleSheet | undefined {
  const document = root.ownerDocument;
  const realm = document.defaultView;
  if (!realm || typeof realm.CSSStyleSheet !== 'function') return undefined;

  let cache = sheetsByDocument.get(document);
  if (!cache) {
    cache = new Map();
    sheetsByDocument.set(document, cache);
  }
  let sheetsForKey = cache.get(key);
  if (!sheetsForKey) {
    sheetsForKey = new Map();
    cache.set(key, sheetsForKey);
  }

  const cached = sheetsForKey.get(css);
  if (cached) return cached;

  const sheet = new realm.CSSStyleSheet();
  if (typeof sheet.replaceSync !== 'function') return undefined;
  sheet.replaceSync(css);
  sheetsForKey.set(css, sheet);
  return sheet;
}

function attachConstructable(root: ShadowRoot, sheet: CSSStyleSheet): (() => void) | undefined {
  const ownedRoot = root;
  try {
    const current = root.adoptedStyleSheets;
    const attachments = attachmentsByRoot.get(root);
    const attached = attachments?.get(sheet);
    if (attached) {
      attached.references += 1;
      return () => {
        attached.references -= 1;
        if (attached.references !== 0) return;
        attachments!.delete(sheet);
        if (attachments!.size === 0) attachmentsByRoot.delete(root);
        if (root.adoptedStyleSheets.includes(sheet)) {
          ownedRoot.adoptedStyleSheets = root.adoptedStyleSheets.filter((entry) => entry !== sheet);
        }
      };
    }
    if (current.includes(sheet)) return () => {};

    ownedRoot.adoptedStyleSheets = [...current, sheet];
    if (!root.adoptedStyleSheets.includes(sheet)) return undefined;

    const owned = attachments ?? new Map<CSSStyleSheet, Attachment>();
    owned.set(sheet, { references: 1 });
    attachmentsByRoot.set(root, owned);
    return () => {
      const attachment = owned.get(sheet);
      if (!attachment) return;
      attachment.references -= 1;
      if (attachment.references !== 0) return;
      owned.delete(sheet);
      if (owned.size === 0) attachmentsByRoot.delete(root);
      if (root.adoptedStyleSheets.includes(sheet)) {
        ownedRoot.adoptedStyleSheets = root.adoptedStyleSheets.filter((entry) => entry !== sheet);
      }
    };
  } catch {
    return undefined;
  }
}

function attachStyleElement(
  root: ShadowRoot,
  key: StyleKey,
  css: string,
  nonce: string | undefined,
): () => void {
  const style = root.ownerDocument.createElement('style');
  style.dataset.themeDevtoolsStyle = key;
  if (nonce !== undefined) style.nonce = nonce;
  style.textContent = css;
  root.append(style);

  if (!style.sheet) {
    style.remove();
    throw new Error(`Stylesheet is unavailable (check CSP): devtools-${key}`);
  }

  return () => { style.remove(); };
}

/** Attach immutable UI structure without sharing mutable theme-value allocations. */
export function attachStyles(
  root: ShadowRoot,
  key: StyleKey,
  css: string,
  nonce?: string,
): () => void {
  if (nonce === undefined) {
    const sheet = createConstructableSheet(root, key, css);
    if (sheet) {
      const detach = attachConstructable(root, sheet);
      if (detach) return detach;
    }
  }
  return attachStyleElement(root, key, css, nonce);
}
