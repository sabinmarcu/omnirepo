import {
  codehikeBlockAnnotationSchema,
  codehikeBlockArrayAnnotationSchema,
  codehikeBlockObjectAnnotationSchema,
} from '@/utils/mdx';
import { z } from 'zod';
import { supportedTypes } from '@/app/[locale]/personal/cv/components/InfoTag.tag';

export const infoTagListSchema = codehikeBlockObjectAnnotationSchema(
  ...supportedTypes,
).transform((info) => (
  Object.entries(info).map(([key, { title: value }]) => ({
    key,
    value,
  })) as unknown as {
    [Key in typeof supportedTypes[number]]: { key: Key, value: string }
  }[typeof supportedTypes[number]][]
));

export const overviewSkillsSchema = codehikeBlockArrayAnnotationSchema('skill');
export const overviewLanguagesSchema = codehikeBlockArrayAnnotationSchema('language', z.object({
  level: codehikeBlockAnnotationSchema(),
}));

export const overviewSchema = z.object({
  title: codehikeBlockAnnotationSchema(),
  tagline: codehikeBlockAnnotationSchema(),
  info: infoTagListSchema,
  skills: overviewSkillsSchema,
  languages: overviewLanguagesSchema,
}).transform(
  ({
    title: { title },
    tagline: { title: tagline },
    info,
    skills,
    languages,
  }) => ({
    title,
    tagline,
    info,
    skills: skills.skill.map(({ title: skillTitle }) => skillTitle),
    languages: Object.fromEntries(
      languages.language.map(({
        title: languageTitle,
        level: { title: level },
      }) => [languageTitle, Number.parseInt(level, 10)]),
    ),
  }) as const,
);

export const commonWorkplaceFields = [
  'from',
  'to',
] as const;

export const workplaceMasterMetadataSchema = z.object({}).and(z.record(
  z.enum([
    'company',
    'location',
  ]),
  z.string(),
));

export const validExperienceTagValues = [
  'extracurricular',
] as const;

export const validProjectTagValues = [
  'opensource',
  'personal',
  'academic',
  'competition',
] as const;

export const workplaceMetadataSchema = codehikeBlockObjectAnnotationSchema(
  ...commonWorkplaceFields,
);

export const featuredExperienceSchema = z.object({
  featured: codehikeBlockAnnotationSchema().optional(),
});

export function workplaceExperienceTagSchema<const T extends readonly string[]>(tags: T) {
  return z.object({
    tag: codehikeBlockAnnotationSchema(z.enum(tags)).optional(),
  });
}

export const projectsSpecificSchema = z.object({
  link: codehikeBlockAnnotationSchema().optional(),
});

export const workplaceExperienceSchema = z.array(
  codehikeBlockAnnotationSchema()
    .and(workplaceMetadataSchema)
    .and(workplaceExperienceTagSchema(validExperienceTagValues))
    .and(featuredExperienceSchema),
).transform((workplaces) => (
  workplaces.map(({
    title,
    from: { title: from },
    to: { title: to },
    children,
    featured,
    tag,
  }) => ({
    title,
    to,
    from,
    children,
    featured: !!featured,
    tag: (tag?.title ?? 'unknown') as typeof validExperienceTagValues[number] | 'unknown',
  }))
));

export const workplaceProjectSchema = z.array(
  codehikeBlockAnnotationSchema()
    .and(workplaceMetadataSchema)
    .and(featuredExperienceSchema)
    .and(workplaceExperienceTagSchema(validProjectTagValues))
    .and(projectsSpecificSchema)
    .and(codehikeBlockArrayAnnotationSchema('skill')),
).transform((projects) => (
  projects.map(({
    title,
    from: { title: from },
    to: { title: to },
    skill,
    children,
    featured,
    tag,
    link,
  }) => ({
    title,
    from,
    to,
    children,
    featured: !!featured,
    skill: skill.map(({ title: skillTitle }) => skillTitle),
    tag: (tag?.title ?? 'unknown') as typeof validProjectTagValues[number] | 'unknown',
    link: link?.title ?? undefined,
  }) as const)));

export const workplaceDegreeSchema = z.array(
  codehikeBlockAnnotationSchema()
    .and(workplaceMetadataSchema),
).transform((degrees) => (
  degrees.map(({
    title,
    from: { title: from },
    to: { title: to },

  }) => ({
    title,
    from,
    to,
  }))
));

export const workplacePublicationMetadataSchema = z.object({
  where: codehikeBlockAnnotationSchema(),
  reference: codehikeBlockAnnotationSchema().optional(),
  year: codehikeBlockAnnotationSchema(),
});

export const workplacePublicationSchema = z.array(
  codehikeBlockAnnotationSchema()
    .and(workplacePublicationMetadataSchema),
).transform((publications) => (
  publications.map(({
    title,
    where: { title: where },
    year: { title: year },
    reference,
  }) => ({
    title,
    year,
    where,
    reference: reference?.title ?? undefined,
  }))
));

export const workplaceSchema = z.object({
  experience: workplaceExperienceSchema.optional(),
  project: workplaceProjectSchema.optional(),
  degree: workplaceDegreeSchema.optional(),
  publication: workplacePublicationSchema.optional(),
});
