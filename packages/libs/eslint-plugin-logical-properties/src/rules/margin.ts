import { generateDirectionalRules } from '../utils/directional';

export const mappings = {
  marginLeft: 'marginInsetStart',
  marginRight: 'marginInsetEnd',
  marginTop: 'marginBlockStart',
  marginBottom: 'marginBlockEnd',
};

export const disabled = 'margin';

export default generateDirectionalRules(mappings, disabled);
