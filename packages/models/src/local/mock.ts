import type {
  CostEstimate,
  ModelCapabilities,
  ModelEvent,
  ModelProvider,
  ModelRequest,
  ModelResponse,
  ModelTask,
} from '../types.js';
import { estimateFromPrices } from '../types.js';

function extractJsonObject(prompt: string): Record<string, unknown> | null {
  const match = prompt.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Deterministic local provider for tests and zero-key local demos.
 * Produces structured research artifacts without calling external APIs.
 */
export class MockModelProvider implements ModelProvider {
  capabilities(): ModelCapabilities {
    return {
      id: 'mock-community',
      label: 'Community',
      supportsStreaming: true,
      supportsStructuredOutput: true,
      maxContextTokens: 32_000,
    };
  }

  async estimateCost(request: ModelRequest): Promise<CostEstimate> {
    const inputTokens = Math.ceil((request.system.length + request.prompt.length) / 4);
    return estimateFromPrices('mock-community', inputTokens, request.maxTokens ?? 512);
  }

  async complete(request: ModelRequest): Promise<ModelResponse> {
    const text = this.respond(request);
    return {
      text,
      inputTokens: Math.ceil((request.system.length + request.prompt.length) / 4),
      outputTokens: Math.ceil(text.length / 4),
      modelId: 'mock-community',
      provider: 'mock',
    };
  }

  async *stream(request: ModelRequest): AsyncIterable<ModelEvent> {
    const text = this.respond(request);
    const chunkSize = 48;
    for (let i = 0; i < text.length; i += chunkSize) {
      yield { type: 'delta', text: text.slice(i, i + chunkSize) };
    }
    yield { type: 'done' };
  }

  private respond(request: ModelRequest): string {
    const task: ModelTask = request.task;
    switch (task) {
      case 'classification':
        return JSON.stringify({
          task_type: 'literature_review',
          freshness: 'last_5_years',
          source_domains: ['academic', 'web'],
          depth: 'research',
          needs_code: false,
          needs_files: false,
          high_stakes: /medical|legal|financial|safety/i.test(request.prompt),
        });
      case 'planning': {
        const question =
          (extractJsonObject(request.prompt)?.question as string | undefined) ??
          request.prompt.slice(0, 240);
        return JSON.stringify({
          objective: question,
          subquestions: [
            `What are the core definitions and scope of: ${question}?`,
            `What primary evidence and recent findings address: ${question}?`,
            `Where do sources agree or conflict about: ${question}?`,
            `What limitations and open questions remain for: ${question}?`,
          ],
          search_strategy: [
            'Start with scholarly metadata (OpenAlex/Crossref)',
            'Supplement with high-authority web sources',
            'Prefer primary documents over secondary commentary',
          ],
          inclusion_criteria: ['relevant to the research question', 'identifiable publisher or venue'],
          exclusion_criteria: ['spam', 'unattributed opinion without evidence'],
          freshness_requirements: { prefer: 'last_5_years' },
          preferred_source_types: ['primary_research', 'government', 'news'],
          completion_criteria: [
            'At least 3 independent sources',
            'Critical claims have supporting evidence',
            'Limitations are stated',
          ],
        });
      }
      case 'query_generation': {
        const question =
          (extractJsonObject(request.prompt)?.question as string | undefined) ??
          'research topic';
        const base = question.replace(/[?]/g, '').trim();
        return JSON.stringify({
          queries: [
            base,
            `${base} review`,
            `${base} evidence`,
            `${base} systematic findings`,
            `${base} limitations`,
            `${base} recent studies`,
          ],
        });
      }
      case 'source_relevance':
        return JSON.stringify({ relevance: 0.72, reason: 'Title and snippet overlap research terms.' });
      case 'extraction':
        return JSON.stringify({
          evidence: [
            {
              quoteOrExcerpt: 'Key finding extracted from source text.',
              normalizedProposition: 'The source reports a relevant finding related to the question.',
              evidenceType: 'finding',
              supportStrength: 0.7,
            },
          ],
        });
      case 'citation_verification': {
        const claim = String(extractJsonObject(request.prompt)?.claim ?? '');
        const evidence = String(extractJsonObject(request.prompt)?.evidence ?? '');
        const overlap = claim
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 4 && evidence.toLowerCase().includes(w)).length;
        const score = Math.min(0.95, 0.35 + overlap * 0.08);
        return JSON.stringify({
          status: score >= 0.65 ? 'verified' : score >= 0.45 ? 'partial' : 'unsupported',
          entailmentScore: score,
          explanation: 'Lexical overlap heuristic used by mock verifier.',
        });
      }
      case 'synthesis': {
        const question =
          (extractJsonObject(request.prompt)?.question as string | undefined) ?? 'Research question';
        return JSON.stringify({
          title: `Research report: ${question.slice(0, 80)}`,
          executive_summary:
            'This report synthesizes retrieved sources into an evidence-backed overview. Citations map to stored evidence records.',
          sections: [
            {
              heading: 'Overview',
              markdown: `The research question asked: **${question}**. Findings below are grounded in retrieved sources.`,
              claimIds: [],
            },
            {
              heading: 'Findings',
              markdown: 'Multiple sources provide related definitions, findings, and constraints.',
              claimIds: [],
            },
            {
              heading: 'Limitations',
              markdown: 'Coverage depends on available open sources and configured providers.',
              claimIds: [],
            },
          ],
          limitations: [
            'Mock/community model used for synthesis when no premium provider is configured.',
            'Source availability and fetch success affect completeness.',
          ],
          contradictions: [],
          confidence: { overall: 0.62 },
        });
      }
      default: {
        const _exhaustive: never = task;
        throw new Error(`Unhandled model task: ${String(_exhaustive)}`);
      }
    }
  }
}
