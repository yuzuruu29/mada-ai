import { and, asc, desc, eq } from 'drizzle-orm';
import {
  getDb,
  projects,
  researchEvents,
  researchRuns,
  users,
  workspaceMembers,
  workspaces,
  type Database,
} from '@mada-ai/db';
import {
  createId,
  nowIso,
  type ClaimEvidenceLink,
  type ClaimRecord,
  type EvidenceRecord,
  type IntentClassification,
  type NormalizedSearchResult,
  type ReportDocument,
  type ResearchEventPayload,
  type ResearchMode,
  type ResearchPlan,
} from '@mada-ai/shared';
import type {
  ProjectRecord,
  ResearchRunRecord,
  ResearchStore,
  StoredSource,
  WorkspaceBundle,
} from './store.js';

interface RunStateJson {
  queries: string[];
  searchResults: NormalizedSearchResult[];
  sources: StoredSource[];
  evidence: EvidenceRecord[];
  claims: ClaimRecord[];
  claimEvidence: ClaimEvidenceLink[];
  report?: ReportDocument;
  reportMarkdown?: string;
}

function emptyState(): RunStateJson {
  return {
    queries: [],
    searchResults: [],
    sources: [],
    evidence: [],
    claims: [],
    claimEvidence: [],
  };
}

function toIso(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  return value.toISOString();
}

function rowToRun(row: typeof researchRuns.$inferSelect): ResearchRunRecord {
  const state = (row.stateJson ?? {}) as Partial<RunStateJson>;
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    projectId: row.projectId,
    question: row.question,
    mode: row.mode,
    stage: row.stage,
    status: row.status as ResearchRunRecord['status'],
    cancelRequested: row.cancelRequested,
    intent: (row.intentJson as IntentClassification | null) ?? undefined,
    plan: (row.planJson as ResearchPlan | null) ?? undefined,
    queries: state.queries ?? [],
    searchResults: state.searchResults ?? [],
    sources: state.sources ?? [],
    evidence: state.evidence ?? [],
    claims: state.claims ?? [],
    claimEvidence: state.claimEvidence ?? [],
    report: state.report,
    reportMarkdown: state.reportMarkdown,
    coverageScore: row.coverageScore ?? undefined,
    errorMessage: row.errorMessage ?? undefined,
    createdAt: toIso(row.createdAt) ?? nowIso(),
    updatedAt: toIso(row.updatedAt) ?? nowIso(),
    completedAt: toIso(row.completedAt),
  };
}

function stateFromRun(run: ResearchRunRecord): RunStateJson {
  return {
    queries: run.queries,
    searchResults: run.searchResults,
    sources: run.sources,
    evidence: run.evidence,
    claims: run.claims,
    claimEvidence: run.claimEvidence,
    report: run.report,
    reportMarkdown: run.reportMarkdown,
  };
}

export class PostgresResearchStore implements ResearchStore {
  constructor(private readonly db: Database = getDb()) {}

  async ensureGuestWorkspace(input?: {
    email?: string;
    name?: string;
    userId?: string;
    workspaceId?: string;
  }): Promise<WorkspaceBundle> {
    const userId = input?.userId ?? createId('usr');
    const workspaceId = input?.workspaceId ?? createId('ws');
    const email = input?.email ?? `guest+${userId}@mada.local`;
    const name = input?.name ?? 'Guest Researcher';
    return this.ensureUserWorkspace({ userId, workspaceId, email, name });
  }

