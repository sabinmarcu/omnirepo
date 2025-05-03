import themeOverrider from '@sabinmarcu/storybook-addon-theme-overrider/preview';

import { deepmerge as deepMerge } from 'deepmerge-ts';
import type {
  Renderer,
  ProjectAnnotations,
} from '@storybook/types';
import { extensions } from './extensions/index.js';
import './config/defaultTheme.js';

const previewPartials = extensions
  .map(({ preview: extensionPreview }) => extensionPreview)
  .filter(Boolean);

const preview: ProjectAnnotations<Renderer> = deepMerge(
  ...previewPartials,
  themeOverrider,
) as any;

export default preview;
