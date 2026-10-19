import { theme } from '@sabinmarcu/website-theme';
import {
  swatchesStyle,
  swatchSampleStyle,
  swatchStyle,
} from './SlideMdx.css';

const samples = [
  ['primary.base', theme.colors.primary.base],
  ['background.page', theme.colors.background.page],
  ['secondary.base', theme.colors.secondary.base],
] as const;

export function SlideSwatches() {
  return (
    <div className={swatchesStyle}>
      {samples.map(([name, color]) => (
        <figure key={name} className={swatchStyle}>
          <span className={swatchSampleStyle} style={{ background: color }} aria-hidden="true" />
          <figcaption><code>{name}</code></figcaption>
        </figure>
      ))}
    </div>
  );
}
