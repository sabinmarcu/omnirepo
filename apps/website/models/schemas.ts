import z from 'zod';

export const tocSchema = z.array(
  z.object({
    depth: z.number(),
    value: z.string(),
    attributes: z.object({
      id: z.string(),
    }),
    get children() {
      return tocSchema;
    },
  }),
);

export const metadataSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
});
