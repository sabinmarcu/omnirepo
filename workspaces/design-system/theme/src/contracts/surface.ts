import { backgroundGenerator } from '../generators/background.js';
import { variantContract } from '../utils/variantContract.js';

export const backgroundContract = variantContract(backgroundGenerator, 'background');
