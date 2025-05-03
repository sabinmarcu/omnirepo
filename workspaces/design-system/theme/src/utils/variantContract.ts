import {
  createGlobalTheme,
} from '@vanilla-extract/css';
import {
  rootNode,
  themeDataAttribute,
  themeVariants,
} from '../constants.js';
import type {
  ThemeGenerator,
  TypeOfThemeGenerator,
} from '../generators/types.js';
import { rawContract } from './rawContract.js';
import { themeVariantsLayer } from '../styles/layers.js';
import type { UpdaterFunction } from './types.js';
import type {
  UpdaterInputOfVariantContract,
  UpdaterInputOfVariantContractVariants,
  UpdatersOfVariantContract,
} from './variantContract.type.js';
import {
  prefixCache,
  prefixValueCache,
} from './prefixCache.js';

const inputHasVariants = <
  const Generator extends ThemeGenerator<any>,
  const Prefix extends string = '',
>(
    input: UpdaterInputOfVariantContract<Generator, Prefix>[0],
  ): input is UpdaterInputOfVariantContractVariants<Generator, Prefix> => (
    typeof input === 'object'
  && themeVariants.every((variant) => variant in input)
  );

export function selectorOfVariant(variant: typeof themeVariants[number]) {
  return `[data-${themeDataAttribute}="${variant}"]`;
}

export function variantContract<
  const Generator extends ThemeGenerator<any>,
  const Prefix extends string = '',
>(
  generator: Generator,
  prefix: Prefix,
  defaultValue: TypeOfThemeGenerator<Generator> = '#ffff' as any,
) {
  const [rootContract] = rawContract(generator, prefix, defaultValue);
  const variants: Record<typeof themeVariants[number], typeof rootContract> = {} as any;

  const updaters: UpdatersOfVariantContract<Generator, Prefix> = {} as any;

  for (const variant of themeVariants) {
    const variantPrefix = [prefix, variant].join('-');
    const [
      contractOfVariant,
      updateContractOfVariant,
    ] = rawContract(generator, variantPrefix, defaultValue);
    variants[variant] = contractOfVariant;
    updaters[variant] = updateContractOfVariant;
  }
  const lightDarkValues: Parameters<typeof createGlobalTheme>[2] = {} as any;
  for (const key of Object.keys(rootContract)) {
    (lightDarkValues as any)[key] = `light-dark(${
      themeVariants
        .map((variant) => variants[variant][key])
        .join(', ')
    })`;
  }

  const contractCache = prefixCache(rootContract);
  const contractValuesCache = prefixValueCache(lightDarkValues);
  const contractVariantValuesCaches = {
    light: prefixValueCache(variants['light'] as any),
    dark: prefixValueCache(variants['dark'] as any),
  } satisfies Record<typeof themeVariants[number], ReturnType<typeof prefixValueCache>>;
  const updateVariants: UpdaterFunction<
    Record<
      typeof themeVariants[number],
      Parameters<typeof updaters[typeof themeVariants[number]]>[0]
    > | Parameters<typeof updaters[typeof themeVariants[number]]>[0]
  > = (
    values,
    selector = rootNode,
    updateFunction = createGlobalTheme,
    variantPrefix?: string,
  ) => {
    const prefixedContract = contractCache(variantPrefix);

    const prefixedLightDarkValues = contractValuesCache(variantPrefix);
    updateFunction(selector, {
      '@layer': themeVariantsLayer,
      ...prefixedContract,
    }, {
      '@layer': themeVariantsLayer,
      ...prefixedLightDarkValues,
    } as any);

    for (const variant of themeVariants) {
      let valuesToRender: Parameters<typeof updaters[typeof variant]>[0];
      if (inputHasVariants(values)) {
        const { [variant]: variantValues } = values;
        valuesToRender = variantValues;
      } else {
        valuesToRender = values;
      }

      const prefixedVariant = contractVariantValuesCaches[variant](variantPrefix);
      updateFunction(selectorOfVariant(variant), {
        '@layer': themeVariantsLayer,
        ...prefixedContract,
      }, {
        '@layer': themeVariantsLayer,
        ...prefixedVariant,
      } as any);

      updaters[variant](valuesToRender, selector, updateFunction, variantPrefix);
    }
  };

  return [rootContract, updateVariants, prefix] as const;
}
