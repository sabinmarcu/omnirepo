import {
  describe,
  it,
  expect,
} from 'vitest';
import { propertyTraverseWildcard } from './propertyTraverse.constants.js';
import {
  generateObjectStringFromPath,
  generateObjectStringsFromPaths,
  isWildcard,
  packer,
  pathToSegments,
  segmentsIsEmpty,
  segmentsToPath,
} from './propertyTraverse.utils.js';

const insert = { result: '42' };
const testCases = [
  {
    input: '',
    segments: [''],
    path: '',
    empty: true,
    objectString: JSON.stringify(insert),
  },
  {
    input: 'a',
    segments: ['a'],
    path: 'a',
    empty: false,
    objectString: JSON.stringify({ a: insert }),
  },
  {
    input: 'a.b',
    segments: ['a', 'b'],
    path: 'a.b',
    empty: false,
    objectString: JSON.stringify({ a: { b: insert } }),
  },
  {
    input: 'a.[1].b',
    segments: ['a', '[1]', 'b'],
    path: 'a.[1].b',
    empty: false,
    objectString: JSON.stringify({
      a: [undefined, { b: insert }, undefined],
    }),
  },
  {
    input: 'a[1].b',
    segments: ['a', '[1]', 'b'],
    path: 'a.[1].b',
    empty: false,
    objectString: JSON.stringify({
      a: [undefined, { b: insert }, undefined],
    }),
  },
];

describe('propertyTraverse.utils', () => {
  describe('packer', () => {
    it('should be an object', () => {
      expect(packer).toBeInstanceOf(Object);
    });
    it('should have pack and unpack methods', () => {
      expect(Object.keys(packer)).toEqual(['unpack', 'pack']);
    });
    describe('packer.pack', () => {
      it('should be a function', () => {
        expect(packer.pack).toBeInstanceOf(Function);
      });
      it('should have one argument', () => {
        expect(packer.pack.length).toBe(1);
      });
      it.each([
        {
          input: '',
          output: JSON.stringify(''),
        },
      ])('packer.pack($input) = $output', ({ input, output }) => {
        expect(packer.pack(input)).toEqual(output);
      });
    });
    describe('packer.unpack', () => {
      it('should be a function', () => {
        expect(packer.unpack).toBeInstanceOf(Function);
      });
      it('should have one argument', () => {
        expect(packer.unpack.length).toBe(1);
      });
      it.each([
        {
          input: '""',
          output: '',
        },
        {
          input: '{ "awesome": "sauce" }',
          output: { awesome: 'sauce' },
        },
        {
          input: '{ "awesome": `stuff` }',
          output: { awesome: '`stuff`' },
        },
        {
          input: '{ "awesome": \'stuff\' }',
          output: { awesome: '\'stuff\'' },
        },
        {
          input: '{ "awesome": stuff }',
          output: { awesome: 'stuff' },
        },
        {
          input: '{ "awesome": theme.stuff }',
          output: { awesome: 'theme.stuff' },
        },
        {
          input: '{ "awesome": awesome-sauce }',
          output: { awesome: 'awesome-sauce' },
        },
        {
          // eslint-disable-next-line no-template-curly-in-string
          input: '{ "awesome": `${stuff}` }',
          // eslint-disable-next-line no-template-curly-in-string, no-useless-escape
          output: { awesome: '\`${stuff}\`' },
        },
      ])('packer.unpack($input) = $output', ({ input, output }) => {
        expect(packer.unpack(input)).toEqual(output);
      });
    });
  });
  describe('pathToSegments', () => {
    it('should be a function', () => {
      expect(pathToSegments).toBeInstanceOf(Function);
    });
    it('should have one argument', () => {
      expect(pathToSegments.length).toBe(1);
    });
    it.each(testCases)(
      'pathToSegments($input) = $segments',
      ({ input, segments }) => {
        expect(pathToSegments(input)).toEqual(segments);
      },
    );
  });

  describe('segmentsToPath', () => {
    it('should be a function', () => {
      expect(segmentsToPath).toBeInstanceOf(Function);
    });
    it('should have one argument', () => {
      expect(segmentsToPath.length).toBe(1);
    });
    it.each(testCases)(
      'segmentsToPath($segments) = $path',
      ({ path, segments }) => {
        expect(segmentsToPath(segments)).toEqual(path);
      },
    );
  });

  describe('isWildcard', () => {
    it('should be a function', () => {
      expect(isWildcard).toBeInstanceOf(Function);
    });
    it('should have one argument', () => {
      expect(isWildcard.length).toBe(1);
    });
    it.each([
      ['a', false],
      [propertyTraverseWildcard, true],
      ['', false],
    ])(
      'isWildcard(%p) = %p',
      (input, result) => {
        expect(isWildcard(input)).toEqual(result);
      },
    );
  });

  describe('segmentsIsEmpty', () => {
    it('should be a function', () => {
      expect(segmentsIsEmpty).toBeInstanceOf(Function);
    });
    it('should have one argument', () => {
      expect(segmentsIsEmpty.length).toBe(1);
    });
    it.each(testCases)(
      'segmentsIsEmpty($segments) = $empty',
      ({ empty, segments }) => {
        expect(segmentsIsEmpty(segments)).toEqual(empty);
      },
    );
  });

  describe('generateObjectStringFromPath', () => {
    it('should be a function', () => {
      expect(generateObjectStringFromPath).toBeInstanceOf(Function);
    });
    it('should have two arguments', () => {
      expect(generateObjectStringFromPath.length).toBe(2);
    });
    it.each(testCases)(
      'generateObjectStringFromPath($input) = $objectString',
      ({ input, objectString }) => {
        expect(generateObjectStringFromPath(input, JSON.stringify(insert))).toEqual(objectString);
      },
    );
  });
  describe('generateObjectStringsFromPaths', () => {
    it('should be a function', () => {
      expect(generateObjectStringsFromPaths).toBeInstanceOf(Function);
    });
    it('should have two arguments', () => {
      expect(generateObjectStringsFromPaths.length).toBe(2);
    });
    const inputs = testCases.map(({ input }) => input);
    const outputs = testCases.map(({ objectString }) => objectString);

    it('should properly combine all test case inputs into outputs', () => {
      expect(generateObjectStringsFromPaths(inputs, JSON.stringify(insert))).toEqual(outputs);
    });
    it('should properly combine all test case inputs without empty input into outputs', () => {
      const filteredInputs = inputs.filter((input) => !!input);
      expect(generateObjectStringsFromPaths(
        filteredInputs,
        JSON.stringify(insert),
      )).toEqual(outputs);
    });
  });
});
