import { explainFile } from '@/utils/files';
import { readRawContentDirectory } from '@/content/readRawContentDirectory';
import type { ReactNode } from 'react';
import { lazy } from './lazy';

export namespace Resource {
  export type Input = string | Record<string, any> | Promise<Record<string, any>> | ReactNode;
}

export class Resource {
  static resourceDirectory = '';

  static resourceFilter: (input: string) => boolean = () => true;

  static from<
    T extends new (...arguments_: any[]) => any,
  >(
    this: T,
    ...arguments_: ConstructorParameters<T>
  ): InstanceType<T> {
    return new this(...arguments_) as InstanceType<T>;
  }

  static async getList<
    T extends new (...arguments_: any[]) => any,
  >(
    this: T,
    options?: ConstructorParameters<T>[1],
  ): Promise<InstanceType<T>[]> {
    const paths = await readRawContentDirectory((this as any).resourceDirectory);
    const filteredPaths = paths.filter((path) => (this as any).resourceFilter(path));
    return filteredPaths.map((path) => (this as any).from(path, options));
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
      return pathDefinition?.filepath ?? 'unknown';
    },
  );
}
