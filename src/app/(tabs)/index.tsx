import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BudgetBar } from '@/components/BudgetBar';
import {
  formatAmount,
  formatExpenseDate,
  formatMonthYear,
  isInCurrentMonth,
  MONTHLY_BUDGET,
  type Expense,
} from '@/domain/expense';
import { useExpenses } from '@/hooks/useExpenses';
import { BrandWordmark, Button, Text, categoryColor, colors, sizes, spacing } from '@/ui';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { expenses, loading } = useExpenses();
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
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top === 0 ? spacing.lg : spacing.sm }]}
      >
        <View style={styles.header}>
          <BrandWordmark />
          <Text variant="secondary" tone="muted">
            {formatMonthYear()}
          </Text>
        </View>

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

        <Text variant="section" style={styles.section}>
          Movimientos
        </Text>

        {monthExpenses.length === 0 ? (
          <Text variant="secondary" tone="muted">
            Todavía no hay movimientos este mes.
          </Text>
        ) : (
          monthExpenses.map((expense, index) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              isLast={index === monthExpenses.length - 1}
            />
          ))
        )}

        <Button
          label="Agregar gasto"
          fullWidth
          onPress={() => router.push('/nuevo')}
          style={styles.addButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ExpenseRow({ expense, isLast }: { expense: Expense; isLast: boolean }) {
  const title = expense.note.trim() || expense.category;

  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
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
  content: {
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  summary: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  total: {
    color: colors.coral,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
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
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  addButton: {
    marginTop: spacing.lg,
  },
});
