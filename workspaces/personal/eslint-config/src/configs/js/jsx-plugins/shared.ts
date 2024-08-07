import { makeConfigFactory } from '../../../utils/makeConfig.js';
import { tryImport } from '../../../utils/tryImport.js';

export const makeJSXConfig = makeConfigFactory('*.jsx');

export const reactPlugin = await tryImport('eslint-plugin-react');
export const react = await tryImport('react');
