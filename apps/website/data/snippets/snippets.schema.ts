import {
  codehikeBlockAnnotationSchema,
} from '@/utils/mdx';
import type { ReactNode } from 'react';
import z from 'zod';

export const snippetsFileSchema = codehikeBlockAnnotationSchema().and(
  z.object({
    source: codehikeBlockAnnotationSchema(),
    slug: codehikeBlockAnnotationSchema(),
    lang: codehikeBlockAnnotationSchema().optional(),
  }),
);

export const snippetsPageMetadataSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
});

export const snippetsPageSchema = z.object({
  preview: codehikeBlockAnnotationSchema(),
  file: z.array(snippetsFileSchema),
  children: z.custom<ReactNode>(),
}).transform(({
  preview,
  file,
  children,
}) => ({
  preview: preview.title,
  file: file.map(({
    title,
    slug,
    source,
    lang,
  }) => ({
    title,
    slug: slug.title,
    source: source.title,
    lang: lang?.title,
  })),
  children,
}));
