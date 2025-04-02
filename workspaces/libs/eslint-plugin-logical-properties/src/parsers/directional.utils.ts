import type {
  Rule,
  RuleTester,
} from 'eslint';
import { runEslintTests } from '../utils/runEslintTests.js';
import {
  directionalMappingTestGenerator,
} from './directionalMapping.utils.js';
import {
  directionalShorthandTestGenerator,
} from './directionalShorthand.utils.js';
import {
  directionalShorthandMappingTestGenerator,
} from './directionalShorthandMapping.utils.js';
import {
  directionalDisableTestGenerator,
} from './directionalDisable.utils.js';
import {
  directionalValueTestGenerator,
} from './directionalValue.utils.js';
import {
  defaultFunctions,
  defaultJsxAttributes,
  defaultKeyframes,
  defaultResolvers,
} from '../constants.js';
import type {
  DirectionalRuleConfig,
  PluginOptions,
} from '../types.js';

export const runDirectionalRulesTests = (
  testName: string,
  rule: Rule.RuleModule,
  config: DirectionalRuleConfig,
) => {
  const functions = [...defaultFunctions, 'customStyle'] as const;
  const jsxAttributes = [...defaultJsxAttributes, 'customStyle'] as const;
  const keyframes = [...defaultKeyframes, 'customKeyframes'] as const;
  const resolvers = [...defaultResolvers, 'custom.property', 'custom.wildcard.*'] as const;
  const options = {
    functions,
    jsxAttributes,
    keyframes,
    resolvers,
  } as const satisfies PluginOptions;

  const generatorInput = {
    testName,
    options,
    config,
  };
  const mappingTests = directionalMappingTestGenerator(generatorInput);
  const shorthandTests = directionalShorthandTestGenerator(generatorInput);
  const shorthandMappingTests = directionalShorthandMappingTestGenerator(generatorInput);
  const disableTests = directionalDisableTestGenerator(generatorInput);
  const valueTests = directionalValueTestGenerator(generatorInput);

  const valid: Array<RuleTester.ValidTestCase> = [
    ...mappingTests.valid,
    ...shorthandTests.valid,
    ...shorthandMappingTests.valid,
    ...disableTests.valid,
    ...valueTests.valid,
  ];
  const invalid: Array<RuleTester.InvalidTestCase> = [
    ...mappingTests.invalid,
    ...shorthandTests.invalid,
    ...shorthandMappingTests.invalid,
    ...disableTests.invalid,
    ...valueTests.invalid,
  ];

  runEslintTests(testName, rule, {
    valid,
    invalid,
  });
};
