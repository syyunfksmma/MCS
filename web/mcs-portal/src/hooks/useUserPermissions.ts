import { useQuery } from '@tanstack/react-query';
import { fetchUserPermissions } from '@/lib/api/users';
import { userKeys } from '@/lib/queryKeys';
import type { UserPermissions } from '@/types/userPermissions';

export function useUserPermissions() {
  return useQuery<UserPermissions>({
    queryKey: userKeys.permissions(),
    queryFn: fetchUserPermissions,
    staleTime: 5 * 60 * 1000
  });
}