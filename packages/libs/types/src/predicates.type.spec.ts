import type { IsUnknown } from 'type-fest';
import type {
  IsKnown,
  BoolToUnknownNever,
} from './predicates';

type IsUnknownTest1 = IsUnknown<unknown>;
//    ^? type IsUnknownTest1 = true
type IsUnknownTest2 = IsUnknown<never>;
//    ^? type IsUnknownTest2 = false
type IsUnknownTest3 = IsUnknown<number>;
//    ^? type IsUnknownTest3 = false

type IsKnownTest1 = IsKnown<unknown>;
//    ^? type IsKnownTest1 = false
type IsKnownTest2 = IsKnown<never>;
//    ^? type IsKnownTest2 = false
type IsKnownTest3 = IsKnown<number>;
//    ^? type IsKnownTest3 = true

type BoolToUnknownNeverTest1 = BoolToUnknownNever<IsKnown<unknown>>;
//    ^? type BoolToUnknownNeverTest1 = never
type BoolToUnknownNeverTest2 = BoolToUnknownNever<IsKnown<never>>;
//    ^? type BoolToUnknownNeverTest2 = never
type BoolToUnknownNeverTest3 = BoolToUnknownNever<IsKnown<number>>;
//    ^? type BoolToUnknownNeverTest3 = unknown
