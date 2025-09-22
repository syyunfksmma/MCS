export const explorerKeys = {
  all: ['explorer'] as const,
  list: () => [...explorerKeys.all, 'list'] as const
};
