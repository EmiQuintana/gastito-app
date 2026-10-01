export const EXPENSE_CATEGORIES = ['Súper', 'Transporte', 'Comida', 'Ocio', 'Otros'] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type Expense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  createdAt: string;
};

export function createExpenseId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatExpenseDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  });
}

export function parseAmount(raw: string) {
  const normalized = raw.replace(/\s/g, '').replace(',', '.');
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}
