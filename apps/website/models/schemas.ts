import z from 'zod';

export const tocSchema = z.array(
  z.object({
    depth: z.number(),
    value: z.string(),
    attributes: z.any(),
    get children() {
      return tocSchema;
    },
  }),
);

export const metadataSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
});
