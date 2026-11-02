export const EXPENSE_CATEGORIES = ['Comida', 'Transporte', 'Hogar', 'Ocio', 'Otros'] as const;

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

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

export function isInMonth(iso: string, month: Date) {
  const date = new Date(iso);
  return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
}

export function firstHistoryMonth(dates: string[], now = new Date()) {
  const current = startOfMonth(now);
  let first = addMonths(current, -11);
  for (const iso of dates) {
    const month = startOfMonth(new Date(iso));
    if (month.getTime() < first.getTime()) {
      first = month;
    }
  }
  return first;
}

export function sharePercents(amounts: number[]) {
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  if (total <= 0) {
    return amounts.map(() => 0);
  }

  const exact = amounts.map((amount) => (amount / total) * 100);
  const floors = exact.map((value) => Math.floor(value));
  let leftover = 100 - floors.reduce((sum, value) => sum + value, 0);
  const order = exact
    .map((value, index) => ({ index, fraction: value - (floors[index] ?? 0) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  for (const item of order) {
    if (leftover <= 0) {
      break;
    }
    floors[item.index] = (floors[item.index] ?? 0) + 1;
    leftover -= 1;
  }

  return floors;
}

export function parseAmount(raw: string) {
  const normalized = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}
