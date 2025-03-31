import { paletteGenerator } from '../generators/palette.js';
import { variantContract } from '../utils/variantContract.js';

export const primaryContract = variantContract(paletteGenerator, 'primary');
export const secondaryContract = variantContract(paletteGenerator, 'secondary');

export const infoContract = variantContract(paletteGenerator, 'info');
export const successContract = variantContract(paletteGenerator, 'success');
export const warningContract = variantContract(paletteGenerator, 'warning');
export const errorContract = variantContract(paletteGenerator, 'error');
