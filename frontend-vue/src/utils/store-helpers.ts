import { useUserStore } from '../store/user';
import type { UserStore } from '../store/user';

// 타입이 보장된 스토어 액세스 함수
export function useTypedUserStore(): UserStore {
  return useUserStore() as unknown as UserStore;
} 