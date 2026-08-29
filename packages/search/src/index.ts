import { createId, type NormalizedSearchResult } from '@mada-ai/shared';

export interface SearchRequest {
  query: string;
  limit?: number;
  freshness?: string;
  language?: string;
}

export interface SearchCapabilities {
  id: string;
  domains: Array<'web' | 'academic'>;
  requiresApiKey: boolean;
}

export interface HealthStatus {
  ok: boolean;
  detail?: string;
}

export interface SearchProvider {
  search(request: SearchRequest): Promise<NormalizedSearchResult[]>;
  healthCheck(): Promise<HealthStatus>;
  capabilities(): SearchCapabilities;
}

export class OpenAlexProvider implements SearchProvider {
  capabilities(): SearchCapabilities {
    return { id: 'openalex', domains: ['academic'], requiresApiKey: false };
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      const res = await fetch('https://api.openalex.org/works?per-page=1', {
        headers: { 'User-Agent': 'Mada.AI/0.1 (mailto:research@mada.ai)' },
      });
      return { ok: res.ok, detail: `status ${res.status}` };
    } catch (error) {
      return { ok: false, detail: error instanceof Error ? error.message : 'error' };
    }
  }

  async search(request: SearchRequest): Promise<NormalizedSearchResult[]> {
    const limit = request.limit ?? 5;
    const url = new URL('https://api.openalex.org/works');
    url.searchParams.set('search', request.query);
    url.searchParams.set('per-page', String(limit));
    url.searchParams.set('sort', 'relevance_score:desc');
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mada.AI/0.1 (mailto:research@mada.ai)' },
    });
    if (!res.ok) {
      throw new Error(`OpenAlex failed: ${res.status}`);
    }
    const data = (await res.json()) as {
      results?: Array<{
        id?: string;
        display_name?: string;
        doi?: string;
        publication_year?: number;
        authorships?: Array<{ author?: { display_name?: string } }>;
        abstract_inverted_index?: Record<string, number[]>;
        primary_location?: { landing_page_url?: string; source?: { display_name?: string } };
        open_access?: { oa_url?: string };
      }>;
    };
    return (data.results ?? []).map((work) => {
      const doi = work.doi?.replace('https://doi.org/', '');
      const landing =
        work.open_access?.oa_url ??
        work.primary_location?.landing_page_url ??
        (doi ? `https://doi.org/${doi}` : work.id ?? 'https://openalex.org');
      return {
        id: createId('sr'),
        provider: 'openalex',
        title: work.display_name ?? 'Untitled work',
        url: landing,
        snippet: invertAbstract(work.abstract_inverted_index).slice(0, 400),
        publishedAt: work.publication_year ? `${work.publication_year}-01-01` : undefined,
        doi,
        authors: (work.authorships ?? [])
          .map((a) => a.author?.display_name)
          .filter((name): name is string => Boolean(name)),
        score: 0.75,
      } satisfies NormalizedSearchResult;
    });
  }
}

function invertAbstract(index?: Record<string, number[]>): string {
  if (!index) return '';
  const words: Array<{ word: string; pos: number }> = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const pos of positions) words.push({ word, pos });
  }
  words.sort((a, b) => a.pos - b.pos);
  return words.map((w) => w.word).join(' ');
}

export class CrossrefProvider implements SearchProvider {
  capabilities(): SearchCapabilities {
    return { id: 'crossref', domains: ['academic'], requiresApiKey: false };
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      const res = await fetch('https://api.crossref.org/works?rows=1');
      return { ok: res.ok };
    } catch (error) {
      return { ok: false, detail: error instanceof Error ? error.message : 'error' };
    }
  }

  async search(request: SearchRequest): Promise<NormalizedSearchResult[]> {
    const limit = request.limit ?? 5;
    const url = new URL('https://api.crossref.org/works');
    url.searchParams.set('query', request.query);
    url.searchParams.set('rows', String(limit));
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mada.AI/0.1 (mailto:research@mada.ai)' },
    });
    if (!res.ok) throw new Error(`Crossref failed: ${res.status}`);
    const data = (await res.json()) as {
      message?: {
        items?: Array<{
          DOI?: string;
          title?: string[];
          URL?: string;
          abstract?: string;
          authored?: unknown;
          author?: Array<{ given?: string; family?: string }>;
          published?: { 'date-parts'?: number[][] };
        }>;
      };
    };
    return (data.message?.items ?? []).map((item) => ({
      id: createId('sr'),
      provider: 'crossref',
      title: item.title?.[0] ?? 'Untitled',
      url: item.URL ?? (item.DOI ? `https://doi.org/${item.DOI}` : 'https://crossref.org'),
      snippet: (item.abstract ?? '').replace(/<[^>]+>/g, '').slice(0, 400),
      doi: item.DOI,
      authors: (item.author ?? []).map((a) => [a.given, a.family].filter(Boolean).join(' ')),
      publishedAt: item.published?.['date-parts']?.[0]
        ? item.published['date-parts'][0]!.join('-')
        : undefined,
      score: 0.7,
    }));
  }
}

