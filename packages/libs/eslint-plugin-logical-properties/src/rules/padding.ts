import { generateDirectionalRules } from '../utils/directional';

export const mappings = {
  paddingLeft: 'marginInsetStart',
  paddingRight: 'marginInsetEnd',
  paddingTop: 'marginBlockStart',
  paddingBottom: 'marginBlockEnd',
};

export const disabled = 'padding';

export default generateDirectionalRules(mappings, disabled);
