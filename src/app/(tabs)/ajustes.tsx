import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatAmount, MONTHLY_BUDGET } from '@/domain/expense';
import { Card, Text, colors, sizes, spacing } from '@/ui';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={[styles.content, { paddingTop: insets.top === 0 ? spacing.lg : spacing.sm }]}>
        <Text variant="title">Ajustes</Text>
        <Card style={styles.card}>
          <Text variant="label" tone="muted">
            Presupuesto del mes
          </Text>
          <Text variant="heading">{formatAmount(MONTHLY_BUDGET)}</Text>
          <Text variant="secondary" tone="muted">
            Es el tope que usa Inicio para calcular cuánto te queda.
          </Text>
        </Card>
      </View>
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
    gap: spacing.lg,
  },
  card: {
    gap: spacing.sm,
  },
});
