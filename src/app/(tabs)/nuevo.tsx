import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import {
  createExpenseId,
  EXPENSE_CATEGORIES,
  parseAmount,
  type ExpenseCategory,
} from '@/domain/expense';
import { saveExpense } from '@/storage/expenseStorage';
import { Button, Chip, Text, TextField, theme } from '@/ui';

export default function NewExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Súper');
  const [amountError, setAmountError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

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
      setAmount('');
      setNote('');
      setCategory('Súper');
      router.replace('/');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="title">¿En qué gastaste?</Text>
        <Text tone="muted">Usá los mismos campos que después vas a poder cargar con IA.</Text>

        <TextField
          label="Monto"
          value={amount}
          onChangeText={(value) => {
            setAmount(value);
            if (amountError) {
              setAmountError(undefined);
            }
          }}
          placeholder="5000"
          keyboardType="numeric"
          error={amountError}
        />

        <View style={styles.block}>
          <Text variant="label">Categoría</Text>
          <View style={styles.chips}>
            {EXPENSE_CATEGORIES.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={item === category}
                onPress={() => setCategory(item)}
              />
            ))}
          </View>
        </View>

        <TextField
          label="Nota (opcional)"
          value={note}
          onChangeText={setNote}
          placeholder="Almuerzo, súper, uber..."
        />

        <Button
          label="Guardar gasto"
          loading={saving}
          onPress={() => {
            void onSubmit();
          }}
          style={styles.fullButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  content: {
    padding: theme.space.xl,
    gap: theme.space.lg,
  },
  block: {
    gap: theme.space.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  fullButton: {
    alignSelf: 'stretch',
  },
});
