import { variantSelector } from '@sabinmarcu/website-theme';
import type { ThemeSelection } from './ThemeSelector.core';

const getDOMNode = () => {
  const element = globalThis.document?.querySelector(`[${variantSelector}]`);
  return element;
};

export const getSelection = () => {
  const element = getDOMNode();
  if (!element) {
    return undefined;
  }

  return element.getAttribute(variantSelector) as ThemeSelection;
};

export const updateDOM = (variant: ThemeSelection) => {
  const element = getDOMNode();
  if (!element) {
    return;
  }

  element.setAttribute(variantSelector, variant);
};
