import { attachStyles } from './styles.js';

const clipboardStyles = `
.clipboard-copy {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 1px;
  block-size: 1px;
  opacity: 0;
  pointer-events: none;
}
`;

/** Copy actual source text in the UI's owner realm, including non-Clipboard-API browsers. */
export async function copyText(root: ShadowRoot, text: string, nonce?: string): Promise<void> {
  const document = root.ownerDocument;
  const realm = document.defaultView;
  if (!realm) throw new Error('Clipboard requires an active document');
  if (realm.navigator.clipboard?.writeText) {
    try {
      await realm.navigator.clipboard.writeText(text);
      return;
    } catch {
      // A denied async clipboard may still permit a user-initiated native copy command.
    }
  }
  const textarea = document.createElement('textarea');
  textarea.className = 'clipboard-copy';
  textarea.tabIndex = -1;
  textarea.setAttribute('aria-hidden', 'true');
  textarea.value = text;
  const focused = root.activeElement;
  const detachStyles = attachStyles(root, 'clipboard', clipboardStyles, nonce);
  root.append(textarea);
  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    if (!document.execCommand('copy')) {
      throw new Error('Clipboard unavailable; select the live value or raw JSON to copy it');
    }
  } finally {
    textarea.remove();
    detachStyles();
    if (focused instanceof realm.HTMLElement && focused.isConnected) {
      focused.focus({ preventScroll: true });
    }
  }
}
