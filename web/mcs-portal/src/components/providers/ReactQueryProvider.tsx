'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export default function ReactQueryProvider({
  children
}: ReactQueryProviderProps) {
  // QueryClient는 클라이언트마다 한 번만 생성
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
