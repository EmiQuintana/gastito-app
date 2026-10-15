export const EXPENSE_CATEGORIES = ['Comida', 'Transporte', 'Ocio', 'Otros', 'Hogar'] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const MONTHLY_BUDGET = 400_000;

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
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(Math.abs(rounded));
  return `${rounded < 0 ? '-' : ''}$${formatted}`;
}

export function formatExpenseDate(iso: string) {
  const date = new Date(iso);
  const month = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
  return `${date.getDate()} ${month}`;
}

export function formatMonthYear(date = new Date()) {
  const month = date.toLocaleDateString('es-AR', { month: 'long' });
  return `${month} ${date.getFullYear()}`;
}

export function formatTodayLabel(date = new Date()) {
  const long = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
  return `Hoy, ${long}`;
}

export function isInCurrentMonth(iso: string, now = new Date()) {
  const date = new Date(iso);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function parseAmount(raw: string) {
  const normalized = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}
