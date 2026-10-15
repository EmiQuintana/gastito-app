import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../Text/Text';
import { colors, radii, textOnFill } from '../theme';

export type ChipProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  selected?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, selected = false, color = colors.ink, disabled, style, ...rest }: ChipProps) {
  const fill = selected ? color : colors.surface;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: fill, borderColor: selected ? fill : colors.line },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <Text variant="body" style={{ color: selected ? textOnFill(fill) : colors.ink }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    backgroundColor: colors.line,
    borderColor: colors.line,
  },
});
