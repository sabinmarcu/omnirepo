import { configs } from 'eslint-plugin-unicorn';
import type {
  Config,
} from '../types.js';

const config = configs.recommended satisfies Config;

module.exports = config;
