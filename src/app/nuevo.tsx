import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  createExpenseId,
  EXPENSE_CATEGORIES,
  formatAmount,
  formatTodayLabel,
  parseAmount,
  type ExpenseCategory,
} from '@/domain/expense';
import { saveExpense } from '@/storage/expenseStorage';
import { Button, Chip, Text, TextField, categoryColor, colors, sizes, spacing, type } from '@/ui';

export default function NewExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Comida');
  const [amountError, setAmountError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();

  function onAmountChange(value: string) {
    const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    setAmount(digits);
    if (amountError) {
      setAmountError(undefined);
    }
  }

  async function onSubmit() {
    const parsed = parseAmount(amount);
    if (parsed === null) {
      setAmountError('Ingresá un monto mayor a 0');
      return;
    }

    setAmountError(undefined);
    setSaving(true);
    try {
      await saveExpense({
        id: createExpenseId(),
        amount: parsed,
        category,
        note: note.trim(),
        createdAt: new Date().toISOString(),
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  const amountLabel = amount ? formatAmount(Number(amount)) : '';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top === 0 ? spacing.lg : spacing.sm },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="title" style={styles.title}>
              Nuevo gasto
            </Text>
            <Button label="Cancelar" variant="small" onPress={onCancel} />
          </View>

          <View style={styles.block}>
            <Text variant="label" tone="muted">
              Monto
            </Text>
            <TextInput
              accessibilityLabel="Monto"
              value={amountLabel}
              onChangeText={onAmountChange}
              placeholder="$0"
              placeholderTextColor={colors.grey}
              keyboardType="number-pad"
              style={styles.amount}
            />
            {amountError ? (
              <Text variant="caption" accessibilityLiveRegion="polite">
                {amountError}
              </Text>
            ) : null}
          </View>

          <TextField
            label="Descripción (opcional)"
            value={note}
            onChangeText={setNote}
            placeholder="Verdulería"
          />

          <View style={styles.block}>
            <Text variant="label" tone="muted">
              Categoría
            </Text>
            <View style={styles.chips}>
              {EXPENSE_CATEGORIES.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  color={categoryColor(item)}
                  selected={item === category}
                  onPress={() => setCategory(item)}
                />
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <Text variant="label" tone="muted">
              Fecha
            </Text>
            <Text variant="body">{formatTodayLabel()}</Text>
          </View>

          <Button
            label="Guardar gasto"
            fullWidth
            loading={saving}
            onPress={() => {
              void onSubmit();
            }}
            style={styles.save}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flex: 1,
  },
  block: {
    gap: spacing.sm,
  },
  amount: {
    ...type.amount,
    color: colors.coral,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  save: {
    marginTop: spacing.sm,
  },
});
