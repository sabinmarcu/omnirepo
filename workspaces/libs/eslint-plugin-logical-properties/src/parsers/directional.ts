import type {
  ObjectExpression,
} from 'estree';
import type {
  Rule,
  RuleTester,
} from 'eslint';
import { runEslintTests } from '../utils/runEslintTests.js';
import type { DirectionalRuleConfig } from '../types.js';
import { isValidProperty } from '../utils/isValidProperty.js';
import {
  directionalMappingTestGenerator,
  directionalMappingTransformerFactory,
} from './directionalMapping.js';
import {
  directionalShorthandTestGenerator,
  directionalShorthandTransformerFactory,
} from './directionalShorthand.js';
import { MustDisablePropertyError } from '../utils/mustDisablePropertyError.js';
import {
  directionalShorthandMappingTestGenerator,
  directionalShorthandMappingTransformerFactory,
} from './directionalShorthandMapping.js';
import {
  directionalDisableTestGenerator,
  directionalDisableTransformerFactory,
} from './directionalDisable.js';
import { defaultFunctionNames } from '../constants.js';

export const transformDirectionalProperty = (
  node: ObjectExpression,
  context: Rule.RuleContext,
  config: DirectionalRuleConfig,
) => {
  const {
    disabled = [],
    mappings,
    shorthands = {},
    shorthandMappings = {},
  } = config;
  const toDisable = Array.isArray(disabled) ? disabled : [disabled];
  const mappingsSources = Object.keys(mappings);
  const shorthandSources = Object.keys(shorthands);
  const shorthandMappingsSources = Object.keys(shorthandMappings);
  const transformerFactoryInput = {
    node,
    context,
    config,
  };
  const directionalMappingTransformer = directionalMappingTransformerFactory(
    transformerFactoryInput,
  );
  const directionalShorthandTransformer = directionalShorthandTransformerFactory(
    transformerFactoryInput,
  );
  const directionalShorthandMappingTransformer = directionalShorthandMappingTransformerFactory(
    transformerFactoryInput,
  );
  const directionalDisableTransformer = directionalDisableTransformerFactory(
    transformerFactoryInput,
  );
  for (const property of node.properties) {
    if (isValidProperty(property)) {
      try {
        if (mappingsSources.includes(property.key.name)) {
          directionalMappingTransformer(property);
        } else if (shorthandSources.includes(property.key.name)) {
          directionalShorthandTransformer(property);
        } else if (shorthandMappingsSources.includes(property.key.name)) {
          directionalShorthandMappingTransformer(property);
        } else if (toDisable.includes(property.key.name)) {
          throw new MustDisablePropertyError();
        }
      } catch (error: unknown) {
        if (error instanceof MustDisablePropertyError) {
          directionalDisableTransformer(property);
        }
      }
    }
  }
};

export const generateDirectionalRules = (config: DirectionalRuleConfig): Rule.RuleModule => ({
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  create(context) {
    const { options } = context;
    const nodeNames = (options?.length > 0
      ? options
      : defaultFunctionNames as unknown as string[]
    );
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier'
          && nodeNames.includes(node.callee.name)
        ) {
          for (const rules of node.arguments) {
            if (rules.type === 'ArrayExpression') {
              for (const ruleSet of rules.elements) {
                if (ruleSet?.type === 'ObjectExpression') {
                  transformDirectionalProperty(
                    ruleSet,
                    context,
                    config,
                  );
                }
              }
            } else if (rules.type === 'ObjectExpression') {
              transformDirectionalProperty(rules, context, config);
            }
          }
        }
      },
    };
  },
});

export const runDirectionalRulesTests = (
  testName: string,
  rule: Rule.RuleModule,
  config: DirectionalRuleConfig,
) => {
  const functionNames = [...defaultFunctionNames, 'customStyle'] as const;
  const generatorInput = {
    testName,
    functionNames,
    config,
  };
  const mappingTests = directionalMappingTestGenerator(generatorInput);
  const shorthandTests = directionalShorthandTestGenerator(generatorInput);
  const shorthandMappingTests = directionalShorthandMappingTestGenerator(generatorInput);
  const disableTests = directionalDisableTestGenerator(generatorInput);
  const valid: Array<RuleTester.ValidTestCase> = [
    ...mappingTests.valid,
    ...shorthandTests.valid,
    ...shorthandMappingTests.valid,
    ...disableTests.valid,
  ];
  const invalid: Array<RuleTester.InvalidTestCase> = [
    ...mappingTests.invalid,
    ...shorthandTests.invalid,
    ...shorthandMappingTests.invalid,
    ...disableTests.invalid,
  ];

  runEslintTests(testName, rule, {
    valid,
    invalid,
  });
};
