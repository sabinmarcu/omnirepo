/* eslint-disable unicorn/prefer-module */
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {
  getWorkspaces,
  resolveRootSync,
} from '@sabinmarcu/utils-repo';
import path from 'node:path';

// @ts-ignore
import { DOCS_WORKSPACE_EXCLUDES } from '../../.config/documentation.cjs';

const rootPath = resolveRootSync(__dirname);
const workspaces = (Object.entries(getWorkspaces.map.sync(__dirname)) as [string, string][])
  .filter(([, workspacePath]) => workspacePath.startsWith('packages'))
  .filter(([name]) => !DOCS_WORKSPACE_EXCLUDES.includes(name))
  .map(([, workspacePath]) => ({
    path: workspacePath,
    entry: 'src/index.ts',
  }));

const documentationPath = path.relative(rootPath, __dirname);
const logoPath = 'img/sm.svg';

const config: Config = {
  title: 'Sabin Marcu\'s Dev Corner',
  tagline: 'Docs for all my stuffs',
  favicon: logoPath,

  // Set the production url of your site here
  url: 'https://sabinmarcu.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sabinmarcu', // Usually your GitHub org/user name.
  projectName: 'omnirepo', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ro'],
  },

  plugins: [
    [
      'docusaurus-plugin-typedoc-api',
      {
        projectRoot: rootPath,
        packages: workspaces,
        readmes: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            `https://github.com/sabinmarcu/omnirepo/tree/master/${documentationPath}/`,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: logoPath,
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Tutorial',
        // },
        {
          to: 'api',
          label: 'API Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Code',
          items: [
            // {
            //   label: 'Tutorial',
            //   to: '/docs/intro',
            // },
            {
              label: 'API Docs',
              to: '/api',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sabin Marcu. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;