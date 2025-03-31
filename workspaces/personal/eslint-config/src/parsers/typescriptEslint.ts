import { conditionalConfig } from '../utils/conditionalConfig.js';
import { getLogger } from '../utils/debug.js';

const logger = getLogger('parser:typescript');

const tsParserConfig = await conditionalConfig(
  'typescript-eslint',
  () => logger.warn('Skipping Typescript Parser'),
  ({ 'typescript-eslint': typescriptParser }) => [
    {
      name: 'TS Parser (typescript-eslint)',
      languageOptions: {
        parser: typescriptParser.parser,
        parserOptions: {
          projectService: true,
          sourceType: 'module',
        },
      },
    },
  ],
);

export default tsParserConfig;
