/* eslint-disable import/export, @typescript-eslint/no-redeclare */
import { parse } from 'codehike';
import moize from 'moize';
import type {
  ZodAny,
  ZodType,
} from 'zod';
import { readRawContent } from './readRawContent';

export namespace readContent {
  export type Options<
    Schema extends ZodType,
    MetadataSchema extends ZodType = ZodAny,
  > = {
    schema: Schema,
    metadataSchema?: MetadataSchema,
  };
}

async function readContentRaw<
  Schema extends ZodType,
  MetadataSchema extends ZodType = ZodAny,
>(
  path: string,
  {
    schema,
    metadataSchema,
  }: readContent.Options<Schema, MetadataSchema>,
) {
  if (!/\.mdx?$/.test(path)) {
    return undefined;
  }
  const { default: Page, ...rest } = await readRawContent(path);
  const metadata = metadataSchema?.parse(rest) ?? undefined;
  const codehikeData = parse(Page);
  const data = schema.parse(codehikeData);

  return {
    data,
    path,
    metadata,
  } as const;
}

export const readContent = (
  moize.promise(readContentRaw) as
  unknown as typeof readContentRaw
);
