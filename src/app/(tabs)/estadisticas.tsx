import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatAmount, formatMonthYear, isInCurrentMonth } from '@/domain/expense';
import { useExpenses } from '@/hooks/useExpenses';
import { Text, categoryColor, colors, sizes, spacing } from '@/ui';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { expenses } = useExpenses();
  const rows = useMemo(() => {
    const totals = new Map<string, number>();
    for (const expense of expenses) {
      if (!isInCurrentMonth(expense.createdAt)) {
        continue;
      }
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    }
    return [...totals.entries()]
      .map(([category, amount]) => ({
        category,
        amount,
        color: categoryColor(category),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);
  const max = rows.reduce((peak, row) => Math.max(peak, row.amount), 0);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top === 0 ? spacing.lg : spacing.sm }]}
      >
        <Text variant="title">Estadísticas</Text>
        <Text variant="secondary" tone="muted">
          {formatMonthYear()}
        </Text>

        {rows.length === 0 ? (
          <Text variant="heading" style={styles.empty}>
            Todavía no hay gastos este mes
          </Text>
        ) : (
          <View style={styles.list}>
            {rows.map((row) => (
              <View key={row.category} style={styles.row}>
                <View style={styles.rowTop}>
                  <View style={styles.name}>
                    <View style={[styles.dot, { backgroundColor: row.color }]} />
                    <Text variant="bodyBold">{row.category}</Text>
                  </View>
                  <Text variant="bodyBold">{formatAmount(row.amount)}</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        backgroundColor: row.color,
                        width: `${max > 0 ? (row.amount / max) * 100 : 0}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    gap: spacing.sm,
  },
  empty: {
    marginTop: spacing.xl,
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  row: {
    gap: spacing.sm,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
