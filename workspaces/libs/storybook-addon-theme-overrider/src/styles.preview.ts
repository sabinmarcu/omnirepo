/* eslint-disable unicorn/prevent-abbreviations */
import { theme } from './contract.js';
import { createStyle } from './renderStyles.js';
import { argsTable } from './styles.common.js';

export const styles = createStyle();
const { createContainer, globalStyle } = styles;

export const docsContainer = createContainer('storybook-docs');
export const storyContainer = createContainer('storybook-story');
export const colorPaletteContainer = createContainer('storybook-color-palette');

// Sizing Reset
globalStyle('#storybook-docs', {
  container: docsContainer,
  containerType: 'inline-size',
});

globalStyle('.sbdocs.sbdocs-wrapper', {
  paddingBlock: theme.docs.padding.block,
  paddingInline: theme.docs.padding.inline,
});

globalStyle('.sbdocs.sbdocs-content', {
  maxInlineSize: theme.docs.size,
});

// Unstyled Restyle
globalStyle('.sb-unstyled', {
  fontSize: theme.unstyled.font.size,
  fontFamily: theme.unstyled.font.family,
  fontWeight: theme.unstyled.font.weight,
});

// Storybook Theme Style
globalStyle('.sbdocs.sbdocs-wrapper', {
  background: theme.surfaces.page.background,
});
globalStyle('.sbdocs.sbdocs-wrapper, .sbdocs.sbdocs-wrapper :where(p:not(.sb-anchor, .sb-unstyled, .sb-unstyled p))', {
  color: theme.surfaces.page.color,
});
globalStyle('.sbdocs.sbdocs-wrapper a', {
  color: theme.surfaces.page.link.base,
});
globalStyle('.sbdocs.sbdocs-wrapper a:hover, .sbdocs.sbdocs-wrapper a:focus', {
  color: theme.surfaces.page.link.hover,
});
globalStyle('.sbdocs.sbdocs-wrapper a:active', {
  color: theme.surfaces.page.link.active,
});

// ==> Preview
globalStyle('.sbdocs.sbdocs-preview', {
  background: theme.surfaces.preview.background,
  color: theme.surfaces.preview.color,
});
globalStyle('.sbdocs.sbdocs-preview .sb-bar', {
  background: theme.surfaces.preview.bar.background,
  color: theme.surfaces.preview.bar.color,
});
globalStyle('.sbdocs.sbdocs-preview .sb-bar button', {
  color: theme.surfaces.preview.bar.color,
});
globalStyle('.sbdocs.sbdocs-preview .sb-bar button:hover', {
  background: `hsl(from ${theme.surfaces.preview.bar.color} h s l / 0.1)`,
});

// ==> Stories
globalStyle('.sbdocs.sbdocs-preview > .docs-story > *:first-child', {
  container: storyContainer,
  containerType: 'inline-size',
});
globalStyle('.sbdocs.sbdocs-preview .docblock-code-toggle', {
  background: theme.surfaces.docBlock.codeToggle.background,
  borderColor: 'transparent',
  color: theme.surfaces.docBlock.codeToggle.color,
});
globalStyle('.sbdocs.sbdocs-preview :has(> .docblock-code-toggle)', {
  background: 'transparent',
});

// ==> Args Table
argsTable('.sbdocs.sbdocs-wrapper', globalStyle);

// ==> Color Palette
globalStyle('.sbdocs.sbdocs-wrapper .docblock-colorpalette > div', {
  color: theme.surfaces.colorPalette.header,
});
globalStyle('.sbdocs.sbdocs-wrapper .docblock-colorpalette > div > div > div', {
  color: theme.surfaces.colorPalette.section,
});
globalStyle('.sbdocs.sbdocs-wrapper .docblock-colorpalette > div > div > div > div > div', {
  color: theme.surfaces.colorPalette.color,
});
globalStyle('.sbdocs.sbdocs-wrapper hr', {
  borderColor: theme.surfaces.separator,
});
globalStyle('.sbdocs.sbdocs-wrapper .docblock-colorpalette > div:not(:first-child)', {
  container: colorPaletteContainer,
  containerType: 'inline-size',
});
globalStyle('.sbdocs.sbdocs-wrapper .docblock-colorpalette > div:not(:first-child) :is(div:last-child, div:last-child > div)', {
  maxInlineSize: '70cqw',
});

