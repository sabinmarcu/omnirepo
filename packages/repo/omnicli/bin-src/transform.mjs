/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */

import url from 'node:url';
import path from 'node:path';
import { TransformImportMetaPlugin } from './transformImportMetaPlugin.mjs';

const { transformSync } = await import('@babel/core');

const { default: transformModulesCommonjs } = await import('@babel/plugin-transform-modules-commonjs');
const { default: dynamicImportNode } = await import('babel-plugin-dynamic-import-node');
const { default: syntaxClassProperties } = await import('@babel/plugin-syntax-class-properties');
const { default: proposalExportNamespaceFrom } = await import('@babel/plugin-proposal-export-namespace-from');
const { default: transformTypescript } = await import('@babel/plugin-transform-typescript');
const { default: proposalDecorators } = await import('@babel/plugin-proposal-decorators');
const { default: parameterDecorator } = await import('babel-plugin-parameter-decorator');
const { default: nullishCoalescingOperator } = await import('@babel/plugin-proposal-nullish-coalescing-operator');
const { default: optionalChaining } = await import('@babel/plugin-proposal-optional-chaining');

const { default: moduleRewrite } = await import('babel-plugin-module-rewrite');
const fileName = url.fileURLToPath(import.meta.url);
const replaceFunction = path.resolve(
  path.dirname(fileName),
  './replaceImport.cjs',
);

export function transform(options) {
  const localOptions = {
    babelrc: false,
    configFile: false,
    compact: false,
    retainLines:
      typeof options.retainLines === 'boolean' ? options.retainLines : true,
    filename: '',
    cwd: '/',
    ...options.babel,
    plugins: [
      [moduleRewrite, {
        replaceFunc: replaceFunction,
      }],
      [
        transformModulesCommonjs,
        { allowTopLevelThis: true },
      ],
      [dynamicImportNode, { noInterop: true }],
      [TransformImportMetaPlugin, { filename: options.filename }],
      [syntaxClassProperties],
      [proposalExportNamespaceFrom],
    ],
  };

  if (options.ts) {
    localOptions.plugins.push([
      transformTypescript,
      { allowDeclareFields: true },
    ]);
    // `unshift` because this plugin must come before `@babel/plugin-syntax-class-properties`
    localOptions.plugins.unshift([
      proposalDecorators,
      { legacy: true },
    ]);
    localOptions.plugins.push(parameterDecorator);
  }

  if (options.legacy) {
    localOptions.plugins.push(
      nullishCoalescingOperator,
      optionalChaining,
    );
  }

  if (options.babel && Array.isArray(options.babel.plugins)) {
    localOptions.plugins?.push(...options.babel.plugins);
  }

  try {
    return {
      code: transformSync(options.source, localOptions)?.code || '',
    };
  } catch (error) {
    return {
      error,
      code:
        `exports.__JITI_ERROR__ = ${
          JSON.stringify({
            filename: options.filename,
            line: error.loc?.line || 0,
            column: error.loc?.column || 0,
            code: error.code
              ?.replace('BABEL_', '')
              .replace('PARSE_ERROR', 'ParseError'),
            message: error.message?.replace('/: ', '').replace(/\(.+\)\s*$/, ''),
          })}`,
    };
  }
}
