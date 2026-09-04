import z from 'zod';
import { MdxResource } from './MdxResource';
import { lazy } from './lazy';
import {
  parseTag,
  type TagId,
} from './Tag';
import {
  metadataSchema,
  tocSchema,
} from './schemas';

const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;

function isCalendarDate(value: string): boolean {
  const [day, month, year] = value.split('.').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCDate() === day
    && date.getUTCMonth() === month - 1
    && date.getUTCFullYear() === year
  );
}

const dateSchema = z.string()
  .regex(datePattern, 'Date must use DD.MM.YYYY format.')
  .refine(isCalendarDate, 'Date must be a valid calendar date.');

export const contentMetadataSchema = metadataSchema.extend({
  tags: z.array(z.string().transform((tag) => parseTag(tag).id)),
  createdAt: dateSchema,
  modifiedAt: dateSchema,
  toc: tocSchema,
});

type DatedContent = {
  modifiedAt: PromiseLike<string>,
  title: PromiseLike<string>,
};

export function compareModifiedAt(left: string, right: string): number {
  const [leftDay, leftMonth, leftYear] = left.split('.', 3);
  const [rightDay, rightMonth, rightYear] = right.split('.', 3);
  return `${rightYear}${rightMonth}${rightDay}`.localeCompare(`${leftYear}${leftMonth}${leftDay}`);
}

export function contentDateToDate(value: string): Date {
  const [day, month, year] = value.split('.', 3).map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatContentDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(contentDateToDate(value));
}

export async function sortByModifiedAt<T extends DatedContent>(resources: T[]): Promise<T[]> {
  const datedResources = await Promise.all(resources.map(async (resource) => ({
    resource,
    modifiedAt: await resource.modifiedAt,
    title: await resource.title,
  })));

  return datedResources
    .toSorted((left, right) => (
      compareModifiedAt(left.modifiedAt, right.modifiedAt)
      || left.title.localeCompare(right.title)
    ))
    .map(({ resource }) => resource);
}

export class ContentResource<
  ContentSchema extends z.ZodType = InstanceType<typeof MdxResource>['contentSchema'],
  MetadataSchema extends typeof contentMetadataSchema = typeof contentMetadataSchema,
> extends MdxResource<ContentSchema, MetadataSchema> {
  public metadataSchema: MetadataSchema = contentMetadataSchema as unknown as MetadataSchema;

  tags = lazy<TagId[]>(
    async () => (await this.metadata).tags,
  );

  createdAt = lazy(
    async () => (await this.metadata).createdAt,
  );

  modifiedAt = lazy(
    async () => (await this.metadata).modifiedAt,
  );
}
