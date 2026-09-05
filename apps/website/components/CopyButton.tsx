'use client';

import {
  useState,
  type MouseEvent,
} from 'react';
import {
  copyButtonStyle,
  copyIconStyle,
} from './CopyButton.css';

type Props = {
  text: string,
};

export function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.blur();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      className={copyButtonStyle}
      aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
      title={copied ? 'Copied' : 'Copy code'}
      onClick={handleClick}
    >
      <span className={copyIconStyle} aria-hidden="true">
        {copied ? '✓' : '⧉'}
      </span>
    </button>
  );
}
