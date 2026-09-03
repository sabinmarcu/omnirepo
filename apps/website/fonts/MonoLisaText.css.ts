import { globalFontFace } from '@vanilla-extract/css';

export const monoLisaText = 'MonoLisaText';

const faces = [
  ['0-MonoLisaText-normal.woff2', 'normal', 'U+0020-007F'],
  ['1-MonoLisaText-italic.woff2', 'italic', 'U+0020-007F'],
  ['2-MonoLisaText-normal.woff2', 'normal', 'U+0080-00FF'],
  ['3-MonoLisaText-italic.woff2', 'italic', 'U+0080-00FF'],
  ['4-MonoLisaText-normal.woff2', 'normal', 'U+0100-017F'],
  ['5-MonoLisaText-italic.woff2', 'italic', 'U+0100-017F'],
  ['6-MonoLisaText-normal.woff2', 'normal', 'U+0180-024F'],
  ['7-MonoLisaText-italic.woff2', 'italic', 'U+0180-024F'],
] as const;

for (const [file, fontStyle, unicodeRange] of faces) {
  globalFontFace(monoLisaText, {
    src: `url('/fonts/monolisa-text/${file}') format('woff2')`,
    fontWeight: '1 900',
    fontStyle,
    unicodeRange,
    fontDisplay: 'swap',
  });
}
