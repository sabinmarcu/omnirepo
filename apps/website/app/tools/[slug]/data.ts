import { getTool } from '@/data/tools/tools';

export async function resolveTool(
  { params }: (
    | LayoutProps<'/tools/[slug]'>
    | PageProps<'/tools/[slug]'>
  ),
  options: {
    onError: () => any,
    onSuccess: (tool: Exclude<
      Awaited<ReturnType<typeof getTool>>,
      undefined
    >) => any
  },
) {
  const { onError, onSuccess } = options;

  const { slug } = await params;
  const tool = await getTool(slug);

  if (!tool) {
    return onError();
  }

  return onSuccess(tool);
}
