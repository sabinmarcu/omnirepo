import type { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import BioPage, { title } from './content.mdx';
import { getTitle } from '../utils/getTitle';

export async function generateMetadata(): Promise<Metadata> {
  return { title: getTitle('Personal', title) };
}

export default async function PersonalHomepage() {
  return (
    <PageLayout>
      <BioPage />
    </PageLayout>
  );
}
