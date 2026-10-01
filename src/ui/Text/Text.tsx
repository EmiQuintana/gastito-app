import { Platform, Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { theme } from '../theme';

export type TextVariant = 'display' | 'title' | 'body' | 'caption' | 'label';
export type TextTone = 'default' | 'muted' | 'inverse' | 'danger';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

export function Text({
  variant = 'body',
  tone = 'default',
  style,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText style={[styles.base, styles[variant], toneStyles[tone], style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.color.ink,
  },
  display: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.display,
    lineHeight: theme.lineHeight.display,
    ...(Platform.OS === 'web' ? { fontWeight: theme.fontWeight.bold } : {}),
  },
  title: {
    fontFamily: theme.fontFamily.semibold,
    fontSize: theme.fontSize.title,
    lineHeight: theme.lineHeight.title,
    ...(Platform.OS === 'web' ? { fontWeight: theme.fontWeight.semibold } : {}),
  },
  body: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    ...(Platform.OS === 'web' ? { fontWeight: theme.fontWeight.regular } : {}),
  },
  caption: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.caption,
    lineHeight: theme.lineHeight.caption,
    ...(Platform.OS === 'web' ? { fontWeight: theme.fontWeight.regular } : {}),
  },
  label: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.label,
    lineHeight: theme.lineHeight.label,
    ...(Platform.OS === 'web' ? { fontWeight: theme.fontWeight.medium } : {}),
  },
});

const toneStyles = StyleSheet.create({
  default: { color: theme.color.ink },
  muted: { color: theme.color.muted },
  inverse: { color: theme.color.onPrimary },
  danger: { color: theme.color.danger },
});
