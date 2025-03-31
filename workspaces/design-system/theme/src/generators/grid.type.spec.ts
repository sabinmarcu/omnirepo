import type {
  AmountGrid,
} from './grid.type.js';

type AmountGridTest2 = AmountGrid<1>;
//    ^? type AmountGridTest2 = {
//           s: string;
//           l: string;
//       }

type AmountGridTest3 = AmountGrid<2>;
//    ^? type AmountGridTest3 = {
//           s: string;
//           xs: string;
//           xl: string;
//           l: string;
//       }

type AmountGridTest4 = AmountGrid<3>;
//    ^? type AmountGridTest4 = {
//           s: string;
//           xs: string;
//           xxs: string;
//           xxl: string;
//           xl: string;
//           l: string;
//       }
