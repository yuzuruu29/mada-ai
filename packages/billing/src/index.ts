import { createId, nowIso } from '@mada-ai/shared';

export type CreditTxType =
  | 'credit_purchase'
  | 'subscription_grant'
  | 'research_reservation'
  | 'research_settlement'
  | 'refund'
  | 'manual_adjustment'
  | 'expiration';

export interface CreditLedgerEntry {
  id: string;
  accountId: string;
  type: CreditTxType;
  amount: number;
  idempotencyKey?: string;
  createdAt: string;
}

/** Append-only credit ledger helpers (Phase 7). Balance is derived, never mutated alone. */
export function appendCreditTransaction(input: {
  accountId: string;
  type: CreditTxType;
  amount: number;
  idempotencyKey?: string;
}): CreditLedgerEntry {
  return {
    id: createId('ctx'),
    accountId: input.accountId,
    type: input.type,
    amount: input.amount,
    idempotencyKey: input.idempotencyKey,
    createdAt: nowIso(),
  };
}

export function balanceFromLedger(entries: CreditLedgerEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.amount, 0);
}
