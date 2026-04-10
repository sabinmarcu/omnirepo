import { readRawContentDirectory } from '@/content/readRawContentDirectory';
import { explainFile } from '@/utils/files';
import type { ReactNode } from 'react';

export namespace Resource {
  export type Input = string | Record<string, any> | Promise<Record<string, any>> | ReactNode;
}

const stringCache = new Map<string, Resource>();
const importCache = new WeakMap<Exclude<Resource.Input, string | ReactNode>, Resource>();

export class Resource<Options extends any = any> {
  static resourceDirectory: string = '';

  static resourceFilter: (input: string) => boolean = () => true;

  static getList<
    T extends new (...arguments_: any[]) => Resource,
  >(this: T): Promise<InstanceType<T>[]> {
    return (async () => {
      const paths = await readRawContentDirectory((this as any).resourceDirectory);
      const filteredPaths = paths.filter(
        (path) => (this as any).resourceFilter(path),
      );

      const resources: InstanceType<T>[] = [];
      for (const path of filteredPaths) {
        resources.push(await (this as any).from(path) as any);
      }
      return resources;
    })();
  }

  static prepareCache<
    // eslint-disable-next-line function-paren-newline
    T extends new (...arguments_: any[]) => Resource,
  >(
    this: T,
    pathOrImport: ConstructorParameters<T>[0],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: Parameters<InstanceType<T>['prepareRead']>[0],
  ): string {
    return pathOrImport;
  }

  static async from<
    // eslint-disable-next-line function-paren-newline
    T extends new (...arguments_: any[]) => Resource,
  >(
    this: T,
    pathOrImport: ConstructorParameters<T>[0],
    options?: Parameters<InstanceType<T>['prepareRead']>[0],
  ): Promise<InstanceType<T>> {
    const cache = typeof pathOrImport === 'string'
      ? stringCache
      : importCache;

    const cacheKey: any = (this as any).prepareCache(pathOrImport, options);

    if (!cache.has(cacheKey)) {
      const resource = new this(pathOrImport);
      await resource.prepareRead(options);
      await resource.readFile();
      await resource.prepareParse(options);
      await resource.parse();
      cache.set(pathOrImport as any, resource);
    }

    return cache.get(pathOrImport as any)! as any;
  }

  protected pathOrImport: Resource.Input;

  protected get fileDefinition(): ReturnType<typeof explainFile> | undefined {
    if (typeof this.pathOrImport === 'string') {
      return explainFile(
        this.resolveFile(this.pathOrImport),
      );
    }

    return undefined;
  }

  protected rawContent: any;

  protected acceptsRelativePaths = false;

  constructor(pathOrImport: Resource.Input) {
    this.pathOrImport = pathOrImport;
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public async prepareRead(options: Options): Promise<void> {}

  // eslint-disable-next-line class-methods-use-this
  protected resolveFile(path: string) {
    return path;
  }

  protected async readFile() {
    if (typeof this.pathOrImport === 'string') {
      if (!this.acceptsRelativePaths && this.pathOrImport.startsWith('.')) {
        throw new Error(`Relative paths are unsupported directly. Please \`import('${this.pathOrImport}')\``);
      }

      const path = await this.resolveFile(this.pathOrImport);
      this.rawContent = path;
    } else {
      this.rawContent = await this.pathOrImport;
    }
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public async prepareParse(options: Options): Promise<void> {}

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  protected async parse(): Promise<void> {}

  public get id() {
    return typeof this.pathOrImport === 'string' ? this.pathOrImport : 'unknown';
  }
}
