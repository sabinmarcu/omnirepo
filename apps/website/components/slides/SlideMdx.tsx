import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from 'react';
import type { MDXComponents } from 'mdx/types';
import type { RawCode } from 'codehike/code';
import z from 'zod';
import { Code } from '@/components/Code';
import { CodehikeInlineCode } from '@/components/CodehikeInlineCode';
import { CodeTabs } from '@/components/CodeTabs';
import { ZoomFrame } from '@/components/ZoomFrame';
import {
  packageManagers,
  parsePackageCommand,
} from '@/components/PackageManagerCode.utils';
import { codehikeCodeBlockSchema } from '@/utils/mdx';
import { SlideDiagram } from './SlideDiagram';
import { SlideSwatches } from './SlideSwatches';
import {
  columnsStyle,
  counterButtonStyle,
  exampleStyle,
  imageStyle,
  slideTabsStyle,
  staticCounterStyle,
  tableStyle,
  tableWrapperStyle,
} from './SlideMdx.css';

export type SlideView = 'read' | 'present' | 'print';

const tabsSchema = z.object({ tabs: z.array(codehikeCodeBlockSchema).min(1) });

type ImageSource = string | { src: string, width?: number, height?: number };

function SlideImage({
  src,
  alt,
  ...props
}: Omit<ComponentProps<'img'>, 'src'> & { src?: ImageSource }) {
  const image = typeof src === 'string' ? { src } : src;
  // MDX imports supply image dimensions; this image needs no client hydration.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...image} {...props} alt={alt ?? ''} className={imageStyle} loading="eager" />;
}

function SlideParagraph({ children, ...props }: ComponentProps<'p'>) {
  const elements = Children.toArray(children);
  if (elements.length === 1 && isValidElement(elements[0]) && elements[0].type === SlideImage) {
    return elements[0];
  }
  return <p {...props}>{children}</p>;
}

function StaticTabs(props: z.input<typeof tabsSchema>) {
  const { tabs } = tabsSchema.parse(props);
  return (
    <div data-slide-examples="" className={exampleStyle}>
      {tabs.map((tab) => (
        <Code key={tab.meta || tab.lang} codeblock={tab} interactive={false} />
      ))}
    </div>
  );
}

function SlideTabs({
  syncStorageKey,
  initialSyncedLabel,
  ...props
}: z.input<typeof tabsSchema> & Pick<CodeTabs.Props, 'syncStorageKey' | 'initialSyncedLabel'>) {
  const { tabs } = tabsSchema.parse(props);
  return (
    <div className={slideTabsStyle}>
      <CodeTabs
        syncStorageKey={syncStorageKey}
        initialSyncedLabel={initialSyncedLabel}
        tabs={tabs.map((tab) => ({
          label: tab.meta || tab.lang,
          content: <Code codeblock={{
            ...tab,
            meta: '',
          }}
          />,
        }))}
      />
    </div>
  );
}

function SlideCode({
  code,
  codeblock,
  interactive,
  ...props
}: Code.Props) {
  const block = (code ?? codeblock) as RawCode;
  const packageCommand = /^package-command(?:\s+(.*))?$/.exec(block.meta);
  if (packageCommand) {
    const command = parsePackageCommand(packageCommand[1] || block.value);
    const tabs = packageManagers.map((manager) => ({
      lang: 'sh',
      meta: manager.name,
      value: manager.format(command),
    }));
    return interactive ? <SlideTabs tabs={tabs} /> : <StaticTabs tabs={tabs} />;
  }
  return <Code {...props} codeblock={block} interactive={interactive} />;
}

export function getSlideMdxComponents(view: SlideView): MDXComponents {
  const interactive = view === 'present';
  return {
    p: SlideParagraph,
    img: SlideImage,
    ZoomableImage: (props: ComponentProps<typeof SlideImage>) => (
      <ZoomFrame><SlideImage {...props} /></ZoomFrame>
    ),
    table: (props: ComponentProps<'table'>) => (
      <div className={tableWrapperStyle}><table {...props} className={tableStyle} /></div>
    ),
    CodehikeCode: (props: Code.Props) => <SlideCode {...props} interactive={interactive} />,
    CodehikeInlineCode,
    CodeWithTabs: interactive ? SlideTabs : StaticTabs,
    h1: 'h2',
    h2: 'h3',
    h3: 'h4',
    h4: 'h5',
    h5: 'h6',
    h6: 'h6',
    a: 'a',
    Mermaid: SlideDiagram,
    SlideDiagram,
    SlideSwatches,
    SlideColumns: ({ children }: { children: ReactNode }) => (
      <div className={columnsStyle}>{children}</div>
    ),
    SlideFragment: ({ children }: { children: ReactNode }) => (
      <div className={interactive ? 'fragment' : undefined}>{children}</div>
    ),
    SlideInteractiveDemo: ({ label, staticLabel }: { label: string, staticLabel: string }) => (
      interactive
        ? (
          <figure className={staticCounterStyle} data-slide-counter="" data-reveal-keyboard="ignore">
            <figcaption>{label}</figcaption>
            <output aria-live="polite">0</output>
            <button type="button" className={counterButtonStyle} aria-label={`${label}: +1`}>
              +1
            </button>
          </figure>
        )
        : (
          <figure className={staticCounterStyle}>
            <figcaption>{staticLabel}</figcaption>
            <output>0</output>
          </figure>
        )
    ),
  };
}
