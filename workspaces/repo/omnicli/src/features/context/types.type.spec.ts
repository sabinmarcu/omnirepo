import type {
  ContextPartial,
  ContextPartialCompiler,
  ContextWithCwd,
  ContextWithRootDirectory,
} from './types.js';

type CwdContextPartial = ContextPartial<ContextWithCwd>;
//    ^? type CwdContextPartial = {
//           cwd: string;
//       }

type RootDirectoryContextPartial = ContextPartial<ContextWithRootDirectory>;
//    ^? type RootDirectoryContextPartial = {
//           rootDirectory: string;
//       }

type CwdContextCompiler = ContextPartialCompiler<ContextWithCwd>;
//    ^? type CwdContextCompiler = ContextPartialCompiler<ContextWithCwd>

type CwdContextCompilerParameters = Parameters<CwdContextCompiler>;
//    ^? type CwdContextCompilerParameters = []

type CwdContextCompilerReturnType = ReturnType<CwdContextCompiler>;
//    ^? type CwdContextCompilerReturnType = {
//           cwd: string;
//       }

type RootDirectoryContextCompiler = ContextPartialCompiler<ContextWithRootDirectory>;
//    ^? type RootDirectoryContextCompiler = ContextPartialCompiler<ContextWithRootDirectory>
