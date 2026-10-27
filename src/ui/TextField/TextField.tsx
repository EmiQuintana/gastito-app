import { Platform, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { Text } from '../Text/Text';
import { colors, fonts, radii, spacing } from '../theme';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, editable = true, keyboardType, ...rest }: TextFieldProps) {
  const hasError = Boolean(error);

  return (
    <View style={styles.wrap}>
      <Text variant="label" tone="muted">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        editable={editable}
        keyboardType={keyboardType}
        placeholderTextColor={colors.grey}
        style={[styles.input, hasError && styles.inputError, !editable && styles.inputDisabled]}
        {...rest}
      />
      {hasError ? (
        <Text variant="caption" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const inputHeight = 52;
const inputLineHeight = 22;

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
    width: '100%',
  },
  input: {
    height: inputHeight,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: 0,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: inputLineHeight,
    textAlignVertical: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
    ...(Platform.OS === 'ios'
      ? {
          paddingTop: (inputHeight - inputLineHeight) / 2,
          paddingBottom: (inputHeight - inputLineHeight) / 2,
        }
      : null),
    ...(Platform.OS === 'web' ? { fontWeight: '500' as const } : null),
  },
  inputError: {
    borderColor: colors.coral,
  },
  inputDisabled: {
    backgroundColor: colors.line,
    color: colors.grey,
  },
});
