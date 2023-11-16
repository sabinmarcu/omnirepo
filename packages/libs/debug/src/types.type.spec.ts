import type {
  DebugDefinition,
  DebugDefinitionFromString,
  NonEmptyString,
} from './types';

type TestDebugDefinition1 = DebugDefinition<'example', 'namespace', 'debug'>;
//    ^? type TestDebugDefinition1 = {
//           path: "example";
//           namespace: "namespace";
//           channel: "debug";
//       }

type TestDebugDefinition2 = DebugDefinition<'example', 'namespace'>;
//    ^? type TestDebugDefinition2 = {
//           path: "example";
//           namespace: "namespace";
//           channel: "debug";
//       }

type TestDebugDefinition3 = DebugDefinition<'example'>;
//    ^? type TestDebugDefinition3 = {
//           path: "example";
//           namespace: "";
//           channel: "debug";
//       }

type TestNonEmptyString1 = NonEmptyString<''>;
//    ^? type TestNonEmptyString1 = never

type TestNonEmptyString2 = NonEmptyString<'stuff'>;
//    ^? type TestNonEmptyString2 = unknown

type TestNonEmptyString3 = NonEmptyString<''> & NonEmptyString<'stuff'>;
//    ^? type TestNonEmptyString3 = never

type TestDebugDefinitionFromString1 = DebugDefinitionFromString<'namespace:example#info'>;
//    ^? type TestDebugDefinitionFromString1 = {
//           path: "example";
//           namespace: "namespace";
//           channel: "info";
//       }

type TestDebugDefinitionFromString2 = DebugDefinitionFromString<'namespace:example'>;
//    ^? type TestDebugDefinitionFromString2 = {
//           path: "example";
//           namespace: "namespace";
//           channel: "debug";
//       }

type TestDebugDefinitionFromString3 = DebugDefinitionFromString<'example#debug'>;
//    ^? type TestDebugDefinitionFromString3 = {
//           path: "example";
//           namespace: "";
//           channel: "debug";
//       }

type TestDebugDefinitionFromString4 = DebugDefinitionFromString<'example'>;
//    ^? type TestDebugDefinitionFromString4 = {
//           path: "example";
//           namespace: "";
//           channel: "debug";
//       }

type TestDebugDefinitionFromString5 = DebugDefinitionFromString<''>;
//    ^? type TestDebugDefinitionFromString5 = never

type TestDebugDefinitionFromString6 = DebugDefinitionFromString<'namespace:#debug'>;
//    ^? type TestDebugDefinitionFromString6 = never

type TestDebugDefinitionFromString7 = DebugDefinitionFromString<':#info'>;
//    ^? type TestDebugDefinitionFromString7 = never

type TestDebugDefinitionFromString8 = DebugDefinitionFromString<':#'>;
//    ^? type TestDebugDefinitionFromString8 = never

type TestDebugDefinitionFromString9 = DebugDefinitionFromString<'path#'>;
//    ^? type TestDebugDefinitionFromString9 = never

type TestDebugDefinitionFromString10 = DebugDefinitionFromString<':stuff'>;
//    ^? type TestDebugDefinitionFromString10 = never

type TestDebugDefinitionFromString11 = DebugDefinitionFromString<'stuff:awesome'>;
//    ^? type TestDebugDefinitionFromString11 = {
//           path: "awesome";
//           namespace: "stuff";
//           channel: "debug";
//       }
