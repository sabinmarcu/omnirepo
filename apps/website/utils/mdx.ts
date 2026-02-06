import z from 'zod';
import type {
  $ZodString,
  $ZodType,
} from 'zod/v4/core';

export function codehikeBlockAnnotationSchema<const Schema extends $ZodType = $ZodString>(
  schema?: Schema,
) {
  return z.object({
    title: schema || z.string(),
    children: z.any(),
  });
}

export function codehikeBlockArrayAnnotationSchema<
  const T extends string,
>(key: T): z.ZodIntersection<
  z.ZodObject<
    {},
    z.core.$strip
  >,
  z.ZodRecord<
    z.ZodEnum<{ [Key in T]: T }>,
    z.ZodArray<
      z.ZodObject<{
        title: z.core.$ZodString<unknown> | z.ZodString;
        children: z.ZodAny;
      },
      z.core.$strip>
    >
  >
>;

export function codehikeBlockArrayAnnotationSchema<
  const T extends string,
  const Schema extends $ZodType = $ZodString,
>(
  key: T,
  schema: Schema,
): z.ZodIntersection<
  z.ZodObject<
    {},
    z.core.$strip
  >,
  z.ZodRecord<
    z.ZodEnum<{ [Key in T]: T }>,
    z.ZodArray<
      z.ZodIntersection<
        z.ZodObject<{
          title: z.ZodString | z.core.$ZodString<unknown>;
          children: z.ZodAny;
        },
        z.core.$strip>,
        Schema
      >
    >
  >
>;

export function codehikeBlockArrayAnnotationSchema(
  key: any,
  subSchema?: any,
) {
  const base = codehikeBlockAnnotationSchema();
  const final = subSchema
    ? base.and(subSchema)
    : base;
  return z.object({}).and(
    z.record(
      z.enum([key] as const),
      z.array(
        codehikeBlockAnnotationSchema()
          .and(final),
      ),
    ),
  ) as any;
}

export function codehikeBlockObjectAnnotationSchema<const T extends string[]>(...keys: T) {
  return z.object({}).and(z.record(
    z.literal(keys),
    codehikeBlockAnnotationSchema(),
  ));
}
