import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { theme } from '../theme';

export type CardProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
});
