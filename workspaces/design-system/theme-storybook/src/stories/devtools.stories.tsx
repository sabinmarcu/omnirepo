import type {
  Meta,
  StoryObj,
} from '@storybook/react';
import { embedThemeManifests } from '@sabinmarcu/theme-core';
import {
  ThemeDevtools,
  type ThemeDevtoolsHandle,
  type ThemeInputExport,
} from '@sabinmarcu/theme-devtools-react';
import React, {
  StrictMode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { themeRuntime } from '../config/defaultTheme.js';
import {
  consumer,
  consumerGrid,
  controlButton,
  controls,
  demo,
  exportsPanel,
  inertManifests,
  primaryConsumer,
  secondaryConsumer,
} from './devtools.stories.css.js';

type MetadataMode = 'supplied' | 'empty' | 'discovered';

type DevtoolsStoryArgs = {
  readonly metadata: MetadataMode
  readonly mounted: boolean
};

type DevtoolsDemoProps = DevtoolsStoryArgs & {
  readonly discovery: boolean
};

const appColors = ['#5e35b1', '#00897b'] as const;

function DevtoolsDemo({
  discovery,
  metadata,
  mounted: initiallyMounted,
}: DevtoolsDemoProps) {
  const [mounted, setMounted] = useState(initiallyMounted);
  const [exports, setExports] = useState<readonly ThemeInputExport[]>([]);
  const nextAppColor = useRef(0);
  const manifest = useMemo(() => themeRuntime.manifest(), []);
  const embeddedManifests = useMemo(() => embedThemeManifests([manifest]), [manifest]);

  const handleReady = useCallback((controller: ThemeDevtoolsHandle | null) => {
    setExports(controller?.exportInputs() ?? []);
  }, []);

  const updateApp = useCallback(() => {
    const next = appColors[nextAppColor.current];
    nextAppColor.current = (nextAppColor.current + 1) % appColors.length;

    themeRuntime.update({
      families: {
        base: {
          colors: {
            primary: next,
          },
        },
      },
    });
  }, []);

  // Programmatic delivery is always authoritative; it never consults embedded metadata.
  const manifests = useMemo(() => {
    if (metadata === 'empty') return [];
    if (discovery && metadata === 'discovered') return undefined;
    return [manifest];
  }, [discovery, metadata, manifest]);
  const exportText = exports.length === 0
    ? 'No editable sources are currently exposed.'
    : JSON.stringify(exports, null, 2);

  return (
    <StrictMode>
      <section className={demo}>
        {discovery && (
          <div
            aria-hidden
            className={inertManifests}
            dangerouslySetInnerHTML={{ __html: embeddedManifests }}
          />
        )}

        <div className={controls}>
          <button
            className={controlButton}
            onClick={() => setMounted((current) => !current)}
            type="button"
          >
            {mounted ? 'Unmount devtools' : 'Remount devtools'}
          </button>
          <button className={controlButton} onClick={updateApp} type="button">
            Update application source
          </button>
          <span>
            Metadata:
            {' '}
            {metadata}
            {' '}
            (
            {discovery ? 'DOM discovery path' : 'programmatic path'}
            )
          </span>
        </div>

        <div className={consumerGrid}>
          <article className={`${consumer} ${primaryConsumer}`}>
            <strong>Primary source consumer</strong>
            <span>Edits to the live primary source update this card.</span>
          </article>
          <article className={`${consumer} ${secondaryConsumer}`}>
            <strong>Secondary source consumer</strong>
            <span>The grid gap and color tokens come from the mounted app sheet.</span>
          </article>
        </div>

        {mounted && (
          <ThemeDevtools
            manifests={manifests}
            onChange={setExports}
            onReady={handleReady}
            onClose={() => setMounted(false)}
          />
        )}

        <output className={exportsPanel}>{exportText}</output>
      </section>
    </StrictMode>
  );
}

const meta = {
  title: 'Theme/Devtools',
  tags: ['autodocs'],
  argTypes: {
    metadata: {
      control: 'inline-radio',
      options: ['supplied', 'empty', 'discovered'],
    },
    mounted: {
      control: 'boolean',
    },
  },
} satisfies Meta<DevtoolsStoryArgs>;

type Story = StoryObj<DevtoolsStoryArgs>;

export const Programmatic: Story = {
  args: {
    metadata: 'supplied',
    mounted: true,
  },
  argTypes: {
    metadata: {
      control: 'inline-radio',
      options: ['supplied', 'empty'],
    },
  },
  render: (args) => <DevtoolsDemo key={String(args.mounted)} {...args} discovery={false} />,
};

export const DomDiscovery: Story = {
  args: {
    metadata: 'discovered',
    mounted: true,
  },
  render: (args) => <DevtoolsDemo key={String(args.mounted)} {...args} discovery />,
};

export default meta;
