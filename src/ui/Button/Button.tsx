import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Text } from '../Text/Text';
import { colors, radii, sizes } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'small' | 'ghost';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.ink} />
      ) : (
        <Text variant="bodyBold" tone={variant === 'primary' ? 'inverse' : 'default'}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    borderRadius: radii.card,
    minHeight: sizes.button,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: colors.ink,
    borderRadius: radii.card,
    minHeight: sizes.button,
  },
  small: {
    backgroundColor: colors.surface,
    borderColor: colors.ink,
    borderRadius: radii.small,
    minHeight: sizes.buttonSmall,
    paddingHorizontal: 16,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    minHeight: sizes.buttonSmall,
  },
});
