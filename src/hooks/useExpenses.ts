import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Expense } from '@/domain/expense';
import { loadExpenses } from '@/storage/expenseStorage';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await loadExpenses();
    const sorted = [...next].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setExpenses(sorted);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { expenses, loading, refresh };
}
