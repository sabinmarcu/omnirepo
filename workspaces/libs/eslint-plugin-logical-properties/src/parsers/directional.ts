import type {
  ObjectExpression,
} from 'estree';
import type {
  Rule,
} from 'eslint';
import type {
  DirectionalRuleConfig,
  PluginOptions,
} from '../types.js';
import { isValidProperty } from '../utils/isValidProperty.js';
import {
  directionalMappingTransformerFactory,
} from './directionalMapping.js';
import {
  directionalShorthandTransformerFactory,
} from './directionalShorthand.js';
import { MustDisablePropertyError } from '../utils/MustDisablePropertyError.js';
import {
  directionalShorthandMappingTransformerFactory,
} from './directionalShorthandMapping.js';
import {
  directionalDisableTransformerFactory,
} from './directionalDisable.js';
import {
  defaultFunctions,
  defaultJsxAttributes,
  defaultKeyframes,
  defaultResolvers,
  rulePrefix,
} from '../constants.js';
import {
  directionalValueTransformerFactory,
} from './directionalValue.js';
import { configSchema } from '../config.js';
import { propertyTraverseSet } from '../utils/propertyTraverse.js';
import { getValidPropertyName } from '../utils/getValidPropertyName.js';

const getOptional = (
  input: string[] | Readonly<string[]> | undefined,
  fallback: string[] | Readonly<string[]>,
): string[] => ((input && input.length > 0) ? [...input] : [...fallback]);

const isTargetJsxAttribute = (
  node: unknown,
  names: string[],
): node is {
  type: 'JSXAttribute'
  name: {
    type: 'JSXIdentifier'
    name: string,
  }
  value: {
    type: 'JSXExpressionContainer'
    expression: unknown,
  }
} => (
  typeof node === 'object'
  && node !== null
  && 'type' in node
  && node.type === 'JSXAttribute'
  && 'name' in node
  && !!node.name
  && typeof node.name === 'object'
  && node.name !== null
  && 'type' in node.name
  && node.name.type === 'JSXIdentifier'
  && 'name' in node.name
  && typeof node.name.name === 'string'
  && names.includes(node.name.name)
  && 'value' in node
  && !!node.value
  && typeof node.value === 'object'
  && node.value !== null
  && 'type' in node.value
  && node.value.type === 'JSXExpressionContainer'
  && 'expression' in node.value
  && typeof node.value.expression === 'object'
  && node.value.expression !== null
  && 'type' in node.value.expression
  && node.value.expression.type === 'ObjectExpression'
);

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
    shorthandPairMappings = {},
    shorthandMappings = {},
    values = {},
  } = config;
  const toDisable = Array.isArray(disabled) ? disabled : [disabled];
  const mappingsSources = Object.keys(mappings);
  const shorthandSources = Object.keys(shorthands);
  const shorthandPairMappingsSources = Object.keys(shorthandPairMappings);
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
        } else if (
          shorthandSources.includes(propertyName)
          || shorthandPairMappingsSources.includes(propertyName)
        ) {
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
    const [ruleOptions = {}] = context.options ?? [];
    const settings = ((context.settings?.[rulePrefix] ?? {}) as PluginOptions);
    const options = ruleOptions as PluginOptions;

    const nodeFunctionNames = getOptional(
      options.functions,
      getOptional(settings.functions, defaultFunctions),
    );
    const nodeKeyframesNames = getOptional(
      options.keyframes,
      getOptional(settings.keyframes, defaultKeyframes),
    );
    const nodeJsxAttributesNames = getOptional(
      options.jsxAttributes,
      getOptional(settings.jsxAttributes, defaultJsxAttributes),
    );
    const nodeResolvers = getOptional(
      options.resolvers,
      getOptional(settings.resolvers, defaultResolvers),
    );
    return {
      JSXAttribute(node: unknown) {
        if (isTargetJsxAttribute(node, nodeJsxAttributesNames)) {
          transformDirectionalProperty(
            node.value.expression as ObjectExpression,
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
                    ruleSet as unknown as ObjectExpression,
                    context,
                    config,
                    [],
                  );
                }
              }
            } else if (rules.type === 'ObjectExpression') {
              transformDirectionalProperty(
                rules as unknown as ObjectExpression,
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
                    property.value as unknown as ObjectExpression,
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
