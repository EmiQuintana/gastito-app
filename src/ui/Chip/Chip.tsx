import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../Text/Text';
import { theme } from '../theme';

export type ChipProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, selected = false, disabled, style, ...rest }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.idle,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <Text
        variant="label"
        style={selected ? styles.selectedLabel : styles.idleLabel}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  idle: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.border,
  },
  selected: {
    backgroundColor: theme.color.highlight,
    borderColor: theme.color.highlight,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    backgroundColor: theme.color.disabled,
    borderColor: theme.color.disabled,
  },
  idleLabel: {
    color: theme.color.ink,
  },
  selectedLabel: {
    color: theme.color.ink,
  },
});
