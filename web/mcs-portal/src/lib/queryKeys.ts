export const explorerKeys = {
  all: ['explorer'] as const,
  list: () => [...explorerKeys.all, 'list'] as const
};

export const productKeys = {
  all: ['products'] as const,
  dashboard: () => [...productKeys.all, 'dashboard'] as const
};

export const searchKeys = {
  all: ['routing-search'] as const,
  execute: () => [...searchKeys.all, 'execute'] as const
};

export const espritKeys = {
  all: ['esprit'] as const,
  jobs: () => [...espritKeys.all, 'jobs'] as const
};\nexport const routingVersionKeys = {\n  all: ['routing-versions'] as const,\n  list: (routingId: string) => [...routingVersionKeys.all, routingId] as const\n};\n
