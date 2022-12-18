import {
  generateImportResolver,
  NO_PROJECTS_ERROR,
  PROJECTS_EMPTY,
  PROJECTS_NOT_ARRAY,
  PROJECTS_NOT_STRINGS,
} from './generateImportResolver.js';

describe('generateImportResolver', () => {
  it('should be a function', () => {
    expect(generateImportResolver).toBeInstanceOf(Function);
  });
  it('should accept one parameter', () => {
    expect(generateImportResolver.length).toBe(1);
  });
  describe.each([
    { input: undefined, error: NO_PROJECTS_ERROR },
    { input: null, error: NO_PROJECTS_ERROR },
    { input: 1, error: PROJECTS_NOT_ARRAY },
    { input: [], error: PROJECTS_EMPTY },
    { input: [2], error: PROJECTS_NOT_STRINGS },
    { input: [''], output: [''] },
    { input: ['awesome'], output: ['awesome'] },
    { input: ['awesome', 'stuff'], output: ['awesome', 'stuff'] },
  ] as const)('generateImportResolver($input)', ({ input, error, output }) => {
    if (error) {
      it('should error', () => {
        expect(() => generateImportResolver(input as any)).toThrow(error);
      });
    } else {
      it(`= ${output}`, () => {
        const result = generateImportResolver(input as any);
        expect(typeof result).toBe('object');
        expect(result).toHaveProperty('settings');
        expect(result.settings).toHaveProperty('import/resolver');
        expect(result.settings['import/resolver']).toHaveProperty('typescript');
        expect(result.settings['import/resolver'].typescript).toHaveProperty('project');
        expect(result.settings['import/resolver'].typescript.project).toEqual(output);
      });
    }
  });
});
