import { NextResponse } from 'next/server';
import { getStore } from '@/lib/runtime';

export async function GET(
  _request: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const { runId } = await context.params;
  const store = getStore();
  const run = await store.getRun(runId);
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const events = await store.listEvents(runId);
  return NextResponse.json({ run, events });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const { runId } = await context.params;
  const body = (await request.json()) as { action?: string };
  if (body.action !== 'cancel') {
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  }
  const store = getStore();
  const run = await store.getRun(runId);
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await store.requestCancel(runId);
  return NextResponse.json({ ok: true });
}
