import z from 'zod';
import { codehikeCodeBlockSchema } from '@/utils/mdx';
import { PageLayout } from '@/layouts/PageLayout';
import { Code } from './Code';
import { CodeTabs } from './CodeTabs';

const codeWithTabsSchema = z.object({
  tabs: z.array(codehikeCodeBlockSchema).min(1),
});

export namespace CodeWithTabs {
  export type Props = z.input<typeof codeWithTabsSchema>;
}

export function CodeWithTabs({
  syncStorageKey,
  initialSyncedLabel,
  ...props
}: CodeWithTabs.Props & {
  syncStorageKey?: string,
  initialSyncedLabel?: string,
}) {
  const { tabs } = codeWithTabsSchema.parse(props);
  return (
    <PageLayout.Inset>
      <CodeTabs
        syncStorageKey={syncStorageKey}
        initialSyncedLabel={initialSyncedLabel}
        tabs={tabs.map((tab) => ({
          label: tab.meta || tab.lang,
          content: <Code codeblock={tab} />,
        }))}
      />
    </PageLayout.Inset>
  );
}
