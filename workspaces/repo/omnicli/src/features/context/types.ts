import type {
  Readable,
  Writable,
} from 'node:stream';

// Taken directly from clipanion, since imports don't seem to work
type BaseContext = {
  env: Record<string, string | undefined>;
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
  colorDepth: number;
};

export interface ContextWithCwd extends BaseContext {
  cwd: string
}

export interface ContextWithRootDirectory extends BaseContext {
  rootDirectory: string;
}

export interface OmniCliContext extends
  ContextWithCwd,
  ContextWithRootDirectory { }

export type ContextPartial<
  Context extends BaseContext,
> = Omit<Context, keyof BaseContext>;

export interface ContextPartialCompiler<
  Context extends BaseContext,
> {
  (): ContextPartial<Context>
}

export type PartialOmniCliContext =
& BaseContext & Partial<ContextPartial<OmniCliContext>>;
