export const designTokens = {
  color: {
    brandPrimary: '#0f4c81',
    brandAccent: '#009999',
    brandAccentMuted: 'rgba(0, 153, 153, 0.12)',
    brandAccentStrong: '#006d6d',
    surfaceCanvas: '#f5f7fa',
    surfaceElevated: '#ffffff',
    surfaceMuted: '#e9edf5',
    textPrimary: '#1b1f29',
    textSecondary: '#516072',
    textMuted: '#7b8499',
    borderSubtle: '#d8dfe8',
    borderStrong: '#b9c4d6'
  },
  status: {
    approved: '#0f9d58',
    pending: '#d9a400',
    rejected: '#c0392b',
    draft: '#94a3b8'
  },
  spacing: {
    none: '0px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px'
  },
  radius: {
    none: '0px',
    sm: '8px',
    md: '12px',
    lg: '16px'
  },
  typography: {
    fontFamily: "'Segoe UI', 'Noto Sans KR', sans-serif",
    heading: "600 16px/1.4 'Segoe UI', 'Noto Sans KR', sans-serif",
    body: "400 14px/1.6 'Segoe UI', 'Noto Sans KR', sans-serif",
    caption: "500 12px/1.4 'Segoe UI', 'Noto Sans KR', sans-serif"
  },
  layout: {
    ribbonHeight: '64px',
    contentGutter: '24px',
    columnGap: '16px'
  },
  elevation: {
    level1: '0px 2px 8px rgba(24, 32, 68, 0.08)',
    level2: '0px 8px 24px rgba(14, 36, 70, 0.12)'
  }
} as const;

export type DesignTokens = typeof designTokens;

export const getToken = <
  T extends keyof DesignTokens,
  K extends keyof DesignTokens[T]
>(
  category: T,
  key: K
): DesignTokens[T][K] => designTokens[category][key];

