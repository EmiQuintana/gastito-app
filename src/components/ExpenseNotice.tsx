import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text, colors, radii, spacing } from '@/ui';

type ExpenseNoticeProps = {
  tone: 'success' | 'error';
  title: string;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionBusy?: boolean;
};

export function ExpenseNotice({
  tone,
  title,
  detail,
  actionLabel,
  onAction,
  actionBusy = false,
}: ExpenseNoticeProps) {
  const accent = tone === 'success' ? colors.mint : colors.coral;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={styles.banner}
    >
      <View style={[styles.icon, { backgroundColor: accent }]}>
        <Ionicons
          name={tone === 'success' ? 'checkmark' : 'close'}
          size={18}
          color={colors.surface}
        />
      </View>
      <View style={styles.copy}>
        <Text variant="bodyBold">{title}</Text>
        {detail ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {detail}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          accessibilityState={{ busy: actionBusy, disabled: actionBusy }}
          disabled={actionBusy}
          hitSlop={8}
          onPress={onAction}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        >
          {actionBusy ? (
            <ActivityIndicator color={accent} size="small" />
          ) : (
            <Text variant="bodyBold" style={{ color: accent }}>
              {actionLabel}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    boxShadow: '0 6px 16px rgba(64, 61, 88, 0.08)',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  action: {
    minHeight: 32,
    justifyContent: 'center',
  },
  actionPressed: {
    opacity: 0.7,
  },
});
