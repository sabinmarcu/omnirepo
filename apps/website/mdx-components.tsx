import type { MDXComponents } from 'mdx/types';
import { ThemedLink } from './components/primitives/ThemedLink';
import { Typography } from './components/primitives/Typography';
import { Code } from './components/Code';

const components: MDXComponents = {
  a: (props: any) => (<ThemedLink {...(props as any)} raw />),
  h1: (props: any) => (<Typography as="h1" {...props} />),
  h2: (props: any) => (<Typography as="h2" {...props} />),
  h3: (props: any) => (<Typography as="h3" {...props} />),
  h4: (props: any) => (<Typography as="h4" {...props} />),
  h5: (props: any) => (<Typography as="h5" {...props} />),
  h6: (props: any) => (<Typography as="h6" {...props} />),
  CodehikeCode: Code as any,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
