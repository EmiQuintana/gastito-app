import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryDonut } from '@/components/CategoryDonut';
import {
  addMonths,
  firstHistoryMonth,
  formatAmount,
  formatMonthYear,
  isInMonth,
  sharePercents,
  startOfMonth,
} from '@/domain/expense';
import { useExpenses } from '@/hooks/useExpenses';
import { Card, Text, categoryColor, colors, radii, sizes, spacing } from '@/ui';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { expenses } = useExpenses();
  const now = useMemo(() => startOfMonth(new Date()), []);
  const [month, setMonth] = useState(now);
  const firstMonth = useMemo(
    () => firstHistoryMonth(expenses.map((expense) => expense.createdAt), now),
    [expenses, now],
  );
  const selected = clampMonth(month, firstMonth, now);
  const atStart = selected.getTime() <= firstMonth.getTime();
  const atEnd = selected.getTime() >= now.getTime();

  const rows = useMemo(() => {
    const totals = new Map<string, number>();
    for (const expense of expenses) {
      if (!isInMonth(expense.createdAt, selected)) {
        continue;
      }
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    }
    const sorted = [...totals.entries()]
      .map(([category, amount]) => ({
        category,
        amount,
        color: categoryColor(category),
      }))
      .sort((a, b) => b.amount - a.amount || a.category.localeCompare(b.category, 'es'));
    const percents = sharePercents(sorted.map((row) => row.amount));
    return sorted.map((row, index) => ({ ...row, percent: percents[index] ?? 0 }));
  }, [expenses, selected]);

  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  function showPrevious() {
    if (atStart) {
      return;
    }
    setMonth(addMonths(selected, -1));
  }

  function showNext() {
    if (atEnd) {
      return;
    }
    setMonth(addMonths(selected, 1));
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top === 0 ? spacing.lg : spacing.sm },
        ]}
      >
        <Text variant="title">Estadísticas</Text>

        <View style={styles.monthRow}>
          <MonthButton
            label="Mes anterior"
            icon="chevron-back"
            disabled={atStart}
            onPress={showPrevious}
          />
          <Text variant="bodyBold" style={styles.monthLabel}>
            {formatMonthYear(selected)}
          </Text>
          <MonthButton
            label="Mes siguiente"
            icon="chevron-forward"
            disabled={atEnd}
            onPress={showNext}
          />
        </View>

        <Card style={styles.chartCard}>
          <CategoryDonut
            segments={rows.map((row) => ({
              key: row.category,
              color: row.color,
              amount: row.amount,
            }))}
            totalLabel={formatMoney(total)}
          />
        </Card>

        {rows.length === 0 ? (
          <Text variant="secondary" tone="muted" style={styles.empty}>
            Todavía no hay gastos este mes
          </Text>
        ) : (
          <View style={styles.legend}>
            {rows.map((row) => (
              <View key={row.category} style={styles.legendRow}>
                <View style={styles.legendName}>
                  <View style={[styles.dot, { backgroundColor: row.color }]} />
                  <Text variant="body" numberOfLines={1} style={styles.legendLabel}>
                    {row.category}
                  </Text>
                </View>
                <Text variant="body" style={styles.percent}>
                  {row.percent}%
                </Text>
                <Text variant="body" style={styles.amount}>
                  {formatMoney(row.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function clampMonth(month: Date, first: Date, last: Date) {
  if (month.getTime() < first.getTime()) {
    return first;
  }
  if (month.getTime() > last.getTime()) {
    return last;
  }
  return month;
}

function formatMoney(amount: number) {
  return formatAmount(amount).replace('$', '$ ');
}

function MonthButton({
  label,
  icon,
  disabled,
  onPress,
}: {
  label: string;
  icon: 'chevron-back' | 'chevron-forward';
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.monthButton,
        pressed && !disabled && styles.monthButtonPressed,
        disabled && styles.monthButtonDisabled,
      ]}
    >
      <Ionicons name={icon} size={20} color={disabled ? colors.grey : colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  monthLabel: {
    flex: 1,
    textAlign: 'center',
  },
  monthButton: {
    width: 44,
    height: 44,
    borderRadius: radii.input,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthButtonPressed: {
    opacity: 0.7,
  },
  monthButtonDisabled: {
    opacity: 0.45,
  },
  chartCard: {
    alignItems: 'center',
    borderRadius: radii.panel,
    paddingVertical: spacing.xl,
  },
  empty: {
    textAlign: 'center',
  },
  legend: {
    gap: spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendLabel: {
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  percent: {
    width: 48,
    textAlign: 'right',
  },
  amount: {
    width: 112,
    textAlign: 'right',
  },
});
