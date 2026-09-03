import { globalFontFace } from '@vanilla-extract/css';

export const monoLisaCode = 'MonoLisaCode';

const faces = [
  ['0-MonoLisaCode-normal.woff2', 'normal', 'U+0020-007F'],
  ['1-MonoLisaCode-italic.woff2', 'italic', 'U+0020-007F'],
  ['2-MonoLisaCode-normal.woff2', 'normal', 'U+0080-00FF'],
  ['3-MonoLisaCode-italic.woff2', 'italic', 'U+0080-00FF'],
  ['4-MonoLisaCode-normal.woff2', 'normal', 'U+0100-017F'],
  ['5-MonoLisaCode-italic.woff2', 'italic', 'U+0100-017F'],
  ['6-MonoLisaCode-normal.woff2', 'normal', 'U+0180-024F'],
  ['7-MonoLisaCode-italic.woff2', 'italic', 'U+0180-024F'],
] as const;

for (const [file, fontStyle, unicodeRange] of faces) {
  globalFontFace(monoLisaCode, {
    src: `url('/fonts/monolisa-code/${file}') format('woff2')`,
    fontWeight: '1 900',
    fontStyle,
    unicodeRange,
    fontDisplay: 'swap',
  });
}
