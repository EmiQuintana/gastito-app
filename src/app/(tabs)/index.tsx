import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { formatAmount, formatExpenseDate, type Expense } from '@/domain/expense';
import { useExpenses } from '@/hooks/useExpenses';
import { Button, Card, Text, theme } from '@/ui';

export default function HomeScreen() {
  const { expenses, loading } = useExpenses();
  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.color.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text variant="display">Gastito</Text>
          <Text tone="muted">Anotá tus gastos como si le escribieras a un amigo.</Text>
          <Card style={styles.totalCard}>
            <Text variant="label" tone="muted">
              Total
            </Text>
            <Text variant="title">{formatAmount(total)}</Text>
          </Card>
        </View>
      }
      ListEmptyComponent={
        <Card>
          <Text variant="title">Todavía no hay gastos</Text>
          <Text tone="muted" style={styles.emptyBody}>
            Cargá el primero con monto, categoría y una nota corta.
          </Text>
          <Button
            label="Nuevo gasto"
            onPress={() => router.push('/nuevo')}
            style={styles.fullButton}
          />
        </Card>
      }
      renderItem={({ item }) => <ExpenseRow expense={item} />}
    />
  );
}

function ExpenseRow({ expense }: { expense: Expense }) {
  return (
    <Card style={styles.row}>
      <View style={styles.rowTop}>
        <Text variant="label" tone="muted">
          {expense.category}
        </Text>
        <Text variant="caption" tone="muted">
          {formatExpenseDate(expense.createdAt)}
        </Text>
      </View>
      <Text variant="title">{formatAmount(expense.amount)}</Text>
      {expense.note ? (
        <Text tone="muted" style={styles.note}>
          {expense.note}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.background,
  },
  list: {
    padding: theme.space.xl,
    gap: theme.space.md,
    backgroundColor: theme.color.background,
    flexGrow: 1,
  },
  header: {
    gap: theme.space.sm,
    marginBottom: theme.space.sm,
  },
  totalCard: {
    marginTop: theme.space.sm,
  },
  emptyBody: {
    marginTop: theme.space.sm,
    marginBottom: theme.space.lg,
  },
  fullButton: {
    alignSelf: 'stretch',
  },
  row: {
    gap: theme.space.xs,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  note: {
    marginTop: theme.space.xs,
  },
});
