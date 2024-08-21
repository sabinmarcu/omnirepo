import type { Config } from '../types.js';
import { tryImport } from './tryImport.js';

type ConditionalConfigRequirements = [string, ...string[]];

type MapParamsToAny<T extends ConditionalConfigRequirements> = {
  [K in keyof T as T[K] & string]: any
};

type ConditionalConfigGeneratorFunction<
  T extends ConditionalConfigRequirements,
  > = (plugins: MapParamsToAny<T>) => Config[] | Promise<Config[]>;

type ParamsOfConditionalConfig<T extends [string, ...string[]]> = [
  ...T,
  () => void,
  ConditionalConfigGeneratorFunction<T>,
];

export const conditionalConfig = async <T extends [string, ...string[]]>(
  ...params: ParamsOfConditionalConfig<T>
) => {
  const pluginsToLoad: T = [] as unknown as T;
  let errorFunction: () => void;
  let generatorFunction: ConditionalConfigGeneratorFunction<T>;

  for (const [index, param] of Object.entries(params)) {
    if (typeof param !== 'string') {
      if (index === `${params.length - 1}`) {
        generatorFunction = param as any;
      } else {
        errorFunction = param as any;
      }
    } else {
      pluginsToLoad.push(param);
    }
  }

  const plugins: MapParamsToAny<T> = {} as any;
  for (const plugin of pluginsToLoad) {
    const pluginModule = await tryImport(plugin);
    if (!pluginModule) {
      // @ts-expect-error Will always be provided
      errorFunction();
      return [] satisfies Config[];
    }
    plugins[plugin as unknown as keyof typeof plugins] = pluginModule;
  }

  // @ts-expect-error Will always be provided
  return generatorFunction(plugins);
};