// Storybook Loading Screen
globalStyle('.sb-preparing-docs.sb-wrapper', {
  background: theme.surfaces.page.background,
});
globalStyle([
  '.sb-preparing-docs.sb-wrapper .sb-previewBlock',
  '.sb-preparing-docs.sb-wrapper .sb-argstableBlock-body',
  '.sb-preparing-docs.sb-wrapper .sb-argstableBlock-body tr td',
].join(', '), {
  background: theme.surfaces.argsTable.body.background,
});
globalStyle([

  '.sb-preparing-docs.sb-wrapper .sb-previewBlock',
  '.sb-preparing-docs.sb-wrapper .sb-argstableBlock-body',
].join(', '), {
  borderInlineStart: `solid 1px hsla(from ${theme.surfaces.argsTable.color} h s l / 0.1)`,
  borderInlineEnd: `solid 1px hsla(from ${theme.surfaces.argsTable.color} h s l / 0.1)`,
  borderBlockStart: `solid 1px hsla(from ${theme.surfaces.argsTable.color} h s l / 0.1)`,
  borderBlockEnd: `solid 1px hsla(from ${theme.surfaces.argsTable.color} h s l / 0.1)`,
});
globalStyle('.sb-preparing-docs.sb-wrapper .sb-previewBlock .sb-previewBlock_header', {
  boxShadow: `hsla(from ${theme.surfaces.argsTable.color} h s l / 0.1) 0 -1px 0 0 inset`,
});
globalStyle('.sb-preparing-docs.sb-wrapper .sb-argstableBlock-body', {
  boxShadow: [

    `hsla(from ${theme.surfaces.argsTable.color} h s l / 0.1) 0 1px 3px 1px`,
    `hsla(from ${theme.surfaces.argsTable.color} h s l / 0.06) 0 0 0 1px`,
  ].join(', '),
});
globalStyle('.sb-preparing-docs.sb-wrapper .sb-argstableBlock-body tr:not(:first-child)', {
  borderColor: `hsla(from ${theme.surfaces.argsTable.color} h s l / 0.2)`,
});
globalStyle([
  '.sb-preparing-docs.sb-wrapper .sb-previewBlock .sb-previewBlock_icon',
  '.sb-preparing-docs.sb-wrapper .sb-argstableBlock-head tr th span',
  '.sb-preparing-docs.sb-wrapper .sb-argstableBlock-body tr td span',
  '.sb-preparing-docs.sb-wrapper .sb-argstableBlock-body tr td button',
].join(', '), {
  background: `hsla(from ${theme.surfaces.argsTable.color} h s l / 0.4)`,
});
globalStyle('.sb-preparing-docs.sb-wrapper .sb-previewBlock .sb-loader', {
  borderColor: `hsla(from ${theme.surfaces.argsTable.color} h s l / 0.2)`,
  borderBlockStartColor: `hsla(from ${theme.surfaces.argsTable.color} h s l / 0.4)`,
});

// Storybook Story Theme Style
globalStyle('html, body', {
  minBlockSize: '100%',
});
globalStyle('.sb-show-main, .sb-show-main.sb-main-padded', {
  background: theme.surfaces.story.background,
  color: theme.surfaces.story.color,
  fontFamily: theme.surfaces.story.font.family,
  minBlockSize: '100vh',
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  justifyContent: 'center',
});
globalStyle('#storybook-root', {
  minBlockSize: '100%',
});

// Headings Restyle
const commonStyles = {
  position: 'relative',
  cursor: 'text',
  padding: 0,
  marginInline: 0,
  marginBlockStart: theme.headings.margin.start,
  marginBlockEnd: theme.headings.margin.end,
  fontFamily: theme.headings.font.family,
  color: 'inherit',
} as const;

