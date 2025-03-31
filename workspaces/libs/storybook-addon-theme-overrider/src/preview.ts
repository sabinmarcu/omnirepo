import type {
  Renderer,
  ProjectAnnotations,
} from '@storybook/types';
import { ThemeOverriderDecorator } from './addon.js';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [ThemeOverriderDecorator],
};

export default preview;
