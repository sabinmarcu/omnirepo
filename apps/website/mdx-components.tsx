import {
  Children,
  isValidElement,
  type ComponentType,
  type ReactNode,
} from 'react';
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { ThemedLink } from './components/primitives/ThemedLink';
import { Typography } from './components/primitives/Typography';
import { CodehikeCode } from './components/CodehikeCode';
import { CodehikeInlineCode } from './components/CodehikeInlineCode';
import { CodeWithTabs } from './components/CodeWithTabs';
import { PageLayout } from './layouts/PageLayout';
import { mdxImage } from './mdx-components.css';

function getOnlyChildOfType<Props>(children: ReactNode, type: ComponentType<Props>) {
  const childArray = Children.toArray(children).filter((child) => (
    typeof child !== 'string' || child.trim() !== ''
  ));

  if (childArray.length !== 1) {
    return undefined;
  }

  const [child] = childArray;

  return isValidElement<Props>(child) && child.type === type
    ? child
    : undefined;
}

function MdxImage({
  src, alt, className, ...rest
}: any) {
  const imageClassName = [mdxImage, className].filter(Boolean).join(' ');

  const image = typeof src === 'string'
    // Remote sources are untouched by remark-mdx-images, so they carry no dimensions.
    // eslint-disable-next-line @next/next/no-img-element
    ? <img className={imageClassName} src={src} alt={alt ?? ''} {...rest} />
    : <Image className={imageClassName} src={src} alt={alt ?? ''} placeholder="blur" {...rest} />;

  return (
    <PageLayout.Inset>
      {image}
    </PageLayout.Inset>
  );
}

const components: MDXComponents = {
  a: (props: any) => (<ThemedLink {...(props as any)} />),
  h1: (props: any) => (<Typography as="h1" {...props} />),
  h2: (props: any) => (<Typography as="h2" {...props} />),
  h3: (props: any) => (<Typography as="h3" {...props} />),
  h4: (props: any) => (<Typography as="h4" {...props} />),
  h5: (props: any) => (<Typography as="h5" {...props} />),
  h6: (props: any) => (<Typography as="h6" {...props} />),
  p: ({
    children,
    ...props
  }: any) => getOnlyChildOfType(children, MdxImage) ?? (<Typography as="p" {...props}>{children}</Typography>),
  img: MdxImage,
  CodehikeCode,
  CodehikeInlineCode,
  CodeWithTabs,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
