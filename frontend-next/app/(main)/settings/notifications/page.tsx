'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import FileUpload from '../../../../components/common/FileUpload';
import ImagePreview from '../../../../components/common/ImagePreview';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 비밀번호 확인
      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        throw new Error('새 비밀번호가 일치하지 않습니다.');
      }

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('설정 저장에 실패했습니다.');
      }

      setSuccess('설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append('avatar', files[0]);

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('프로필 이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();
      setAvatar(data.avatarUrl);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.'
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">설정</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">프로필 이미지</h2>
        {avatar && (
          <div className="mb-4 w-32">
            <ImagePreview
              src={avatar}
              alt="프로필 이미지"
              onRemove={() => setAvatar(null)}
            />
          </div>
        )}
        <FileUpload
          onUpload={handleAvatarUpload}
          accept="image/*"
          maxSize={5 * 1024 * 1024}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            이름
          </label>
          <input
            type="text"
            value={String(formData.username)}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">비밀번호 변경</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                새 비밀번호
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="small" /> : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}
