/* eslint-disable unicorn/prevent-abbreviations */

import type { PartialDeep } from '@sabinmarcu/types';
import { merge as deepMerge } from 'ts-deepmerge';
import { theme } from './contract.js';
import type { createStyle } from './renderStyles.js';

export function argsTable(
  rootSelector: string,
  globalStyle: ReturnType<typeof createStyle>['globalStyle'],
  styles: PartialDeep<typeof theme.surfaces.argsTable> = {},
) {
  const localStyles = deepMerge(
    theme.surfaces.argsTable,
    styles as any,
  ) as unknown as typeof theme.surfaces.argsTable;

  globalStyle(`${rootSelector} .docblock-argstable-head tr :is(th, th button)`, {
    color: localStyles.color,
  });
  globalStyle(`${rootSelector} .docblock-argstable`, {
    color: localStyles.color,
  });
  globalStyle([
    `${rootSelector} .docblock-argstable-body tr`,
    `${rootSelector} .docblock-argstable-body td`,
  ].join(', '), {
    borderColor: localStyles.border,
  });
  globalStyle(`${rootSelector} .docblock-argstable-body td`, {
    background: localStyles.body.background,
  });
  globalStyle([
    `${rootSelector} .docblock-argstable-body td:not(:has(input)):not(:has(div ~ div)):has(div > span) span`,
    `${rootSelector} .docblock-argstable-body td div > div > span`,
    `${rootSelector} code:not(:has(> *))`,
  ].join(', '), {
    background: localStyles.body.code.background,
    color: localStyles.body.code.color,
    borderColor: localStyles.body.code.border,
  });
  globalStyle(`${rootSelector} .docblock-argstable-body :is(select, input)`, {
    background: localStyles.input.background,
    color: localStyles.input.color,
  });
}
