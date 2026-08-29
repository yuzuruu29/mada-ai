import { NextResponse } from 'next/server';
import type { ResearchMode } from '@mada-ai/shared';
import { enqueueResearch, getStore } from '@/lib/runtime';
import { resolveWorkspace } from '@/lib/workspace';

const MODES: ResearchMode[] = ['ask', 'research', 'deep', 'academic', 'files', 'compare'];

function isMode(value: unknown): value is ResearchMode {
  return typeof value === 'string' && (MODES as string[]).includes(value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    projectId?: string;
    question?: string;
    mode?: string;
  };

  if (!body.projectId || !body.question?.trim()) {
    return NextResponse.json({ error: 'projectId and question are required' }, { status: 400 });
  }

  const mode: ResearchMode = isMode(body.mode) ? body.mode : 'research';
  const store = getStore();
  const workspace = await resolveWorkspace(store);
  const project = await store.getProject(workspace.workspaceId, body.projectId);
  if (!project) {
    return NextResponse.json({ error: 'Project not found in workspace' }, { status: 404 });
  }

  const run = await store.createRun({
    workspaceId: workspace.workspaceId,
    projectId: project.id,
    question: body.question.trim(),
    mode,
  });

  const dispatch = await enqueueResearch(run.id);
  return NextResponse.json({ runId: run.id, dispatch }, { status: 202 });
}
