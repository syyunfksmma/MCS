export const explorerKeys = {
  all: ['explorer'] as const,
  list: () => [...explorerKeys.all, 'list'] as const
};

export const searchKeys = {
  all: ['routing-search'] as const,
  execute: () => [...searchKeys.all, 'execute'] as const
};
