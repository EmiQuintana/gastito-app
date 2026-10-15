import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { colors, type as typeScale } from '../theme';

export type TextVariant = keyof typeof typeScale;
export type TextTone = 'default' | 'muted' | 'inverse';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

export function Text({ variant = 'body', tone = 'default', style, children, ...rest }: TextProps) {
  return (
    <RNText style={[styles.base, typeScale[variant], toneStyles[tone], style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.ink,
  },
});

const toneStyles = StyleSheet.create({
  default: { color: colors.ink },
  muted: { color: colors.muted },
  inverse: { color: colors.surface },
});
