import { getStore } from '@/lib/runtime';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const { runId } = await context.params;
  const store = getStore();
  const encoder = new TextEncoder();
  let cursor = 0;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const push = async () => {
        if (closed) return;
        const run = await store.getRun(runId);
        if (!run) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: 'not_found' })}\n\n`));
          controller.close();
          return;
        }
        const events = await store.listEvents(runId);
        while (cursor < events.length) {
          const event = events[cursor]!;
          controller.enqueue(
            encoder.encode(`event: research\ndata: ${JSON.stringify(event)}\n\n`),
          );
          cursor += 1;
        }
        controller.enqueue(
          encoder.encode(
            `event: status\ndata: ${JSON.stringify({
              status: run.status,
              stage: run.stage,
              coverageScore: run.coverageScore,
            })}\n\n`,
          ),
        );
        if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled') {
          controller.enqueue(
            encoder.encode(`event: done\ndata: ${JSON.stringify({ status: run.status })}\n\n`),
          );
          controller.close();
          closed = true;
          return;
        }
        setTimeout(() => {
          void push();
        }, 700);
      };
      void push();
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
