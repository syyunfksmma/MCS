"use client";

import { useMutation } from "@tanstack/react-query";
import type { RoutingSearchResult } from "@/types/search";

type ExtendedRoutingSearchResult = RoutingSearchResult & { slaTargetMs?: number };

interface SearchArgs {
  term: string;
  pageSize?: number;
  slaTargetMs?: number;
}

export function useRoutingSearch() {
  return useMutation<ExtendedRoutingSearchResult, Error, SearchArgs>({
    mutationFn: async ({ term, pageSize = 15, slaTargetMs }: SearchArgs) => {
      const start = performance.now();
      const params = new URLSearchParams({
        q: term,
        limit: String(pageSize)
      });
      if (slaTargetMs) {
        params.set("slaTarget", String(slaTargetMs));
      }
      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error("검색 요청이 실패했습니다.");
      }
      const data = (await response.json()) as RoutingSearchResult;
      const end = performance.now();
      return {
        ...data,
        observedClientMs: Math.round(end - start),
        slaTargetMs
      };
    }
  });
}
