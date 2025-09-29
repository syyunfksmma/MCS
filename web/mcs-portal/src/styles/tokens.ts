export const designTokens = {
  color: {
    primary: '#1A6AF4',
    primaryHover: '#1657C7',
    danger: '#D83B3B',
    success: '#0B8F4D',
    warning: '#F6A609',
    info: '#1E90B8',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F7FA',
    text: '#1B1F29',
    textMuted: '#5C6270',
    border: '#D9DEE7'
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
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    headingWeight: 600,
    bodyWeight: 400,
    captionWeight: 500,
    sizeXs: '12px',
    sizeSm: '14px',
    sizeMd: '16px',
    sizeLg: '20px',
    sizeXl: '24px'
  },
  elevation: {
    level1: '0px 2px 8px rgba(24, 32, 68, 0.08)',
    level2: '0px 6px 16px rgba(24, 32, 68, 0.12)'
  }
};

export type DesignTokens = typeof designTokens;

export const getToken = <T extends keyof DesignTokens, K extends keyof DesignTokens[T]>(
  category: T,
  key: K
): DesignTokens[T][K] => designTokens[category][key];
