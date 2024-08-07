import { unpackSinglePath } from './unpackSinglePath.js';

const test1 = unpackSinglePath('stuff');
//    ^? const test1: ["stuff"]

const test2 = unpackSinglePath('some:stuff');
//    ^? const test2: ["some", "stuff"]
