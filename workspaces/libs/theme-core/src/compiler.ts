import {
  isExpression,
  isSource,
} from './descriptors.js';
import type {
  BoundSource,
  BoundToken,
  CompiledSource,
  CompiledTheme,
  CompiledToken,
  Expression,
  Reference,
  SourceTree,
  Theme,
  ThemeContract,
  ThemeSchema,
  TokenTree,
  ValidSchema,
  VariableContract,
  VariableDescriptor,
} from './types.js';

type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
  | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type PrefixCharacters<Value extends string> = Value extends '' ? unknown
  : Value extends `${Letter | Digit | '-'}${infer Rest}` ? PrefixCharacters<Rest> : never;
type ValidPrefix<Prefix extends string> = string extends Prefix ? unknown
  : Prefix extends `${Letter}${string}`
    ? Prefix extends `${string}--${string}` | `${string}-` ? never : PrefixCharacters<Prefix>
    : never;

const validateKey = (key: string) => {
  if (!/^[a-zA-Z][a-zA-Z\d-]*$/.test(key)
    || ['constructor', 'prototype'].includes(key)) throw new Error(`Invalid theme path: ${key}`);
};
const nameOf = (path: readonly string[]) => path.join('-');
const keyOf = (role: Reference['role'], path: readonly string[]) => JSON.stringify([role, ...path]);

