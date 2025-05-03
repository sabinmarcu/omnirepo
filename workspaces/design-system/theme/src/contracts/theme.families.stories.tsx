import type { Meta } from '@storybook/react';
import {
  root,
  ThemeShowcase,
} from './theme.stories.component.js';
import { ThemeMetadataSymbol } from './theme.js';
import {
  swatchSet,
  wrapper,
} from './theme.stories.css.js';
// eslint-disable-next-line import/no-named-as-default
import Swatch from '../storybook/Swatch.js';
import {
  // themeDataAttribute,
  themeFamilyDataAttribute,
  // themeVariants,
} from '../constants.js';

const meta: Meta<typeof ThemeShowcase> = {
  title: 'Theme Family',
  tags: ['autodocs', '!dev'],
  component: ThemeShowcase,
  args: {
    theme: root as any,
  },
  parameters: {
    controls: {
      disable: true,
      exclude: ['theme'],
    },
  },
};

export const Default = {};

export const ElementLevelFamilyOverride = {
  render: () => (
    <section className={wrapper}>
      {root.families.map((family) => {
        const dataAttribute = {
          [`data-${themeFamilyDataAttribute}`]: family,
        };
        return (
          <article className={swatchSet} {...dataAttribute}>
            <h4>{family}</h4>
            <Swatch colors={root[ThemeMetadataSymbol].contract.colors.primary} />
          </article>
        );
      })}
    </section>
  ),
};

// export const ElementLevelVariantOverride = {
//   render: () => (
//     <section className={wrapper}>
//       {themeVariants.map((variant) => {
//         const dataAttribute = {
//           [`data-${themeDataAttribute}`]: variant,
//         };
//         return (
//           <article className={swatchSet} {...dataAttribute}>
//             <h4>{variant}</h4>
//             <Swatch colors={root[ThemeMetadataSymbol].contract.colors.background} />
//           </article>
//         );
//       })}
//     </section>
//   ),
// };

export default meta;
