import { gridGenerator } from '../generators/grid.js';
import { rawContract } from '../utils/rawContract.js';

export const gridContract = rawContract(gridGenerator(3), 'grid');
