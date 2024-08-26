import type {
  ObjectExpression,
} from 'estree';
import type {
  Rule,
  RuleTester,
} from 'eslint';
import { runEslintTests } from '../utils/runEslintTests.js';
import type {
  DirectionalRuleConfig,
  PluginOptions,
} from '../types.js';
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
import {
  configSchema,
  defaultFunctions,
  defaultJsxAttributes,
  defaultKeyframes,
} from '../constants.js';

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
    schema: [configSchema],
  },
  create(context) {
    const { options } = context as unknown as { options: [ PluginOptions ] };

    const [{
      functions, jsxAttributes, keyframes,
    }] = options;
    const nodeFunctionNames = (functions?.length > 0
      ? functions
      : defaultFunctions as unknown as string[]
    );
    const nodeKeyframesNames = (keyframes?.length > 0
      ? keyframes
      : defaultKeyframes as unknown as string[]
    );
    const nodeJsxAttributesNames = (jsxAttributes?.length > 0
      ? functions
      : defaultJsxAttributes as unknown as string[]
    );
    return {
      JSXAttribute(node: any) {
        if (
          node.type === 'JSXAttribute'
          && node.name.type === 'JSXIdentifier'
          && nodeJsxAttributesNames.includes(node.name.name)
          && node.value.type === 'JSXExpressionContainer'
          && node.value.expression.type === 'ObjectExpression'
        ) {
          transformDirectionalProperty(
            node.value.expression,
            context,
            config,
          );
        }
      },
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier'
          && nodeFunctionNames.includes(node.callee.name)
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
        } else if (
          node.callee.type === 'Identifier'
          && nodeKeyframesNames.includes(node.callee.name)
        ) {
          for (const argument of node.arguments) {
            if (argument.type === 'ObjectExpression') {
              for (const property of argument.properties) {
                if (
                  property.type === 'Property'
                  && property.value.type === 'ObjectExpression'
                ) {
                  transformDirectionalProperty(property.value, context, config);
                }
              }
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
  const functions = [...defaultFunctions, 'customStyle'] as const;
  const jsxAttributes = [...defaultJsxAttributes, 'customStyle'] as const;
  const keyframes = [...defaultKeyframes, 'customKeyframes'] as const;
  const options = {
    functions,
    jsxAttributes,
    keyframes,
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
