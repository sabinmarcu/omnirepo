import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { ThemedLink } from './components/ThemedLink';

const components: MDXComponents = {
  a: (props: any) => (<ThemedLink {...(props as any)} raw />),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
