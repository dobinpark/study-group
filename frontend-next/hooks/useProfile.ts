import { useState, useEffect } from 'react';
import type { UserProfile } from '../types/user';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('프로필을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
      }
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      throw error;
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refresh: fetchProfile,
  };
} 