declare module '*.mdx' {
  const MDXComponent: (props: any) => JSX.Element;
  export const title: string;
  export default MDXComponent;
}
