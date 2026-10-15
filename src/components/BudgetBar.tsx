import { StyleSheet, View } from 'react-native';

import { colors, radii, sizes } from '@/ui';

export type BudgetSegment = {
  key: string;
  color: string;
  amount: number;
};

type BudgetBarProps = {
  segments: BudgetSegment[];
  total: number;
  budget: number;
};

export function BudgetBar({ segments, total, budget }: BudgetBarProps) {
  const spentRatio = budget > 0 ? Math.min(Math.max(total, 0) / budget, 1) : 0;
  const active = segments.filter((segment) => segment.amount > 0);
  const emptyRatio = Math.max(1 - spentRatio, 0);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: budget, now: total }}
      style={styles.track}
    >
      {spentRatio > 0 && active.length > 0 ? (
        <View style={[styles.spent, { flex: spentRatio }]}>
          {active.map((segment) => (
            <View key={segment.key} style={{ flex: segment.amount, backgroundColor: segment.color }} />
          ))}
        </View>
      ) : null}
      {emptyRatio > 0 ? <View style={{ flex: emptyRatio }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: sizes.budgetBar,
    borderRadius: radii.pill,
    backgroundColor: colors.line,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  spent: {
    flexDirection: 'row',
    height: '100%',
  },
});
