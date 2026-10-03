export type ColorFormat = 'hex' | 'oklch' | 'hsl' | 'rgb';

// Context-dependent colors must not become a frozen color when editing their CSS.
const contextualColor = /^(?:currentcolor|inherit|initial|unset|revert(?:-layer)?|accentcolor(?:text)?|activetext|button(?:border|face|text)|canvas(?:text)?|field(?:text)?|graytext|highlight(?:text)?|linktext|mark(?:text)?|selecteditem(?:text)?|visitedtext|activeborder|activecaption|appworkspace|background|buttonhighlight|buttonshadow|captiontext|inactiveborder|inactivecaption|inactivecaptiontext|infobackground|infotext|menu|menutext|scrollbar|threeddarkshadow|threedface|threedhighlight|threedlightshadow|threedshadow|window|windowframe|windowtext)$/i;
const literalColor = /^(?:#[\da-f]+|[a-z]+|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]+\))$/i;

const decimal = (value: number): string => String(Number(value.toFixed(6)));
const clamp = (value: number): number => Math.min(1, Math.max(0, value));

/** Serialize sRGB formats, which cannot retain out-of-gamut channel values. */
export function formatSRGB(
  channels: readonly [number, number, number, number],
  format: Exclude<ColorFormat, 'oklch'>,
): string {
  const red = clamp(channels[0]);
  const green = clamp(channels[1]);
  const blue = clamp(channels[2]);
  const alpha = clamp(channels[3]);
  const opacity = alpha < 1 ? ` / ${decimal(alpha)}` : '';
  if (format === 'hex') {
    const byte = (value: number): string => Math.round(value * 255).toString(16).padStart(2, '0');
    return `#${byte(red)}${byte(green)}${byte(blue)}${alpha < 1 ? byte(alpha) : ''}`;
  }
  if (format === 'rgb') {
    return `rgb(${decimal(red * 255)} ${decimal(green * 255)} ${decimal(blue * 255)}${opacity})`;
  }
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  const lightness = (maximum + minimum) / 2;
  let hue = 0;
  let saturation = 0;
  if (delta > 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (maximum === red) hue = ((green - blue) / delta) % 6;
    else if (maximum === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue = (hue * 60 + 360) % 360;
  }
  return `hsl(${decimal(hue)} ${decimal(saturation * 100)}% ${decimal(lightness * 100)}%${opacity})`;
}

/** Use the owner browser's color conversion without resolving authored CSS expressions. */
export function createColorFormatter(
  document: Document,
): (value: string, format: ColorFormat) => string {
  let context: CanvasRenderingContext2D | null | undefined;
  return (value, format) => {
    const text = value.trim();
    const realm = document.defaultView;
    if (!realm || !literalColor.test(text) || contextualColor.test(text)
      || /\bfrom\b/i.test(text) || !realm.CSS.supports('color', text)) return value;
    context ??= document.createElement('canvas').getContext('2d');
    if (!context) throw new Error('Color formatting requires a canvas 2D context');
    const expression = format === 'oklch'
      ? `oklch(from ${text} l c h / alpha)`
      : `color(from ${text} srgb r g b / alpha)`;
    context.fillStyle = '#000000';
    context.fillStyle = expression;
    const converted = context.fillStyle;
    if (format === 'oklch' && converted.startsWith('oklch(')) return converted;
    const match = /^color\(srgb ([^/]+?)(?:\s*\/\s*([^)]+))?\)$/.exec(converted);
    if (!match || format === 'oklch') throw new Error('The browser cannot convert this color format');
    const channels = match[1]!.trim().split(/\s+/).map(Number);
    return formatSRGB([channels[0]!, channels[1]!, channels[2]!, Number(match[2] ?? 1)], format);
  };
}
