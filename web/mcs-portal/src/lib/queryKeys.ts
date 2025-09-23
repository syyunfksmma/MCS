export const explorerKeys = {
  all: ["explorer"] as const,
  list: () => [...explorerKeys.all, "list"] as const
};

export const productKeys = {
  all: ["products"] as const,
  dashboard: () => [...productKeys.all, "dashboard"] as const
};
