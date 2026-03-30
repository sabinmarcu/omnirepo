import {
  codehikeBlockAnnotationSchema,
} from '@/utils/mdx';
import type { ReactNode } from 'react';
import z from 'zod';

export const toolsFileSchema = codehikeBlockAnnotationSchema().and(
  z.object({
    source: codehikeBlockAnnotationSchema(),
    slug: codehikeBlockAnnotationSchema(),
    lang: codehikeBlockAnnotationSchema().optional(),
  }),
);

export const toolsPageMetadataSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
});

export const toolsPageSchema = z.object({
  preview: codehikeBlockAnnotationSchema().optional(),
  showcase: codehikeBlockAnnotationSchema(),
  children: z.custom<ReactNode>(),
}).transform(({
  preview,
  children,
  showcase,
}) => ({
  showcase: showcase.title,
  preview: preview?.title,
  children,
}));