function compileDefinition<const Schema extends ThemeSchema>(
  schema: Schema,
): CompiledTheme<Schema> {
  const sources: CompiledSource[] = [];
  const tokens: CompiledToken[] = [];
  const allocatedNames = new Set<string>();
  const allocate = (name: string) => {
    if (allocatedNames.has(name)) throw new Error(`Theme allocation name collision: ${name}`);
    allocatedNames.add(name);
  };
  const compileVariable = (descriptor: VariableDescriptor, path: readonly string[]) => {
    const generatorPath = Object.freeze([...path]);
    const localNames = new Map<string, string>();
    const collectSources = (tree: SourceTree, inputPath: readonly string[]) => {
      if (isSource(tree)) {
        const add = (variant?: 'light' | 'dark') => {
          const symbolPath = variant ? [...inputPath, variant] : inputPath;
          const name = nameOf(['source', ...path, ...symbolPath]);
          allocate(name);
          localNames.set(keyOf('source', symbolPath), name);
          sources.push(Object.freeze({
            role: 'source',
            scope: descriptor.scope,
            generatorPath,
            path: Object.freeze([...path, ...inputPath]),
            name,
            descriptor: tree,
            variant,
          }));
        };
        if (tree.kind === 'variant-source') { add('light'); add('dark'); } else add();
      } else {
        for (const [key, child] of Object.entries(tree)) {
          validateKey(key);
          collectSources(child, [...inputPath, key]);
        }
      }
    };
    collectSources(descriptor.sources, []);
    const output: {
      expression: Expression; path: readonly string[]; name: string;
      visibility: 'public' | 'private';
    }[] = [];
    const collectTokens = (tree: TokenTree, outputPath: readonly string[], role: 'token' | 'private') => {
      if (isExpression(tree)) {
        const name = nameOf(role === 'token'
          ? [...path, ...outputPath]
          : ['private', ...path, ...outputPath]);
        allocate(name);
        localNames.set(keyOf(role, outputPath), name);
        output.push({
          expression: tree,
          path: [...path, ...outputPath],
          name,
          visibility: role === 'private' ? 'private' : 'public',
        });
      } else {
        for (const [key, child] of Object.entries(tree)) {
          validateKey(key);
          collectTokens(child, [...outputPath, key], role);
        }
      }
    };
    collectTokens(descriptor.tokens, [], 'token');
    if (descriptor.privateTokens) collectTokens(descriptor.privateTokens, [], 'private');
    for (const entry of output) {
      const references: { reference: Reference; name: string }[] = [];
      const dependencies = new Set<string>();
      const visit = (expression: Expression) => {
        switch (expression.kind) {
          case 'reference': {
            if (expression.owner !== descriptor.owner) throw new Error('Foreign generator reference');
            const name = localNames.get(keyOf(expression.role, expression.path));
            if (!name) throw new Error(`Unknown theme reference: ${expression.path.join('.')}`);
            references.push(Object.freeze({
              reference: expression,
              name,
            }));
            dependencies.add(name);

            break;
          }
          case 'property-name': {
            visit(expression.reference);
            break;
          }
          case 'registered': {
            visit(expression.expression);
            break;
          }
          default: { for (const part of expression.parts) if (typeof part !== 'string') visit(part);
          }
        }
      };
      visit(entry.expression);
      tokens.push(Object.freeze({
        role: 'derived',
        scope: descriptor.scope,
        generatorPath,
        ...entry,
        path: Object.freeze(entry.path),
        references: Object.freeze(references),
        dependencies: Object.freeze([...dependencies]),
        registration: entry.expression.kind === 'registered' ? entry.expression.registration : undefined,
      }));
    }
  };
  const copySchema = (group: ThemeSchema, path: readonly string[]): ThemeSchema => Object.freeze(
    Object.fromEntries(Object.entries(group).map(([key, node]) => {
      validateKey(key);
      if (!node || typeof node !== 'object') throw new Error(`Invalid theme descriptor: ${key}`);
      if (node.kind === 'variable') {
        compileVariable(node as VariableDescriptor, [...path, key]);
        return [key, node];
      }
      if (node.kind === 'static') return [key, node];
      return [key, copySchema(node as ThemeSchema, [...path, key])];
    })),
  );
  const ownedSchema = copySchema(schema, []) as Schema;
  const graph = new Map(tokens.map((token) => [token.name, token]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const checkCycle = (name: string) => {
    if (visited.has(name)) return;
    if (visiting.has(name)) throw new Error(`Cyclic theme dependency: ${name}`);
    visiting.add(name);
    for (const dependency of graph.get(name)?.dependencies ?? []) {
      if (graph.has(dependency)) checkCycle(dependency);
    }
    visiting.delete(name);
    visited.add(name);
  };
  for (const token of tokens) checkCycle(token.name);
  return Object.freeze({
    schema: ownedSchema,
    sources: Object.freeze(sources),
    tokens: Object.freeze(tokens),
  });
}

export function compileTheme<const Schema extends ThemeSchema>(
  schema: Schema & ValidSchema<Schema>,
): CompiledTheme<Schema> {
  return compileDefinition<Schema>(schema);
}

/** Compile additions already checked at the composition boundary. */
export function compileThemeExtension<const Schema extends ThemeSchema>(
  schema: Schema,
): CompiledTheme<Schema> {
  return compileDefinition(schema);
}

export function bindTheme<
  const Schema extends ThemeSchema,
  const Prefix extends string = 'theme',
>(
  definition: CompiledTheme<Schema>,
  options: { readonly prefix?: Prefix & ValidPrefix<Prefix> } = {},
): Theme<Schema, Prefix> {
  const prefix = options.prefix ?? 'theme' as Prefix;
  if (!/^[a-z][a-z\d]*(?:-[a-z\d]+)*$/.test(prefix)) throw new Error(`Invalid theme prefix: ${prefix}`);
  const variableName = (name: string): `--${Prefix}-${string}` => `--${prefix}-${name}`;
  const sources: BoundSource<Prefix>[] = definition.sources.map((source) => Object.freeze({
    ...source,
    name: variableName(source.name),
  }));
  const tokens: BoundToken<Prefix>[] = definition.tokens.map((token) => {
    const render = (expression: Expression): string => {
      if (expression.kind === 'reference') {
        const { name } = (token.references.find((entry) => entry.reference === expression)!);
        return `var(${variableName(name)})`;
      }
      if (expression.kind === 'property-name') {
        const { name } = token.references.find(
          (entry) => entry.reference === expression.reference,
        )!;
        return variableName(name);
      }
      if (expression.kind === 'registered') return render(expression.expression);
      return expression.parts.map((part) => (typeof part === 'string' ? part : render(part))).join('');
    };
    return Object.freeze({
      role: 'derived',
      scope: token.scope,
      generatorPath: token.generatorPath,
      visibility: token.visibility,
      name: variableName(token.name),
      path: token.path,
      value: render(token.expression),
      dependencies: Object.freeze(token.dependencies.map(variableName)),
      registration: token.registration,
    });
  });
  const view = (tree: TokenTree, path: readonly string[]): unknown => (isExpression(tree)
    ? `var(${variableName(nameOf(path))})`
    : Object.freeze(Object.fromEntries(Object.entries(tree).map(
      ([key, child]) => [key, view(child, [...path, key])],
    ))));
  const contracts = (group: ThemeSchema, path: readonly string[]) => {
    const contract: Record<string, unknown> = {};
    const variables: Record<string, unknown> = {};
    for (const [key, node] of Object.entries(group)) {
      if (node.kind === 'static') contract[key] = node.output;
      else if (node.kind === 'variable') {
        contract[key] = view((node as VariableDescriptor).tokens, [...path, key]);
        variables[key] = contract[key];
      } else {
        const child = contracts(node as ThemeSchema, [...path, key]);
        contract[key] = child.contract;
        if (Object.keys(child.variables).length > 0) variables[key] = child.variables;
      }
    }
    return {
      contract: Object.freeze(contract),
      variables: Object.freeze(variables),
    };
  };
  const { contract, variables } = contracts(definition.schema, []);
  return Object.freeze({
    prefix,
    definition,
    contract: contract as ThemeContract<Schema, Prefix>,
    variables: variables as VariableContract<Schema, Prefix>,
    sources: Object.freeze(sources),
    tokens: Object.freeze(tokens),
  });
}

export function defineTheme<
  const Schema extends ThemeSchema,
  const Prefix extends string = 'theme',
>(
  schema: Schema & ValidSchema<Schema>,
  options: { readonly prefix?: Prefix & ValidPrefix<Prefix> } = {},
) {
  return bindTheme<Schema, Prefix>(compileDefinition<Schema>(schema), options);
}
