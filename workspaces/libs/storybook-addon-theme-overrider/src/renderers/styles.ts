import type { createStyle } from '../renderStyles.js';

export const stylesTemplate = (styles: ReturnType<typeof createStyle>) => styles.render();
