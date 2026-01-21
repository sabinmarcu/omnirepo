'use client';

import type { InputHTMLAttributes } from 'react';
import {
  controlLabelControlStyle,
  controlLabelStyle,
  controlLabelTextStyle,
  controlLabelWrapperStyle,
} from './3d-showcase.css';

export namespace ShowcaseControl {
  export type Props = (
    & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>
    & {
      onChange: (input: string) => void
      label: string,
    }
  );
}

export function ShowcaseControl({
  min,
  max,
  value,
  label,
  onChange,
  className,
  ...props
}: ShowcaseControl.Props) {
  return (
    <label className={controlLabelStyle}>
      <p className={controlLabelTextStyle}>
        <span>{label}</span>
        <span>{value}</span>
      </p>
      <div className={controlLabelWrapperStyle}>
        <span>{min}</span>
        <input
          {...props}
          type="range"
          min={min}
          max={max}
          value={value}
          className={[className, controlLabelControlStyle]
            .filter(Boolean)
            .join(' ')
          }
          onChange={({ currentTarget: { value: nextValue } }) => onChange(nextValue)}
        />
        <span>{max}</span>
      </div>
    </label>
  );
}
