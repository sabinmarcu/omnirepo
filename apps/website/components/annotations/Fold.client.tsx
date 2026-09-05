'use client';

/* eslint-disable jsx-a11y/label-has-associated-control -- useId associates the control. */

import {
  useId,
  type ReactNode,
} from 'react';
import {
  foldContentStyle,
  foldStyle,
  foldSummaryStyle,
  foldToggleStyle,
} from './Fold.css';

export function FoldContent({ children }: { children: ReactNode }) {
  const id = useId();

  return (
    <span className={foldStyle}>
      <input
        id={id}
        type="checkbox"
        className={foldToggleStyle}
        aria-label="Expand folded code"
      />
      <label
        htmlFor={id}
        className={foldSummaryStyle}
        title="Expand folded code"
        aria-hidden="true"
      >
        ...
      </label>
      <span className={foldContentStyle}>{children}</span>
    </span>
  );
}
