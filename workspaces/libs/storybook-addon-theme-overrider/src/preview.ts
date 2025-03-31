import type {
  Renderer,
  ProjectAnnotations,
} from '@storybook/types';
import { ThemeOverriderDecorator } from './addon.js';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [ThemeOverriderDecorator as any],
};

export default preview;