const previewMask = ':where(.sbdocs-content, .sbdocs-content > *) >';
globalStyle(`.sbdocs.sbdocs-wrapper ${previewMask} h1:first-of-type`, {
  ...commonStyles,
  fontSize: theme.headings.h1.size,
  fontWeight: theme.headings.h1.weight,
  marginBlockStart: theme.headings.h1.margin.start,
  marginBlockEnd: theme.headings.h1.margin.end,
  paddingBlockStart: theme.headings.h1.padding.start,
  paddingBlockEnd: theme.headings.h1.padding.end,
  borderColor: theme.headings.h1.border
    ? `1px solid ${theme.headings.h1.border}`
    : undefined,
  color: theme.headings.h1.color,
});

globalStyle(`.sbdocs.sbdocs-wrapper ${previewMask} h2`, {
  marginBlockStart: 0,
  paddingBlockStart: 0,
});

globalStyle(`.sbdocs.sbdocs-wrapper ${previewMask} h2`, {
  ...commonStyles,
  fontSize: theme.headings.h2.size,
  fontWeight: theme.headings.h2.weight,
  marginBlockStart: theme.headings.h2.margin.start,
  marginBlockEnd: theme.headings.h2.margin.end,
  paddingBlockStart: theme.headings.h2.padding.start,
  paddingBlockEnd: theme.headings.h2.padding.end,
  borderColor: theme.headings.h2.border
    ? `1px solid ${theme.headings.h2.border}`
    : undefined,
  color: theme.headings.h2.color,
});

globalStyle(`.sbdocs.sbdocs-wrapper ${previewMask} h3`, {
  ...commonStyles,
  fontSize: theme.headings.h3.size,
  fontWeight: theme.headings.h3.weight,
  marginBlockStart: theme.headings.h3.margin.start,
  marginBlockEnd: theme.headings.h3.margin.end,
  paddingBlockStart: theme.headings.h3.padding.start,
  paddingBlockEnd: theme.headings.h3.padding.end,
  borderColor: theme.headings.h3.border
    ? `1px solid ${theme.headings.h3.border}`
    : undefined,
  color: theme.headings.h3.color,
});

globalStyle(`.sbdocs.sbdocs-wrapper ${previewMask} h4`, {
  ...commonStyles,
  fontSize: theme.headings.h4.size,
  fontWeight: theme.headings.h4.weight,
  marginBlockStart: theme.headings.h4.margin.start,
  marginBlockEnd: theme.headings.h4.margin.end,
  paddingBlockStart: theme.headings.h4.padding.start,
  paddingBlockEnd: theme.headings.h4.padding.end,
  borderColor: theme.headings.h4.border
    ? `1px solid ${theme.headings.h4.border}`
    : undefined,
  color: theme.headings.h4.color,
});

globalStyle(`.sbdocs.sbdocs-wrapper ${previewMask} h5`, {
  ...commonStyles,
  fontSize: theme.headings.h5.size,
  fontWeight: theme.headings.h5.weight,
  marginBlockStart: theme.headings.h5.margin.start,
  marginBlockEnd: theme.headings.h5.margin.end,
  paddingBlockStart: theme.headings.h5.padding.start,
  paddingBlockEnd: theme.headings.h5.padding.end,
  borderColor: theme.headings.h5.border
    ? `1px solid ${theme.headings.h5.border}`
    : undefined,
  color: theme.headings.h5.color,
});

globalStyle(`.sbdocs.sbdocs-wrapper ${previewMask} h6`, {
  ...commonStyles,
  fontSize: theme.headings.h6.size,
  fontWeight: theme.headings.h6.weight,
  marginBlockStart: theme.headings.h6.margin.start,
  marginBlockEnd: theme.headings.h6.margin.end,
  paddingBlockStart: theme.headings.h6.padding.start,
  paddingBlockEnd: theme.headings.h6.padding.end,
  borderColor: theme.headings.h6.border
    ? `1px solid ${theme.headings.h6.border}`
    : undefined,
  color: theme.headings.h6.color,
});
