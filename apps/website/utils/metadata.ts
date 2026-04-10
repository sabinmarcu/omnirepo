import type { ResolvingMetadata } from 'next';

export namespace layoutTitle {
  export type Options = {
    parent: ResolvingMetadata,
    prefix: string,
    title: string,
  };
}

export async function layoutTitle({
  parent,
  prefix,
  title,
}: layoutTitle.Options) {
  const { title: parentTitle } = await parent;
  return {
    default: title,
    template: `${prefix} - ${parentTitle!.template}`,
  };
}

