import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BudgetBar } from '@/components/BudgetBar';
import { ExpenseNotice } from '@/components/ExpenseNotice';
import {
  formatAmount,
  formatExpenseDate,
  formatMonthYear,
  isInCurrentMonth,
  MONTHLY_BUDGET,
  type Expense,
} from '@/domain/expense';
import { useExpenses } from '@/hooks/useExpenses';
import {
  clearSavedExpenseNotice,
  readSavedExpenseNotice,
  type SavedExpenseNotice,
} from '@/state/savedExpenseNotice';
import { deleteExpense } from '@/storage/expenseStorage';
import { BrandWordmark, Button, Card, Text, categoryColor, colors, radii, sizes, spacing } from '@/ui';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { expenses, loading, refresh } = useExpenses();
  const [savedNotice, setSavedNotice] = useState<SavedExpenseNotice | null>(null);
  const [undoing, setUndoing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const current = readSavedExpenseNotice();
      setSavedNotice(current);
      if (!current) {
        return undefined;
      }

      const remaining = Math.max(0, current.expiresAt - Date.now());
      const timer = setTimeout(() => {
        clearSavedExpenseNotice();
        setSavedNotice(null);
      }, remaining);

      return () => clearTimeout(timer);
    }, []),
  );

  async function onUndo() {
    if (!savedNotice || undoing) {
      return;
    }
    setUndoing(true);
    try {
      await deleteExpense(savedNotice.expense.id);
      clearSavedExpenseNotice();
      setSavedNotice(null);
      await refresh();
    } catch {
      // El aviso sigue en pantalla para poder reintentar.
    } finally {
      setUndoing(false);
    }
  }

  const monthExpenses = useMemo(
    () => expenses.filter((expense) => isInCurrentMonth(expense.createdAt)),
    [expenses],
  );
  const total = useMemo(
    () => monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [monthExpenses],
  );
  const segments = useMemo(() => {
    const totals = new Map<string, number>();
    for (const expense of monthExpenses) {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    }
    return [...totals.entries()]
      .map(([category, amount]) => ({
        key: category,
        category,
        amount,
        color: categoryColor(category),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthExpenses]);

  const remaining = MONTHLY_BUDGET - total;
  const remainingCopy =
    remaining >= 0
      ? `Te quedan ${formatAmount(remaining)} de ${formatAmount(MONTHLY_BUDGET)}`
      : `Te pasaste ${formatAmount(Math.abs(remaining))} de ${formatAmount(MONTHLY_BUDGET)}`;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top === 0 ? spacing.lg : spacing.sm }]}>
        <BrandWordmark />
        <Text variant="secondary" tone="muted">
          {formatMonthYear()}
        </Text>
      </View>

      {monthExpenses.length === 0 ? (
        <View style={styles.emptyScreen}>
          <View style={styles.emptyCardWrap}>
            <Card style={styles.summaryCard}>
              <View style={styles.summary}>
                <Text variant="label" tone="muted">
                  Gastaste este mes
                </Text>
                <Text variant="amount" style={styles.total}>
                  {formatAmount(0).replace('$', '$ ')}
                </Text>
                <Text variant="secondary" tone="muted">
                  Tenés {formatAmount(MONTHLY_BUDGET).replace('$', '$ ')} para este mes
                </Text>
              </View>
              <BudgetBar segments={[]} total={0} budget={MONTHLY_BUDGET} />
            </Card>
          </View>
          <View style={styles.empty}>
            <View style={styles.emptyRing}>
              <View style={styles.emptyRingGap} />
            </View>
            <Text variant="section" style={styles.emptyTitle}>
              Todavía no hay gastos
            </Text>
            <Text variant="secondary" tone="muted" style={styles.emptyBody}>
              Cargá el primero y vas a ver acá cómo se reparte tu presupuesto del mes.
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Card style={styles.summaryCard}>
            <View style={styles.summary}>
              <Text variant="label" tone="muted">
                Gastaste este mes
              </Text>
              <Text variant="amount" style={styles.total}>
                {formatAmount(total)}
              </Text>
              <Text variant="secondary" tone="muted">
                {remainingCopy}
              </Text>
            </View>

            <BudgetBar segments={segments} total={total} budget={MONTHLY_BUDGET} />

            {segments.length > 0 ? (
              <View style={styles.legend}>
                {segments.map((segment) => (
                  <View key={segment.key} style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: segment.color }]} />
                    <Text variant="caption" tone="muted">
                      {segment.category} {formatAmount(segment.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </Card>

          <Text variant="section" style={styles.section}>
            Movimientos
          </Text>

          {monthExpenses.map((expense, index) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              isLast={index === monthExpenses.length - 1}
              highlighted={savedNotice?.expense.id === expense.id}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        {savedNotice ? (
          <ExpenseNotice
            tone="success"
            title="Gasto guardado"
            detail={savedDetail(savedNotice.expense)}
            actionLabel="Deshacer"
            onAction={() => {
              void onUndo();
            }}
            actionBusy={undoing}
          />
        ) : null}
        <Button
          label={monthExpenses.length === 0 ? 'Agregar el primer gasto' : 'Agregar gasto'}
          fullWidth
          onPress={() => router.push('/nuevo')}
        />
      </View>
    </SafeAreaView>
  );
}

function savedDetail(expense: Expense) {
  const title = expense.note.trim() || expense.category;
  return `${title} · ${formatAmount(expense.amount)}`;
}

function ExpenseRow({
  expense,
  isLast,
  highlighted,
}: {
  expense: Expense;
  isLast: boolean;
  highlighted: boolean;
}) {
  const title = expense.note.trim() || expense.category;

  return (
    <View
      style={[
        styles.row,
        highlighted && styles.rowHighlight,
        !isLast && !highlighted && styles.rowDivider,
      ]}
    >
      <View style={styles.rowText}>
        <Text variant="bodyBold">{title}</Text>
        <Text variant="caption" tone="muted">
          {expense.category} · {formatExpenseDate(expense.createdAt)}
        </Text>
      </View>
      <Text variant="bodyBold">{formatAmount(expense.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.xl,
    backgroundColor: colors.paper,
  },
  summaryCard: {
    gap: spacing.lg,
  },
  summary: {
    gap: spacing.xs,
  },
  total: {
    color: colors.coral,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  legendItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyScreen: {
    flex: 1,
  },
  emptyCardWrap: {
    paddingHorizontal: sizes.screenPadding,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  emptyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 7,
    borderColor: '#D8D3CB',
    marginBottom: spacing.md,
  },
  emptyRingGap: {
    position: 'absolute',
    top: -3,
    right: 10,
    width: 16,
    height: 14,
    backgroundColor: colors.paper,
    transform: [{ rotate: '28deg' }],
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyBody: {
    textAlign: 'center',
    maxWidth: 320,
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowHighlight: {
    backgroundColor: '#D4F4F1',
    borderRadius: radii.card,
    paddingHorizontal: spacing.md,
    marginHorizontal: -spacing.sm,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  footer: {
    paddingHorizontal: sizes.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
});
