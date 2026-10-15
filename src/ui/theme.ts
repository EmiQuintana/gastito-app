import { Platform, type TextStyle } from 'react-native';

export const colors = {
  paper: '#F2EFEA',
  coral: '#FC7753',
  mint: '#66D7D1',
  ink: '#403D58',
  lemon: '#DBD56E',
  surface: '#FFFFFF',
  muted: '#6B6880',
  line: '#DDD8D0',
  grey: '#9B98AC',
} as const;

export const categoryColors = {
  comida: colors.coral,
  transporte: colors.lemon,
  hogar: colors.mint,
  ocio: colors.ink,
  otros: colors.grey,
} as const;

export const categoryPalette = [
  colors.coral,
  colors.lemon,
  colors.mint,
  colors.ink,
  colors.grey,
] as const;

const nativeFonts = {
  medium: 'Figtree_500Medium',
  bold: 'Figtree_700Bold',
  extraBold: 'Figtree_800ExtraBold',
} as const;

export const fonts = {
  medium: Platform.select({ web: 'Figtree, Figtree_500Medium', default: nativeFonts.medium }) as string,
  bold: Platform.select({ web: 'Figtree, Figtree_700Bold', default: nativeFonts.bold }) as string,
  extraBold: Platform.select({
    web: 'Figtree, Figtree_800ExtraBold',
    default: nativeFonts.extraBold,
  }) as string,
} as const;

function face(family: string, weight: TextStyle['fontWeight']): TextStyle {
  return {
    fontFamily: family,
    ...(Platform.OS === 'web' ? { fontWeight: weight } : null),
  };
}

export const type = {
  amountXL: {
    ...face(fonts.extraBold, '800'),
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -2,
  },
  amount: {
    ...face(fonts.extraBold, '800'),
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1.5,
  },
  title: {
    ...face(fonts.extraBold, '800'),
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  heading: {
    ...face(fonts.extraBold, '800'),
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  section: { ...face(fonts.bold, '700'), fontSize: 18, lineHeight: 24 },
  body: { ...face(fonts.medium, '500'), fontSize: 16, lineHeight: 22 },
  bodyBold: { ...face(fonts.bold, '700'), fontSize: 16, lineHeight: 22 },
  secondary: { ...face(fonts.medium, '500'), fontSize: 15, lineHeight: 22 },
  label: { ...face(fonts.medium, '500'), fontSize: 14, lineHeight: 20 },
  caption: { ...face(fonts.medium, '500'), fontSize: 13, lineHeight: 18 },
  tab: { ...face(fonts.bold, '700'), fontSize: 12, lineHeight: 16 },
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 20, xl: 28 } as const;

export const radii = {
  small: 12,
  input: 14,
  card: 16,
  panel: 22,
  pill: 24,
} as const;

export const sizes = {
  screenPadding: 20,
  button: 56,
  buttonSmall: 44,
  tabBar: 76,
  tabPill: { width: 56, height: 30 },
  swatch: 48,
  budgetBar: 14,
} as const;

export function categoryColor(category: string) {
  const key = category.toLowerCase() as keyof typeof categoryColors;
  if (key in categoryColors) {
    return categoryColors[key];
  }
  if (category === 'Súper') {
    return colors.coral;
  }
  return colors.grey;
}

export function textOnFill(fill: string) {
  return fill.toLowerCase() === colors.ink.toLowerCase() ? colors.surface : colors.ink;
}

export const theme = {
  colors,
  categoryColors,
  categoryPalette,
  fonts,
  type,
  spacing,
  radii,
  sizes,
} as const;

export type Theme = typeof theme;
