"use client";
import { useMutation } from "@tanstack/react-query";

interface SearchResponse {
  total: number;
  items: Array<{
    routingId: string;
    routingCode: string;
    productCode: string;
    revisionCode: string;
    groupName: string;
    status: string;
    updatedAt: string;
    slaMs?: number;
    observedClientMs?: number;
  }>;
  observedClientMs?: number;
  slaMs?: number;
}

export function useRoutingSearch() {
  return useMutation(async (term: string) => {
    const start = performance.now();
    const response = await fetch(`/api/search?q=${encodeURIComponent(term)}&limit=15`);
    if (!response.ok) {
      throw new Error("검색 요청이 실패했습니다.");
    }
    const data = (await response.json()) as SearchResponse;
    const end = performance.now();
    return {
      ...data,
      observedClientMs: Math.round(end - start)
    };
  });
}
