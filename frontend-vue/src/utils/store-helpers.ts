import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/user';

// 인증 관련 기능과 사용자 정보를 함께 가져오는 편의 함수
export function useAuth() {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  
  return {
    // 인증 상태
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    
    // 사용자 정보
    user: userStore.user,
    
    // 인증 메서드
    login: authStore.login,
    logout: authStore.logout,
    checkSession: authStore.checkSession,
    
    // 사용자 프로필 메서드
    updateProfile: userStore.updateProfile,
    changePassword: userStore.changePassword
  };
} 