/** Fallback web provider when no Brave/SearXNG key is configured. */
export class WikipediaWebProvider implements SearchProvider {
  capabilities(): SearchCapabilities {
    return { id: 'wikipedia', domains: ['web'], requiresApiKey: false };
  }

  async healthCheck(): Promise<HealthStatus> {
    return { ok: true };
  }

  async search(request: SearchRequest): Promise<NormalizedSearchResult[]> {
    const limit = request.limit ?? 5;
    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.searchParams.set('action', 'query');
    url.searchParams.set('list', 'search');
    url.searchParams.set('srsearch', request.query);
    url.searchParams.set('srlimit', String(limit));
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Wikipedia search failed: ${res.status}`);
    const data = (await res.json()) as {
      query?: { search?: Array<{ title: string; snippet: string; pageid: number }> };
    };
    return (data.query?.search ?? []).map((hit) => ({
      id: createId('sr'),
      provider: 'wikipedia',
      title: hit.title,
      url: `https://en.wikipedia.org/?curid=${hit.pageid}`,
      snippet: hit.snippet.replace(/<[^>]+>/g, ''),
      score: 0.55,
    }));
  }
}

export class SearXNGProvider implements SearchProvider {
  constructor(private readonly baseUrl: string) {}

  capabilities(): SearchCapabilities {
    return { id: 'searxng', domains: ['web'], requiresApiKey: false };
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      const res = await fetch(this.baseUrl);
      return { ok: res.ok };
    } catch (error) {
      return { ok: false, detail: error instanceof Error ? error.message : 'error' };
    }
  }

  async search(request: SearchRequest): Promise<NormalizedSearchResult[]> {
    const url = new URL('/search', this.baseUrl);
    url.searchParams.set('q', request.query);
    url.searchParams.set('format', 'json');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`SearXNG failed: ${res.status}`);
    const data = (await res.json()) as {
      results?: Array<{ title?: string; url?: string; content?: string }>;
    };
    return (data.results ?? []).slice(0, request.limit ?? 5).map((r) => ({
      id: createId('sr'),
      provider: 'searxng',
      title: r.title ?? 'Untitled',
      url: r.url ?? this.baseUrl,
      snippet: r.content ?? '',
      score: 0.6,
    }));
  }
}

export class SearchRouter {
  constructor(private readonly providers: SearchProvider[]) {}

  async search(request: SearchRequest, domains?: Array<'web' | 'academic'>) {
    const selected = this.providers.filter((p) => {
      if (!domains?.length) return true;
      return p.capabilities().domains.some((d) => domains.includes(d));
    });
    const batches = await Promise.all(
      selected.map(async (provider) => {
        try {
          return await provider.search(request);
        } catch {
          return [] as NormalizedSearchResult[];
        }
      }),
    );
    const merged = batches.flat();
    const seen = new Set<string>();
    return merged.filter((item) => {
      const key = (item.doi ?? item.url).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

export function createSearchRouterFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): SearchRouter {
  const providers: SearchProvider[] = [
    new OpenAlexProvider(),
    new CrossrefProvider(),
    new WikipediaWebProvider(),
  ];
  if (env.SEARXNG_BASE_URL) {
    providers.push(new SearXNGProvider(env.SEARXNG_BASE_URL));
  }
  return new SearchRouter(providers);
}
