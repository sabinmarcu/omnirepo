export {
  bindTheme,
  compileTheme,
  defineTheme,
} from './compiler.js';
export {
  css,
  numberCodec,
  propertyName,
  registered,
  source,
  staticGenerator,
  stringCodec,
  variableGenerator,
  variantSource,
} from './descriptors.js';
export { breakpointGenerator } from './breakpoints.js';
export type { BreakpointOutput } from './breakpoints.js';
export {
  encodeThemePatch,
  resolveThemeInputs,
} from './inputs.js';
export {
  claimThemeAllocations,
  releaseThemeAllocations,
} from './ownership.js';
export {
  colorCodec,
  jsonCodec,
  numberUnitCodec,
} from './codecs.js';
export { readThemeSources } from './live.js';
export {
  createThemeManifest,
  embedThemeManifests,
  serializeThemeManifests,
  validateThemeManifest,
} from './manifest.js';
export type {
  ManifestDerivedOutput,
  ManifestOutput,
  ManifestSource,
  ManifestStaticOutput,
  ThemeManifest,
} from './manifest.js';
export {
  createManifestPatchDecoder,
  createThemeInspection,
} from './inspection.js';
export type {
  InspectedTheme,
  InspectionChange,
  ThemeInspection,
} from './inspection.js';
export { createThemeSetup } from './renderer.js';
export type {
  ThemeSetup,
  ThemeSetupOptions,
} from './renderer.js';
export {
  paletteGenerator,
  backgroundGenerator,
} from './generators/color.js';
export {
  gridGenerator,
  eightPointGridGenerator,
  fibonacciGridGenerator,
} from './generators/grid.js';
export type {
  GridGeneratorOptions,
  GridTokens,
} from './generators/grid.js';
export { extendTheme } from './extension.js';
export { rebaseThemeDefinition } from './rebase.js';
export type { RebasedSchema } from './rebase.js';
export type {
  AssignmentScope,
  BoundSource,
  BoundToken,
  CompiledSource,
  CompiledTheme,
  CompiledToken,
  CSSVariable,
  Expression,
  ExtendThemeSchema,
  OverlappingThemePaths,
  ValidThemeExtension,
  PropertyRegistration,
  Reference,
  ResolvedThemeInput,
  JsonValue,
  SourceRepresentation,
  Source,
  SourceCodec,
  SourceInput,
  SourceReferences,
  SourceTree,
  StaticDescriptor,
  Theme,
  ThemeContract,
  ThemeInput,
  ThemeInputs,
  ThemePatch,
  ThemePatches,
  ThemeSchema,
  TokenTree,
  VariableContract,
  VariableDescriptor,
  Variants,
  VariantSource,
} from './types.js';