  async ensureUserWorkspace(input: {
    userId: string;
    email: string;
    name: string;
    workspaceId?: string;
  }): Promise<WorkspaceBundle> {
    const now = new Date();
    const [existingMember] = await this.db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, input.userId))
      .limit(1);

    if (existingMember) {
      await this.db
        .insert(users)
        .values({
          id: input.userId,
          email: input.email,
          name: input.name,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: { email: input.email, name: input.name, updatedAt: now },
        });
      return {
        userId: input.userId,
        workspaceId: existingMember.workspaceId,
        email: input.email,
        name: input.name,
      };
    }

    const workspaceId = input.workspaceId ?? createId('ws');
    await this.db
      .insert(users)
      .values({
        id: input.userId,
        email: input.email,
        name: input.name,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { email: input.email, name: input.name, updatedAt: now },
      });

    await this.db
      .insert(workspaces)
      .values({
        id: workspaceId,
        name: `${input.name}'s workspace`,
        ownerUserId: input.userId,
        createdAt: now,
      })
      .onConflictDoNothing({ target: workspaces.id });

    await this.db
      .insert(workspaceMembers)
      .values({
        id: createId('wsm'),
        workspaceId,
        userId: input.userId,
        role: 'owner',
        createdAt: now,
      })
      .onConflictDoNothing({
        target: [workspaceMembers.workspaceId, workspaceMembers.userId],
      });

    return {
      userId: input.userId,
      workspaceId,
      email: input.email,
      name: input.name,
    };
  }

  async listProjects(workspaceId: string): Promise<ProjectRecord[]> {
    const rows = await this.db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .orderBy(desc(projects.createdAt));
    return rows.map((row) => ({
      id: row.id,
      workspaceId: row.workspaceId,
      title: row.title,
      description: row.description ?? undefined,
      createdAt: toIso(row.createdAt) ?? nowIso(),
      updatedAt: toIso(row.updatedAt) ?? nowIso(),
    }));
  }

  async createProject(input: {
    workspaceId: string;
    title: string;
    description?: string;
  }): Promise<ProjectRecord> {
    const now = new Date();
    const id = createId('prj');
    await this.db.insert(projects).values({
      id,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  }

  async getProject(workspaceId: string, projectId: string): Promise<ProjectRecord | null> {
    const [row] = await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)))
      .limit(1);
    if (!row) return null;
    return {
      id: row.id,
      workspaceId: row.workspaceId,
      title: row.title,
      description: row.description ?? undefined,
      createdAt: toIso(row.createdAt) ?? nowIso(),
      updatedAt: toIso(row.updatedAt) ?? nowIso(),
    };
  }

  async createRun(input: {
    workspaceId: string;
    projectId: string;
    question: string;
    mode: ResearchMode;
  }): Promise<ResearchRunRecord> {
    const now = new Date();
    const id = createId('run');
    const state = emptyState();
    await this.db.insert(researchRuns).values({
      id,
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      question: input.question,
      mode: input.mode,
      stage: 'RECEIVED',
      status: 'queued',
      cancelRequested: false,
      stateJson: state as unknown as Record<string, unknown>,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id,
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      question: input.question,
      mode: input.mode,
      stage: 'RECEIVED',
      status: 'queued',
      cancelRequested: false,
      ...state,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  }

  async getRun(runId: string): Promise<ResearchRunRecord | null> {
    const [row] = await this.db
      .select()
      .from(researchRuns)
      .where(eq(researchRuns.id, runId))
      .limit(1);
    return row ? rowToRun(row) : null;
  }

  async updateRun(runId: string, patch: Partial<ResearchRunRecord>): Promise<ResearchRunRecord> {
    const current = await this.getRun(runId);
    if (!current) throw new Error(`Run not found: ${runId}`);
    const next: ResearchRunRecord = {
      ...current,
      ...patch,
      updatedAt: nowIso(),
    };
    const now = new Date();
    await this.db
      .update(researchRuns)
      .set({
        stage: next.stage,
        status: next.status,
        cancelRequested: next.cancelRequested,
        errorMessage: next.errorMessage ?? null,
        coverageScore: next.coverageScore ?? null,
        planJson: next.plan ?? null,
        intentJson: next.intent ?? null,
        stateJson: stateFromRun(next) as unknown as Record<string, unknown>,
        updatedAt: now,
        completedAt: next.completedAt ? new Date(next.completedAt) : null,
        question: next.question,
        mode: next.mode,
      })
      .where(eq(researchRuns.id, runId));
    return next;
  }

  async appendEvent(event: ResearchEventPayload): Promise<void> {
    await this.db.insert(researchEvents).values({
      id: createId('evt'),
      runId: event.runId,
      type: event.type,
      message: event.message,
      dataJson: event.data ?? null,
      createdAt: new Date(event.createdAt),
    });
  }

  async listEvents(runId: string): Promise<ResearchEventPayload[]> {
    const rows = await this.db
      .select()
      .from(researchEvents)
      .where(eq(researchEvents.runId, runId))
      .orderBy(asc(researchEvents.createdAt));
    return rows.map((row) => ({
      type: row.type,
      runId: row.runId,
      message: row.message,
      data: (row.dataJson as Record<string, unknown> | null) ?? undefined,
      createdAt: toIso(row.createdAt) ?? nowIso(),
    }));
  }

  async requestCancel(runId: string): Promise<void> {
    await this.updateRun(runId, { cancelRequested: true });
  }
}

export function createPostgresStore(db?: Database): PostgresResearchStore {
  return new PostgresResearchStore(db ?? getDb());
}
