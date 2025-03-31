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
import { MustDisablePropertyError } from '../utils/MustDisablePropertyError.js';
import {
  directionalShorthandMappingTestGenerator,
  directionalShorthandMappingTransformerFactory,
} from './directionalShorthandMapping.js';
import {
  directionalDisableTestGenerator,
  directionalDisableTransformerFactory,
} from './directionalDisable.js';
import {
  defaultFunctions,
  defaultJsxAttributes,
  defaultKeyframes,
  defaultResolvers,
} from '../constants.js';
import {
  directionalValueTestGenerator,
  directionalValueTransformerFactory,
} from './directionalValue.js';
import { configSchema } from '../config.js';
import { propertyTraverseSet } from '../utils/propertyTraverse.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';

export const transformDirectionalProperty = (
  node: ObjectExpression,
  context: Rule.RuleContext,
  config: DirectionalRuleConfig,
  resolvers: Exclude<PluginOptions['resolvers'], undefined>,
) => {
  const {
    disabled = [],
    mappings = {},
    shorthands = {},
    shorthandMappings = {},
    values = {},
  } = config;
  const toDisable = Array.isArray(disabled) ? disabled : [disabled];
  const mappingsSources = Object.keys(mappings);
  const shorthandSources = Object.keys(shorthands);
  const shorthandMappingsSources = Object.keys(shorthandMappings);
  const valueSources = Object.keys(values);
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
  const directionalValueTransformer = directionalValueTransformerFactory(
    transformerFactoryInput,
  );
  for (const property of node.properties) {
    if (isValidProperty(property)) {
      const propertyName = getValidPropertyName(property)!;
      try {
        if (mappingsSources.includes(propertyName)) {
          directionalMappingTransformer(property);
        } else if (shorthandSources.includes(propertyName)) {
          directionalShorthandTransformer(property);
        } else if (shorthandMappingsSources.includes(propertyName)) {
          directionalShorthandMappingTransformer(property);
        } else if (valueSources.includes(propertyName)) {
          directionalValueTransformer(property);
        } else if (toDisable.includes(propertyName)) {
          throw new MustDisablePropertyError();
        }
      } catch (error: unknown) {
        if (error instanceof MustDisablePropertyError) {
          directionalDisableTransformer(property);
        }
      }
    }
  }

  const resolvedObjects = propertyTraverseSet(node, resolvers);
  for (const object of resolvedObjects) {
    transformDirectionalProperty(object, context, config, resolvers);
  }
};

export const generateDirectionalRules = (config: DirectionalRuleConfig): Rule.RuleModule => ({
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [configSchema],
  },
  create(context) {
    const [options = {}] = context.options ?? [];

    const {
      functions = [],
      jsxAttributes = [],
      keyframes = [],
      resolvers = [],
    } = options as unknown as PluginOptions;
    const nodeFunctionNames = (functions?.length > 0
      ? functions
      : defaultFunctions
    );
    const nodeKeyframesNames = (keyframes?.length > 0
      ? keyframes
      : defaultKeyframes
    );
    const nodeJsxAttributesNames = (jsxAttributes?.length > 0
      ? functions
      : defaultJsxAttributes
    );
    const nodeResolvers = (resolvers?.length > 0
      ? resolvers
      : defaultResolvers
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
            nodeResolvers,
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
                    ruleSet as any,
                    context,
                    config,
                    [],
                  );
                }
              }
            } else if (rules.type === 'ObjectExpression') {
              transformDirectionalProperty(
                rules as any,
                context,
                config,
                nodeResolvers,
              );
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
                  transformDirectionalProperty(
                    property.value as any,
                    context,
                    config,
                    nodeResolvers,
                  );
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
