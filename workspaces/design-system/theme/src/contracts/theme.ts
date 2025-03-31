import { createThemeContract } from '../utils/themeContract.js';
import { gridContract } from './grid.js';
import {
  errorContract,
  infoContract,
  primaryContract,
  secondaryContract,
  successContract,
  warningContract,
} from './palette.js';
import { backgroundContract } from './surface.js';

export const [themeContract, setupTheme, themeRaw] = createThemeContract({
  colors: {
    primary: primaryContract,
    secondary: secondaryContract,
    info: infoContract,
    success: successContract,
    warning: warningContract,
    error: errorContract,
    background: backgroundContract,
  },
  grid: gridContract,
});
