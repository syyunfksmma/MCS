"use client";

import { useMutation } from "@tanstack/react-query";

interface SearchArgs {
  term: string;
  pageSize?: number;
  slaTargetMs?: number;
}

interface SearchItem {
  routingId: string;
  routingCode: string;
  productCode: string;
  revisionCode: string;
  groupName: string;
  status: string;
  updatedAt: string;
  slaMs?: number;
  observedClientMs?: number;
}

interface SearchResponse {
  total: number;
  items: SearchItem[];
  observedClientMs?: number;
  slaMs?: number;
}

export function useRoutingSearch() {
  return useMutation(async ({ term, pageSize = 15, slaTargetMs }: SearchArgs) => {
    const start = performance.now();
    const params = new URLSearchParams({
      q: term,
      limit: String(pageSize)
    });
    if (slaTargetMs) {
      params.set('slaTarget', String(slaTargetMs));
    }
    const response = await fetch(`/api/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error("검색 요청이 실패했습니다.");
    }
    const data = (await response.json()) as SearchResponse;
    const end = performance.now();
    return {
      ...data,
      observedClientMs: Math.round(end - start),
      slaTargetMs
    };
  });
}
