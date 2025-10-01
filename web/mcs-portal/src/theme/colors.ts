export const colors = {
  brand: {
    primary: '#0f4c81',
    accent: '#009999',
    accentMuted: 'rgba(0, 153, 153, 0.12)',
    accentStrong: '#006d6d'
  },
  surface: {
    canvas: '#f5f7fa',
    elevated: '#ffffff',
    muted: '#e9edf5'
  },
  border: {
    subtle: '#d8dfe8',
    strong: '#b9c4d6'
  },
  text: {
    primary: '#1b1f29',
    secondary: '#516072',
    muted: '#7b8499'
  },
  status: {
    approved: '#0f9d58',
    pending: '#d9a400',
    rejected: '#c0392b',
    draft: '#94a3b8'
  }
} as const;

export type ColorTokens = typeof colors;
