import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { ThemedLink } from './components/primitives/ThemedLink';
import { Typography } from './components/primitives/Typography';
import { CodehikeCode } from './components/CodehikeCode';
import { CodehikeInlineCode } from './components/CodehikeInlineCode';

const components: MDXComponents = {
  a: (props: any) => (<ThemedLink {...(props as any)} />),
  h1: (props: any) => (<Typography as="h1" {...props} />),
  h2: (props: any) => (<Typography as="h2" {...props} />),
  h3: (props: any) => (<Typography as="h3" {...props} />),
  h4: (props: any) => (<Typography as="h4" {...props} />),
  h5: (props: any) => (<Typography as="h5" {...props} />),
  h6: (props: any) => (<Typography as="h6" {...props} />),
  p: (props: any) => (<Typography as="p" {...props} />),
  img: ({
    src, alt, ...rest
  }: any) => (
    typeof src === 'string'
      // Remote sources are untouched by remark-mdx-images, so they carry no dimensions.
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={src} alt={alt ?? ''} {...rest} />
      : <Image src={src} alt={alt ?? ''} placeholder="blur" {...rest} />
  ),
  CodehikeCode,
  CodehikeInlineCode,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
