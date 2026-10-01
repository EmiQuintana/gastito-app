import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Expense } from '@/domain/expense';

const STORAGE_KEY = 'gastito.expenses.v1';

export async function loadExpenses(): Promise<Expense[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as Expense[];
  } catch {
    return [];
  }
}

export async function saveExpense(expense: Expense) {
  const expenses = await loadExpenses();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([expense, ...expenses]));
}
