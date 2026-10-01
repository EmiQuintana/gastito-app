import { Platform } from 'react-native';

export const palette = {
  paper: '#F2EFEA',
  coral: '#FC7753',
  mint: '#66D7D1',
  ink: '#403D58',
  lemon: '#DBD56E',
} as const;

export const theme = {
  color: {
    background: palette.paper,
    surface: palette.paper,
    ink: palette.ink,
    muted: '#6A6780',
    border: '#C5C3CE',
    primary: palette.coral,
    primaryPressed: '#E35E3C',
    primaryMuted: '#FAD4C8',
    onPrimary: palette.paper,
    accent: palette.mint,
    accentPressed: '#4FC4BE',
    highlight: palette.lemon,
    danger: palette.coral,
    dangerMuted: '#FAD4C8',
    disabled: '#D8D4CE',
    disabledText: '#8A8796',
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
  },
  fontFamily: {
    regular: Platform.select({ web: 'Figtree', default: 'Figtree_400Regular' }) as string,
    medium: Platform.select({ web: 'Figtree', default: 'Figtree_500Medium' }) as string,
    semibold: Platform.select({ web: 'Figtree', default: 'Figtree_600SemiBold' }) as string,
    bold: Platform.select({ web: 'Figtree', default: 'Figtree_700Bold' }) as string,
  },
  fontSize: {
    caption: 12,
    label: 13,
    body: 16,
    title: 22,
    display: 28,
  },
  lineHeight: {
    caption: 16,
    label: 18,
    body: 22,
    title: 28,
    display: 34,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export type Theme = typeof theme;
