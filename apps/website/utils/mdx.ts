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

export function codehikeBlockArrayAnnotationSchema<const T extends string>(key: T) {
  return z.object({}).and(
    z.record(
      z.enum([key] as const),
      z.array(codehikeBlockAnnotationSchema()),
    ),
  );
}

export function codehikeBlockObjectAnnotationSchema<const T extends string[]>(...keys: T) {
  return z.object({}).and(z.record(
    z.literal(keys),
    codehikeBlockAnnotationSchema(),
  ));
}
