import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { Text, colors } from '@/ui';

const SIZE = 228;
const STROKE = 28;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export type DonutSegment = {
  key: string;
  color: string;
  amount: number;
};

type CategoryDonutProps = {
  segments: DonutSegment[];
  totalLabel: string;
};

export function CategoryDonut({ segments, totalLabel }: CategoryDonutProps) {
  const active = segments.filter((segment) => segment.amount > 0);
  const total = active.reduce((sum, segment) => sum + segment.amount, 0);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const arcs = donutArcs(active, total);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {arcs.length === 0 ? (
          <Circle cx={cx} cy={cy} r={RADIUS} stroke={colors.line} strokeWidth={STROKE} fill="none" />
        ) : arcs.length === 1 ? (
          <Circle
            cx={cx}
            cy={cy}
            r={RADIUS}
            stroke={arcs[0]?.color ?? colors.line}
            strokeWidth={STROKE}
            fill="none"
          />
        ) : (
          <G transform={`rotate(-90 ${cx} ${cy})`}>
            {arcs.map((arc) => (
              <Circle
                key={arc.key}
                cx={cx}
                cy={cy}
                r={RADIUS}
                stroke={arc.color}
                strokeWidth={STROKE}
                fill="none"
                strokeDasharray={`${arc.length} ${CIRCUMFERENCE}`}
                strokeDashoffset={-arc.offset}
              />
            ))}
          </G>
        )}
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text variant="label" tone="muted">
          Total del mes
        </Text>
        <Text variant="title" style={styles.total}>
          {totalLabel}
        </Text>
      </View>
    </View>
  );
}

function donutArcs(segments: DonutSegment[], total: number) {
  if (segments.length === 0 || total <= 0) {
    return [];
  }

  if (segments.length === 1) {
    return [{ ...segments[0], length: CIRCUMFERENCE, offset: 0 }];
  }

  let used = 0;
  return segments.map((segment, index) => {
    const length =
      index === segments.length - 1 ? CIRCUMFERENCE - used : (segment.amount / total) * CIRCUMFERENCE;
    const arc = { ...segment, length, offset: used };
    used += length;
    return arc;
  });
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    left: STROKE + 10,
    right: STROKE + 10,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  total: {
    textAlign: 'center',
  },
});
