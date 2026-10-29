import type { Expense } from '@/domain/expense';

export const SAVED_EXPENSE_HIGHLIGHT_MS = 5_000;

export type SavedExpenseNotice = {
  expense: Expense;
  expiresAt: number;
};

let notice: SavedExpenseNotice | null = null;

export function publishSavedExpense(expense: Expense) {
  notice = {
    expense,
    expiresAt: Date.now() + SAVED_EXPENSE_HIGHLIGHT_MS,
  };
}

export function readSavedExpenseNotice() {
  if (!notice || Date.now() >= notice.expiresAt) {
    notice = null;
    return null;
  }
  return notice;
}

export function clearSavedExpenseNotice() {
  notice = null;
}
