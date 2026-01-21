import z from 'zod';

export const codehikeBlockAnnotationSchema = z.object({
  title: z.string(),
  children: z.any(),
});

export function codehikeBlockArrayAnnotationSchema<const T extends string>(key: T) {
  return z.object({}).and(
    z.record(
      z.enum([key] as const),
      z.array(codehikeBlockAnnotationSchema),
    ),
  );
}

export function codehikeBlockObjectAnnotationSchema<const T extends string[]>(...keys: T) {
  return z.object({}).and(z.record(
    z.literal(keys),
    codehikeBlockAnnotationSchema,
  ));
}
