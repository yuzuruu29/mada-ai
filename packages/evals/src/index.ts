export interface EvalCase {
  id: string;
  question: string;
  expectedSourceTypes?: string[];
  criticalFacts?: string[];
}

export const GOLDEN_STARTER: EvalCase[] = [
  {
    id: 'uhi-1',
    question: 'What causes urban heat islands?',
    expectedSourceTypes: ['primary_research', 'government'],
    criticalFacts: ['built environment', 'heat retention'],
  },
];
