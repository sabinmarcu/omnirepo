import z from 'zod';
import { codehikeCodeBlockSchema } from '@/utils/mdx';
import { PageLayout } from '@/layouts/PageLayout';
import { Code } from './Code';
import { CodeTabs } from './CodeTabs';

const codeWithTabsSchema = z.object({
  tabs: z.array(codehikeCodeBlockSchema).min(1),
});

export function CodeWithTabs(props: unknown) {
  const { tabs } = codeWithTabsSchema.parse(props);
  return (
    <PageLayout.Inset>
      <CodeTabs
        tabs={tabs.map((tab) => ({
          label: tab.meta || tab.lang,
          content: <Code codeblock={tab} />,
        }))}
      />
    </PageLayout.Inset>
  );
}
