import { toCamel } from '@sabinmarcu/utils-string';
import type { CamelCase } from '@sabinmarcu/types';

let lastZLayer = 0;
const zLayer = <
  const RootLayer extends string,
  const SubLayers extends string,
>(
  label: RootLayer,
  ...children: SubLayers[]
): (
    & { [Key in RootLayer]: number }
    & { [Key in SubLayers as CamelCase<`${RootLayer}-${SubLayers}`>]: number }
) => {
  lastZLayer = Number.parseInt(
    `${(lastZLayer + 10) / 10}`,
    10,
  ) * 10;

  let accumulator = {
    [label]: lastZLayer,
  };

  for (const child of children) {
    lastZLayer += 1;
    const name = toCamel([label, child].join('-'));
    accumulator = {
      ...accumulator,
      [name]: lastZLayer,
    };
  }

  return accumulator as any;
};

export const zIndexLayers = {
  ...zLayer('crtOverlay'),
  ...zLayer('showcase'),
  // Below the navbar: the sticky TOC rail must never ride over it. The drawer is
  // promoted to the top layer by the popover API and does not rely on this.
  ...zLayer('toc'),
  ...zLayer('navigation', 'backdrop', 'sections', 'search'),
  ...zLayer('experiments'),
};

