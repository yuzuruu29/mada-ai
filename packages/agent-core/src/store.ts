import {
  assertNever,
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
  type ResearchStage,
} from '@mada-ai/shared';

export interface StoredSource {
  id: string;
  title: string;
  url: string;
  category: string;
  doi?: string;
  contentHash: string;
  text: string;
  relevance?: number;
  authority?: number;
}

export interface ResearchRunRecord {
  id: string;
  workspaceId: string;
  projectId: string;
  question: string;
  mode: ResearchMode;
  stage: ResearchStage;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  cancelRequested: boolean;
  intent?: IntentClassification;
  plan?: ResearchPlan;
  queries: string[];
  searchResults: NormalizedSearchResult[];
  sources: StoredSource[];
  evidence: EvidenceRecord[];
  claims: ClaimRecord[];
  claimEvidence: ClaimEvidenceLink[];
  report?: ReportDocument;
  reportMarkdown?: string;
  coverageScore?: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ProjectRecord {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceBundle {
  userId: string;
  workspaceId: string;
  email: string;
  name: string;
}

export interface ResearchStore {
  ensureGuestWorkspace(input?: {
    email?: string;
    name?: string;
    userId?: string;
    workspaceId?: string;
  }): Promise<WorkspaceBundle>;
  ensureUserWorkspace?(input: {
    userId: string;
    email: string;
    name: string;
    workspaceId?: string;
  }): Promise<WorkspaceBundle>;
  listProjects(workspaceId: string): Promise<ProjectRecord[]>;
  createProject(input: {
    workspaceId: string;
    title: string;
    description?: string;
  }): Promise<ProjectRecord>;
  getProject(workspaceId: string, projectId: string): Promise<ProjectRecord | null>;
  createRun(input: {
    workspaceId: string;
    projectId: string;
    question: string;
    mode: ResearchMode;
  }): Promise<ResearchRunRecord>;
  getRun(runId: string): Promise<ResearchRunRecord | null>;
  updateRun(runId: string, patch: Partial<ResearchRunRecord>): Promise<ResearchRunRecord>;
  appendEvent(event: ResearchEventPayload): Promise<void>;
  listEvents(runId: string): Promise<ResearchEventPayload[]>;
  requestCancel(runId: string): Promise<void>;
}

export class MemoryResearchStore implements ResearchStore {
  private readonly projects = new Map<string, ProjectRecord>();
  private readonly runs = new Map<string, ResearchRunRecord>();
  private readonly events = new Map<string, ResearchEventPayload[]>();
  private guest: WorkspaceBundle | null = null;

  async ensureGuestWorkspace(input?: {
    email?: string;
    name?: string;
    userId?: string;
    workspaceId?: string;
  }): Promise<WorkspaceBundle> {
    if (!this.guest) {
      const userId = input?.userId ?? createId('usr');
      this.guest = {
        userId,
        workspaceId: input?.workspaceId ?? createId('ws'),
        email: input?.email ?? `guest+${userId}@mada.local`,
        name: input?.name ?? 'Guest Researcher',
      };
    }
    return this.guest;
  }

  async ensureUserWorkspace(input: {
    userId: string;
    email: string;
    name: string;
    workspaceId?: string;
  }): Promise<WorkspaceBundle> {
    this.guest = {
      userId: input.userId,
      workspaceId: input.workspaceId ?? this.guest?.workspaceId ?? createId('ws'),
      email: input.email,
      name: input.name,
    };
    return this.guest;
  }

  async listProjects(workspaceId: string): Promise<ProjectRecord[]> {
    return [...this.projects.values()]
      .filter((p) => p.workspaceId === workspaceId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async createProject(input: {
    workspaceId: string;
    title: string;
    description?: string;
  }): Promise<ProjectRecord> {
    const now = nowIso();
    const project: ProjectRecord = {
      id: createId('prj'),
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(project.id, project);
    return project;
  }

  async getProject(workspaceId: string, projectId: string): Promise<ProjectRecord | null> {
    const project = this.projects.get(projectId);
    if (!project || project.workspaceId !== workspaceId) return null;
    return project;
  }

  async createRun(input: {
    workspaceId: string;
    projectId: string;
    question: string;
    mode: ResearchMode;
  }): Promise<ResearchRunRecord> {
    const now = nowIso();
    const run: ResearchRunRecord = {
      id: createId('run'),
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      question: input.question,
      mode: input.mode,
      stage: 'RECEIVED',
      status: 'queued',
      cancelRequested: false,
      queries: [],
      searchResults: [],
      sources: [],
      evidence: [],
      claims: [],
      claimEvidence: [],
      createdAt: now,
      updatedAt: now,
    };
    this.runs.set(run.id, run);
    this.events.set(run.id, []);
    return run;
  }

  async getRun(runId: string): Promise<ResearchRunRecord | null> {
    return this.runs.get(runId) ?? null;
  }

  async updateRun(runId: string, patch: Partial<ResearchRunRecord>): Promise<ResearchRunRecord> {
    const current = this.runs.get(runId);
    if (!current) throw new Error(`Run not found: ${runId}`);
    const next = { ...current, ...patch, updatedAt: nowIso() };
    this.runs.set(runId, next);
    return next;
  }

  async appendEvent(event: ResearchEventPayload): Promise<void> {
    const list = this.events.get(event.runId) ?? [];
    list.push(event);
    this.events.set(event.runId, list);
  }

  async listEvents(runId: string): Promise<ResearchEventPayload[]> {
    return this.events.get(runId) ?? [];
  }

  async requestCancel(runId: string): Promise<void> {
    await this.updateRun(runId, { cancelRequested: true });
  }
}

export function createMemoryStore(): MemoryResearchStore {
  return new MemoryResearchStore();
}

/** Process-wide store for local vertical-slice demos without Postgres. */
let singleton: MemoryResearchStore | null = null;
export function getGlobalMemoryStore(): MemoryResearchStore {
  if (!singleton) singleton = new MemoryResearchStore();
  return singleton;
}

export function stageMessage(stage: ResearchStage): string {
  switch (stage) {
    case 'RECEIVED':
      return 'Research run received';
    case 'CLASSIFY_INTENT':
      return 'Classified research intent';
    case 'BUILD_PLAN':
      return 'Created research plan';
    case 'GENERATE_QUERIES':
      return 'Generated search queries';
    case 'SEARCH':
      return 'Executed searches';
    case 'RANK_RESULTS':
      return 'Ranked candidate sources';
    case 'FETCH_AND_PARSE':
      return 'Fetched and parsed sources';
    case 'EXTRACT_EVIDENCE':
      return 'Extracted evidence';
    case 'ASSESS_COVERAGE':
      return 'Assessed evidence coverage';
    case 'GENERATE_FOLLOWUP_QUERIES':
      return 'Generated follow-up queries';
    case 'BUILD_CLAIMS':
      return 'Built claims';
    case 'SYNTHESIZE_REPORT':
      return 'Synthesized report';
    case 'VERIFY_CITATIONS':
      return 'Verified citations';
    case 'REPAIR_CLAIMS_OR_SOURCES':
      return 'Repaired unsupported claims';
    case 'FINALIZE':
      return 'Finalized research run';
    case 'FAILED':
      return 'Research run failed';
    case 'CANCELLED':
      return 'Research run cancelled';
    default:
      return assertNever(stage);
  }
}
