import { NextResponse } from 'next/server';
import { getStore } from '@/lib/runtime';
import { resolveWorkspace } from '@/lib/workspace';

export async function GET() {
  const store = getStore();
  const workspace = await resolveWorkspace(store);
  const projects = await store.listProjects(workspace.workspaceId);
  return NextResponse.json({ workspaceId: workspace.workspaceId, projects });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { title?: string; description?: string };
  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  const store = getStore();
  const workspace = await resolveWorkspace(store);
  const project = await store.createProject({
    workspaceId: workspace.workspaceId,
    title: body.title.trim(),
    description: body.description?.trim(),
  });
  return NextResponse.json(project, { status: 201 });
}
