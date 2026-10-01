import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Text } from '../Text/Text';
import { theme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
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
        pressed && !isDisabled && pressedStyles[variant],
        disabled && !loading && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.color.onPrimary : theme.color.ink}
        />
      ) : (
        <Text tone={variant === 'primary' ? 'inverse' : 'default'} variant="label" style={labelStyles[variant]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  disabled: {
    backgroundColor: theme.color.disabled,
    borderColor: theme.color.disabled,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.color.primary,
    borderColor: theme.color.primary,
  },
  secondary: {
    backgroundColor: theme.color.accent,
    borderColor: theme.color.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

const pressedStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.color.primaryPressed,
    borderColor: theme.color.primaryPressed,
  },
  secondary: {
    backgroundColor: theme.color.accentPressed,
    borderColor: theme.color.accentPressed,
  },
  ghost: {
    backgroundColor: theme.color.primaryMuted,
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: theme.color.onPrimary,
  },
  secondary: {
    color: theme.color.ink,
  },
  ghost: {
    color: theme.color.primary,
  },
});
