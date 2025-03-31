import { backgroundGenerator } from '../generators/background.js';
import { gridGenerator } from '../generators/grid.js';
import { paletteGenerator } from '../generators/palette.js';
import { rawContract } from './rawContract.js';
import type {
  ExtractContractsFromThemeStructure,
  MapThemeToContract,
  MapThemeToUpdateInput,
} from './themeContract.type.js';
import { variantContract } from './variantContract.js';

const primaryContract = variantContract(paletteGenerator, 'primary');
const secondaryContract = variantContract(paletteGenerator, 'secondary');
const backgroundContract = variantContract(backgroundGenerator, 'background');
const gridContract = rawContract(gridGenerator(3), 'grid');

const themeStructure = {
  colors: {
    primary: primaryContract,
    secondary: secondaryContract,
  },
  surfaces: {
    background: backgroundContract,
  },
  grid: gridContract,
} as const;

type TestExtractContracts = ExtractContractsFromThemeStructure<typeof themeStructure>;
//     ^? type TestExtractContracts = [readonly [MapLeafNodes<{
//            base: string;
//            muted: string;
//            emphasis: string;
//        }, CSSVarFunction>, UpdaterFunction<string | Record<"light" | "dark", string>>, "primary"], readonly [...], readonly [...], readonly [...]]

type TestExtractContractsNames = TestExtractContracts[number][2];
//     ^? type TestExtractContractsNames = "primary" | "secondary" | "background" | "grid"

type MapThemeToContractTest = MapThemeToContract<typeof themeStructure>;
//     ^? type MapThemeToContractTest = {
//            readonly colors: {
//                readonly primary: MapLeafNodes<{
//                    base: string;
//                    muted: string;
//                    emphasis: string;
//                }, CSSVarFunction>;
//                readonly secondary: MapLeafNodes<{
//                    base: string;
//                    muted: string;
//                    emphasis: string;
//                }, CSSVarFunction>;
//            };
//            readonly surfaces: {
//                ...;
//            };
//            readonly grid: MapLeafNodes<...>;
//        }

type MapThemeToUpdateInputTest = MapThemeToUpdateInput<typeof themeStructure>;
//      ^? type MapThemeToUpdateInputTest = {
//             readonly grid: number;
//             readonly primary: string | Record<"light" | "dark", string>;
//             readonly secondary: string | Record<"light" | "dark", string>;
//             readonly background: string | Record<...>;
//         }
