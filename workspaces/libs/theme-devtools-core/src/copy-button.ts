export type CopyState = 'copied' | 'failed';

export type CopyButton = {
  readonly element: HTMLButtonElement;
  /** Flash the outcome on the button; a repeated outcome restarts its animation. */
  show(state: CopyState): void;
  /** Return to the idle label immediately. */
  reset(): void;
};

type CopyButtonOptions = {
  readonly label: string;
  readonly className: string;
  readonly ariaLabel?: string;
  readonly copiedText?: string;
  readonly failedText?: string;
};

const feedbackDuration: Record<CopyState, number> = {
  copied: 1600,
  failed: 2600,
};

/**
 * Copy button whose idle label and outcome feedback share one grid cell, so feedback never
 * shifts layout. The feedback is decorative (`aria-hidden`); callers still announce outcomes
 * through their own live regions.
 */
export function createCopyButton(document: Document, options: CopyButtonOptions): CopyButton {
  const realm = document.defaultView;
  if (!realm) throw new Error('Copy buttons require an active document');
  const element = document.createElement('button');
  element.type = 'button';
  element.className = `${options.className} copy-action`;
  if (options.ariaLabel !== undefined) element.setAttribute('aria-label', options.ariaLabel);
  const label = document.createElement('span');
  label.className = 'copy-label';
  label.textContent = options.label;
  const feedback = document.createElement('span');
  feedback.className = 'copy-feedback';
  feedback.setAttribute('aria-hidden', 'true');
  element.append(label, feedback);

  let timer: number | undefined;
  const reset = () => {
    if (timer !== undefined) realm.clearTimeout(timer);
    timer = undefined;
    Reflect.deleteProperty(element.dataset, 'copyState');
  };
  return Object.freeze({
    element,
    show(state: CopyState) {
      reset();
      // Flush the idle style so a repeated outcome replays its keyframes.
      element.getBoundingClientRect();
      feedback.textContent = state === 'copied'
        ? options.copiedText ?? 'Copied'
        : options.failedText ?? 'Copy failed';
      element.dataset.copyState = state;
      timer = realm.setTimeout(reset, feedbackDuration[state]);
    },
    reset,
  });
}
