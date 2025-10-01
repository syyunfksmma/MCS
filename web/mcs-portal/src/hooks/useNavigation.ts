'use client';

import { useNavigationContext } from '@/components/providers/NavigationProvider';

export function useNavigation() {
  return useNavigationContext();
}
