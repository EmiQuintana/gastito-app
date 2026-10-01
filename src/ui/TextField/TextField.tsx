import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { Text } from '../Text/Text';
import { theme } from '../theme';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string;
};

export function TextField({
  label,
  error,
  editable = true,
  keyboardType,
  ...rest
}: TextFieldProps) {
  const hasError = Boolean(error);

  return (
    <View style={styles.wrap}>
      <Text variant="label" style={styles.label}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        editable={editable}
        keyboardType={keyboardType}
        placeholderTextColor={theme.color.muted}
        style={[
          styles.input,
          hasError && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
        {...rest}
      />
      {hasError ? (
        <Text tone="danger" variant="caption" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.space.xs,
    width: '100%',
  },
  label: {
    color: theme.color.ink,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.md,
    backgroundColor: theme.color.surface,
    color: theme.color.ink,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.body,
  },
  inputError: {
    borderColor: theme.color.danger,
    backgroundColor: theme.color.dangerMuted,
  },
  inputDisabled: {
    backgroundColor: theme.color.disabled,
    color: theme.color.disabledText,
  },
});
