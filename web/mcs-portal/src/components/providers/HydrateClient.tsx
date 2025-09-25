"use client";

import { HydrationBoundary, HydrationBoundaryProps } from "@tanstack/react-query";

export default function HydrateClient(props: HydrationBoundaryProps) {
  return <HydrationBoundary {...props} />;
}
