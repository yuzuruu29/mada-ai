import { ResearchRunView } from './ResearchRunView';

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <ResearchRunView runId={runId} />;
}
