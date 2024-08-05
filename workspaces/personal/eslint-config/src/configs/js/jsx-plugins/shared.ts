import { makeConfigFactory } from '../../../utils/makeConfig';
import { tryImport } from '../../../utils/tryImport';

export const makeJSXConfig = makeConfigFactory('*.jsx');

export const reactPlugin = await tryImport('eslint-plugin-react');
export const react = await tryImport('react');
