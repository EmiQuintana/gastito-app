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
import { ExpenseNotice } from '@/components/ExpenseNotice';
import { publishSavedExpense } from '@/state/savedExpenseNotice';
import { saveExpense } from '@/storage/expenseStorage';
import { Button, Chip, Text, TextField, categoryColor, colors, radii, sizes, spacing, type } from '@/ui';

export default function NewExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Comida');
  const [amountError, setAmountError] = useState<string | undefined>();
  const [saveFailed, setSaveFailed] = useState(false);
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

    const expense = {
      id: createExpenseId(),
      amount: parsed,
      category,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };

    setAmountError(undefined);
    setSaveFailed(false);
    setSaving(true);
    try {
      await saveExpense(expense);
      publishSavedExpense(expense);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch {
      setSaveFailed(true);
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

  const amountLabel = amount ? formatAmount(Number(amount)).replace('$', '') : '';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.top === 0 ? spacing.lg : spacing.sm }]}>
          <Text variant="title" style={styles.title}>
            Nuevo gasto
          </Text>
          <Button
            label="Cancelar"
            variant="small"
            onPress={onCancel}
            style={{ backgroundColor: 'transparent' }}
          />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.block}>
            <Text variant="label" tone="muted">
              Monto
            </Text>
            <View style={styles.amountRow}>
              <Text style={styles.amountCurrency}>$</Text>
              <View style={styles.amountGap} />
              <TextInput
                accessibilityLabel="Monto"
                value={amountLabel}
                onChangeText={onAmountChange}
                placeholder="0"
                placeholderTextColor={colors.grey}
                keyboardType="number-pad"
                style={styles.amountInput}
              />
            </View>
            <View style={styles.amountLine} />
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
            <View style={styles.dateField}>
              <Text variant="body">{formatTodayLabel()}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {saveFailed ? (
            <ExpenseNotice
              tone="error"
              title="No se pudo guardar"
              detail="El gasto no se guardó. Intentá de nuevo."
            />
          ) : null}
          <Button
            label="Guardar gasto"
            fullWidth
            loading={saving}
            onPress={() => {
              void onSubmit();
            }}
          />
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.lg,
    backgroundColor: colors.paper,
  },
  title: {
    flex: 1,
  },
  content: {
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  block: {
    gap: spacing.xs,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    width: '100%',
    minWidth: 0,
  },
  amountCurrency: {
    ...type.amount,
    color: colors.coral,
  },
  amountGap: {
    width: spacing.sm,
    alignSelf: 'center',
  },
  amountInput: {
    ...type.amount,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    color: colors.ink,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  amountLine: {
    height: 2,
    backgroundColor: colors.coral,
    marginTop: spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dateField: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.input,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: sizes.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.paper,
  },
});
