import type { ESLint } from 'eslint';
import borderRule from './border.js';
import borderRadiusRule from './borderRadius.js';
import insetRule from './inset.js';
import overflowRule from './overflow.js';
import overscrollBehaviorRule from './overscrollBehavior.js';
import sizeRule from './size.js';
import marginRule from './margin.js';
import paddingRule from './padding.js';
import floatRule from './float.js';
import clearRule from './clear.js';
import textAlignRule from './textAlign.js';
import { prefixRules } from '../utils/prefixRule.js';

const rules = {
  border: borderRule,
  'border-radius': borderRadiusRule,
  inset: insetRule,
  margin: marginRule,
  overflow: overflowRule,
  'overscroll-behavior': overscrollBehaviorRule,
  padding: paddingRule,
  size: sizeRule,
  float: floatRule,
  clear: clearRule,
  textAlign: textAlignRule,
} as const satisfies ESLint.Plugin['rules'];

export const prefixedRules = prefixRules(rules);

export default rules;
