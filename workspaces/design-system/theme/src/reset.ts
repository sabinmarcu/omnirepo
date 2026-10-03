import {
  resetLayer,
  themeLayerOrder,
} from './layers.js';

/** Structural delivery is explicit at the application entry, never a token import side effect. */
export const themeResetCSS = `
@layer ${themeLayerOrder.join(', ')};
@layer ${resetLayer} {
  :is(*, *::before, *::after) { box-sizing: border-box; }
  * { margin-block: 0; margin-inline: 0; }
  @media (prefers-reduced-motion: reduce) {
    * { transform: none !important; animation: none !important; }
  }
  @media (prefers-reduced-motion: no-preference) {
    html { interpolate-size: allow-keywords; }
  }
  body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
  :is(img, picture, video, canvas, svg) { display: block; max-inline-size: 100%; }
  :is(input, button, textarea, select) { font: inherit; }
  :is(p, h1, h2, h3, h4, h5, h6) {
    overflow-wrap: break-word;
    padding-block: 0; padding-inline: 0; margin-block: 0; margin-inline: 0;
    font-size: inherit;
  }
  p { text-wrap: pretty; }
  :is(h1, h2, h3, h4, h5, h6) { text-wrap: balance; }
}
`;
