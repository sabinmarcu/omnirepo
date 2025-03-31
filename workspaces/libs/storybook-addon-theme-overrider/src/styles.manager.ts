/* eslint-disable unicorn/prevent-abbreviations */

import { theme } from './contract.js';
import { createStyle } from './renderStyles.js';
import { argsTable } from './styles.common.js';

export const styles = createStyle();
const { createContainer, globalStyle } = styles;

export const sidebarContainer = createContainer('storybook-sidebar');
export const toolbarContainer = createContainer('storybook-toolbar');

// Sidebar
globalStyle('div:has(>.container.sidebar-container)', {
  borderColor: theme.surfaces.sidebar.border,
});
globalStyle('.container.sidebar-container', {
  container: sidebarContainer,
  containerType: 'inline-size',
  background: theme.surfaces.sidebar.background,
  color: theme.surfaces.sidebar.color,
});
globalStyle([
  '.container.sidebar-container button',
  '.container.sidebar-container .sidebar-item',
].join(', '), {
  color: theme.surfaces.sidebar.color,
});
globalStyle('.container.sidebar-container button span', {
  color: 'inherit',
});
globalStyle([
  '.container.sidebar-container button:hover',
  '.container.sidebar-container .sidebar-item:hover',
].join(', '), {
  background: `hsl(from ${theme.surfaces.sidebar.color} h s l / 0.1)`,
});

// ==> Combo Box
globalStyle('.container.sidebar-container [role="combobox"] ~ div button', {
  background: theme.surfaces.sidebar.comboBox.background,
  color: theme.surfaces.sidebar.comboBox.color,
});
globalStyle('.container.sidebar-container [role="combobox"] ~ div button:hover', {
  background: `hsl(from ${theme.surfaces.sidebar.comboBox.color} h s l / 0.1)`,
});
globalStyle([
  '.container.sidebar-container [role="combobox"]',
  '.container.sidebar-container [role="combobox"] ~ div button',
].join(', '), {
  boxShadow: `${theme.surfaces.sidebar.comboBox.border} 0px 0px 0px 1px inset`,
});
globalStyle([
  '.container.sidebar-container [role="combobox"] div:first-child',
  '.container.sidebar-container [role="combobox"] input',
].join(', '), {
  color: theme.surfaces.sidebar.color,
});
globalStyle([
  '.container.sidebar-container [role="combobox"] code',
  '.container.sidebar-container [role="combobox"] input::placeholder',
].join(', '), {
  color: `hsl(from ${theme.surfaces.sidebar.color} h s l / 0.5)`,
});
globalStyle('.container.sidebar-container [role="combobox"]', {
  background: theme.surfaces.sidebar.comboBox.input.background,
});
globalStyle([
  '.container.sidebar-container [role="combobox"]:has(input:active)',
  '.container.sidebar-container [role="combobox"]:has(input:focus)',
].join(', '), {
  background: theme.surfaces.sidebar.comboBox.input.active,
});

// ==> Bottom Wrapper
globalStyle('#sidebar-bottom-wrapper > div > *', {
  boxShadow: [
    `hsl(from ${theme.surfaces.sidebar.color} h s l / 0.15) 0px 1px 2px 0px`,
    `hsl(from ${theme.surfaces.sidebar.background} h s l)  0px -5px 20px 10px`,
  ].join(', '),
});
globalStyle('#sidebar-bottom-wrapper > div:not(:first-child)', {
  boxShadow: [
    `inset 0 0 0 1px ${theme.surfaces.sidebar.notification.background}`,
    `0 1px 2px 0 hsl(from ${theme.surfaces.sidebar.color} h s l / 0.15)`,
    `0px -5px 20px 10px ${theme.surfaces.sidebar.background}`,
  ].join(', '),
});
globalStyle([
  '#sidebar-bottom-wrapper > div > *',
  '#sidebar-bottom-wrapper > div:not(:first-child)',
  '#sidebar-bottom-wrapper > div:not(:first-child) #testing-module-title',
].join(', '), {
  color: theme.surfaces.sidebar.notification.color,
  background: theme.surfaces.sidebar.notification.background,
});

// Top Bar
globalStyle('#root .sb-bar', {
  container: toolbarContainer,
  containerType: 'inline-size',
  background: theme.surfaces.toolbar.background,
  color: theme.surfaces.toolbar.color,
});
globalStyle('#root .sb-bar button', {
  color: theme.surfaces.toolbar.color,
});
globalStyle('#root .sb-bar button:hover', {
  background: `hsl(from ${theme.surfaces.toolbar.color} h s l / 0.1)`,
});
globalStyle('#root .sb-bar button > div > div > div', {
  color: theme.surfaces.toolbar.badge.color,
  background: theme.surfaces.toolbar.badge.background,
});

// Tooltips
const tooltipSelectors = ['escaped', 'interactive']
  .map((state) => `[data-popper-${state}]`).join('');
globalStyle([
  tooltipSelectors,
  `${tooltipSelectors} > div`,
].join(', '), {
  background: theme.surfaces.tooltips.background,
});
globalStyle([
  `${tooltipSelectors} button`,
  `${tooltipSelectors} a`,
].join(', '), {
  color: theme.surfaces.tooltips.color,
});
globalStyle(`${tooltipSelectors} span`, {
  color: 'inherit',
});
globalStyle(`${tooltipSelectors} button:hover`, {
  background: `hsl(from ${theme.surfaces.tooltips.color} h s l / 0.1)`,
});

// Panels
globalStyle('div:has(>[orientation])', {
  borderColor: theme.surfaces.panel.border,
});
globalStyle('#panel-tab-content', {
  background: theme.surfaces.panel.background,
  color: theme.surfaces.panel.color,
});
argsTable('#panel-tab-content', globalStyle, {
  body: {
    background: theme.surfaces.panel.background,
  },
  color: theme.surfaces.panel.color,
});

// Modal
globalStyle('[data-state="open"] ~ [data-state="open"] > div', {
  background: theme.surfaces.modal.background,
});
globalStyle('[data-state="open"] ~ [data-state="open"] > div > div', {
  color: theme.surfaces.modal.color,
});
