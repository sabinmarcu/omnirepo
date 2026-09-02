import type { ReactNode } from 'react';
import { explainFile } from '@/utils/files';
import { readRawContentDirectory } from '@/content/readRawContentDirectory';
import {
  defaultLocale,
} from '@/i18n/domains';
import {
  isLocale,
  type Locale,
} from '@/i18n/locales';
import { lazy } from './lazy';

export namespace Resource {
  export type Input = string | Record<string, any> | Promise<Record<string, any>> | ReactNode;
}

export class Resource {
  static resourceDirectory = '';

  static translatable = true;

  static resourceFilter: (input: string) => boolean = () => true;

  static from<
    T extends new (
      ...arguments_: any[]) => any,
  >(
    this: T,
    ...arguments_: ConstructorParameters<T>
  ): InstanceType<T> {
    return new this(...arguments_) as InstanceType<T>;
  }

  static async getList<
    T extends new (
      ...arguments_: any[]) => any,
  >(
    this: T,
    options?: ConstructorParameters<T>[1],
  ): Promise<InstanceType<T>[]> {
    const paths = await readRawContentDirectory((this as any).resourceDirectory);
    const filteredPaths = paths.filter((path) => (this as any).resourceFilter(path));
    return filteredPaths.map((path) => (this as any).from(path, options));
  }

  static async getLocalizedList<
    T extends new (
      ...arguments_: any[]) => any,
  >(
    this: T,
    locale: string = defaultLocale,
  ): Promise<InstanceType<T>[]> {
    const requestedLocale = isLocale(locale) ? locale : defaultLocale;
    const list = await (this as any).getList() as InstanceType<T>[];
    const resourcesById = new Map<string, InstanceType<T>>();

    for (const item of list) {
      const resource = item as Resource;
      const id = await resource.id;
      const existing = resourcesById.get(id) as Resource | undefined;

      if (
        !existing
        || await resource.locale === requestedLocale
        || (await existing.locale !== requestedLocale && await resource.locale === defaultLocale)
      ) {
        resourcesById.set(id, item);
      }
    }

    return [...resourcesById.values()];
  }

  static async fromId<
    T extends new (
      ...arguments_: any[]) => any,
  >(
    this: T,
    id: string,
    locale: string = defaultLocale,
  ): Promise<InstanceType<T> | undefined> {
    const requestedLocale = isLocale(locale) ? locale : defaultLocale;
    const list = await (this as any).getList() as InstanceType<T>[];
    let fallback: InstanceType<T> | undefined;

    for (const item of list) {
      const resource = item as Resource;
      if (await resource.id !== id) {
        continue;
      }
      if (await resource.locale === requestedLocale) {
        return item;
      }
      if (await resource.locale === defaultLocale) {
        fallback = item;
      }
    }

    return fallback;
  }

  static async getVariants<
    T extends new (
      ...arguments_: any[]) => any,
  >(
    this: T,
    id: string,
  ): Promise<InstanceType<T>[]> {
    const list = await (this as any).getList() as InstanceType<T>[];
    const variants: InstanceType<T>[] = [];

    for (const item of list) {
      if (await (item as Resource).id === id) {
        variants.push(item);
      }
    }

    return variants;
  }

  constructor(protected pathOrImport: Resource.Input) {}

  // eslint-disable-next-line class-methods-use-this
  protected async resolveInputFile(path: string) {
    return path;
  }

  rawInput = lazy(
    async () => {
      if (typeof this.pathOrImport === 'string') {
        return this.resolveInputFile(this.pathOrImport);
      }
      return this.pathOrImport;
    },
  );

  pathDefinition = lazy(
    async () => {
      const rawInput = await this.rawInput;
      if (typeof rawInput === 'string') {
        return explainFile(rawInput);
      }
      return undefined;
    },
  );

  public id = lazy(
    async () => {
      const pathDefinition = await this.pathDefinition;
      return pathDefinition?.id ?? 'unknown';
    },
  );

  public locale = lazy<Locale>(
    async () => (await this.pathDefinition)?.locale ?? defaultLocale,
  );

  variants = lazy<Resource[]>(
    async () => (this.constructor as typeof Resource).getVariants(await this.id),
  );

  availableLocales = lazy<Locale[]>(
    async () => Promise.all((await this.variants).map((variant) => variant.locale)),
  );

  async isFallbackFor(locale: string) {
    return (
      (this.constructor as typeof Resource).translatable
      && isLocale(locale)
      && locale !== defaultLocale
      && await this.locale === defaultLocale
    );
  }
}
