import { jsonOverlayStyles } from './json-overlay.styles.js';
import { attachStyles } from './styles.js';

export type JSONOverlay = {
  readonly isOpen: boolean;
  open(trigger?: HTMLElement): void;
  close(): void;
  sync(): void;
  dispose(): void;
};

type InertState = Readonly<{
  element: HTMLElement;
  inert: boolean;
}>;

let nextOverlayId = 0;

function messageFor(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : 'Unable to read the current JSON value';
}

/** Create an overlay that exposes a live JSON representation scoped to its container. */
export function createJSONOverlay(
  container: HTMLElement,
  options: {
    readonly label: string;
    readonly nonce?: string;
    read(): unknown;
    onError(message: string): void;
  },
): JSONOverlay {
  const document = container.ownerDocument;
  const shadow = container.getRootNode() as ShadowRoot;
  nextOverlayId += 1;
  const overlayId = nextOverlayId;
  const containerClass = 'theme-devtools-json-overlay-container';
  const hadContainerClass = container.classList.contains(containerClass);
  const releaseStyles = attachStyles(
    shadow,
    'json-overlay',
    jsonOverlayStyles,
    options.nonce,
  );

  const overlay = document.createElement('section');
  overlay.className = 'theme-devtools-json-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'false');

  const header = document.createElement('div');
  header.className = 'theme-devtools-json-overlay-header';

  const heading = document.createElement('h2');
  heading.className = 'theme-devtools-json-overlay-heading';
  heading.id = `theme-devtools-json-overlay-heading-${overlayId}`;
  heading.textContent = options.label;
  overlay.setAttribute('aria-labelledby', heading.id);

  const closeButton = document.createElement('button');
  closeButton.className = 'theme-devtools-json-overlay-close';
  closeButton.type = 'button';
  closeButton.textContent = 'Close';
  closeButton.setAttribute('aria-label', `Close ${options.label}`);

  header.append(heading, closeButton);

  const error = document.createElement('p');
  error.className = 'theme-devtools-json-overlay-error';
  error.id = `theme-devtools-json-overlay-error-${overlayId}`;
  error.setAttribute('role', 'alert');
  error.setAttribute('aria-atomic', 'true');
  error.hidden = true;

  const text = document.createElement('textarea');
  text.className = 'theme-devtools-json-overlay-text';
  text.readOnly = true;
  text.spellcheck = false;
  text.wrap = 'off';
  text.setAttribute('aria-label', options.label);
  text.setAttribute('aria-describedby', error.id);

  overlay.append(header, error, text);
  container.classList.add(containerClass);
  container.append(overlay);

  let disposed = false;
  let open = false;
  let trigger: HTMLElement | undefined;
  let inertSiblings: InertState[] = [];

  const restoreSiblings = (): void => {
    for (const sibling of inertSiblings) sibling.element.inert = sibling.inert;
    inertSiblings = [];
  };

  const inactivateSiblings = (): void => {
    restoreSiblings();
    inertSiblings = [...container.children]
      .filter((child): child is HTMLElement => child !== overlay
        && child.namespaceURI === 'http://www.w3.org/1999/xhtml')
      .map((element) => ({
        element,
        inert: element.inert,
      }));
    for (const sibling of inertSiblings) sibling.element.inert = true;
  };

  const clearError = (): void => {
    error.hidden = true;
    error.textContent = '';
    text.removeAttribute('aria-invalid');
  };

  const showError = (message: string): void => {
    if (text.value) text.value = '';
    error.textContent = message;
    error.hidden = false;
    text.setAttribute('aria-invalid', 'true');
    options.onError(message);
  };

  const render = (): void => {
    try {
      const json = JSON.stringify(options.read(), null, 2);
      if (json === undefined) throw new Error('Current value cannot be represented as JSON');
      clearError();
      if (text.value !== json) {
        const start = text.selectionStart;
        const end = text.selectionEnd;
        const direction = text.selectionDirection;
        const top = text.scrollTop;
        const left = text.scrollLeft;
        text.value = json;
        text.setSelectionRange(start, end, direction);
        text.scrollTop = top;
        text.scrollLeft = left;
      }
    } catch (readError) {
      showError(messageFor(readError));
    }
  };

  const restoreTriggerFocus = (): void => {
    const previousTrigger = trigger;
    trigger = undefined;
    if (previousTrigger?.isConnected) previousTrigger.focus({ preventScroll: true });
  };

  const close = (): void => {
    if (disposed || !open) return;
    open = false;
    overlay.hidden = true;
    restoreSiblings();
    restoreTriggerFocus();
  };

  const keyDown = (event: KeyboardEvent): void => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    if (event.shiftKey && shadow.activeElement === closeButton) {
      event.preventDefault();
      text.focus();
    } else if (!event.shiftKey && shadow.activeElement === text) {
      event.preventDefault();
      closeButton.focus();
    }
  };

  const openOverlay = (nextTrigger?: HTMLElement): void => {
    if (disposed) return;
    if (nextTrigger) trigger = nextTrigger;
    if (!open) {
      open = true;
      overlay.hidden = false;
      inactivateSiblings();
    }
    render();
    text.setSelectionRange(0, 0);
    text.scrollTop = 0;
    text.scrollLeft = 0;
    text.focus({ preventScroll: true });
    heading.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  };

  const sync = (): void => {
    if (disposed || !open) return;
    render();
  };

  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    open = false;
    overlay.hidden = true;
    restoreSiblings();
    trigger = undefined;
    closeButton.removeEventListener('click', close);
    overlay.removeEventListener('keydown', keyDown);
    overlay.remove();
    if (!hadContainerClass) container.classList.remove(containerClass);
    releaseStyles();
  };

  closeButton.addEventListener('click', close);
  overlay.addEventListener('keydown', keyDown);

  return {
    get isOpen(): boolean {
      return open;
    },
    open: openOverlay,
    close,
    sync,
    dispose,
  };
}
