import type {
  Metadata,
  ResolvingMetadata,
} from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import BioPage, { title } from './content.mdx';

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { title: parentTitle } = await parent;
  return {
    title: parentTitle!.template!.replace('%s', title),
  };
}

export default async function PersonalHomepage() {
  return (
    <PageLayout>
      <BioPage />
    </PageLayout>
  );
}
