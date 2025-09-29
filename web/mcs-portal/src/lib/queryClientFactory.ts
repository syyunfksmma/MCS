import { QueryClient, DefaultOptions } from "@tanstack/react-query";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  },
  mutations: {
    retry: 1
  }
};

export function createQueryClient() {
  return new QueryClient({ defaultOptions });
}
