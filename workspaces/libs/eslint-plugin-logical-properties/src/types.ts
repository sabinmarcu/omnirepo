import type {
  Rule,
  RuleTester,
} from 'eslint';
import type {
  ObjectExpression,
  Property,
} from 'estree';

export type DirectionalRuleShorthand = Array<Array<Array<string>>>;

export type DirectionalRuleConfig = {
  mappings: Record<string, string>,
  disabled?: string | string[],
  shorthands?: Record<string, DirectionalRuleShorthand>,
  shorthandMappings?: Record<string, string[]>,
};

export type ValidProperty = Property & {
  type: 'Property',
  key: {
    type: 'Identifier'
  }
};

export type DirectionalTransformer = (
  property: ValidProperty,
) => void;

export type DirectionalTransformerFactory = (input: {
  node: ObjectExpression,
  context: Rule.RuleContext,
  config: DirectionalRuleConfig,
}) => DirectionalTransformer;

export type TestInput = {
  valid: RuleTester.ValidTestCase[],
  invalid?: RuleTester.InvalidTestCase[],
} | {
  valid?: RuleTester.ValidTestCase[],
  invalid: RuleTester.InvalidTestCase[],
};

export type DirectionalTransformerTestsFactory = (input: {
  testName: string,
  functionNames: string[] | Readonly<string[]>,
  config: DirectionalRuleConfig,
}) => Required<TestInput>;
