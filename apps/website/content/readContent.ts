import { parse } from 'codehike';
import type {
  ZodAny,
  ZodType,
} from 'zod';

export namespace readContent {
  export type Options<
    Schema extends ZodType,
    MetadataSchema extends ZodType = ZodAny,
  > = {
    schema: Schema,
    metadataSchema?: MetadataSchema,
  };
}

export async function readContent<
  Schema extends ZodType,
  MetadataSchema extends ZodType = ZodAny,
>(
  path: string,
  {
    schema,
    metadataSchema,
  }: readContent.Options<Schema, MetadataSchema>,
) {
  const { default: Page, ...rest } = await import(
    `./${path}`
  );
  const metadata = metadataSchema?.parse(rest) ?? undefined;
  const codehikeData = parse(Page);
  const data = schema.parse(codehikeData);

  return {
    data,
    path,
    metadata,
  } as const;
}
