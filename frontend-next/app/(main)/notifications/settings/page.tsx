'use client';

import { useState, useEffect } from 'react';
import PageHeader from '../../../../components/common/PageHeader';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

interface NotificationSettings {
  email: {
    newMessage: boolean;
    newFollower: boolean;
    postComment: boolean;
    postLike: boolean;
    newsletter: boolean;
  };
  push: {
    newMessage: boolean;
    newFollower: boolean;
    postComment: boolean;
    postLike: boolean;
  };
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings');
      if (!response.ok) {
        throw new Error('설정을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (category: 'email' | 'push', setting: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting as keyof typeof settings[typeof category]],
      },
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('설정 저장에 실패했습니다.');
      }

      setSuccess('알림 설정이 저장되었습니다.');
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        설정을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="알림 설정"
        description="알림 수신 방법을 설정하세요"
      />

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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">이메일 알림</h3>
            <div className="space-y-4">
              {Object.entries(settings.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-gray-700">
                    {key === 'newMessage' && '새 메시지'}
                    {key === 'newFollower' && '새 팔로워'}
                    {key === 'postComment' && '게시물 댓글'}
                    {key === 'postLike' && '게시물 좋아요'}
                    {key === 'newsletter' && '뉴스레터'}
                  </label>
                  <button
                    onClick={() => handleToggle('email', key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      value ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">푸시 알림</h3>
            <div className="space-y-4">
              {Object.entries(settings.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-gray-700">
                    {key === 'newMessage' && '새 메시지'}
                    {key === 'newFollower' && '새 팔로워'}
                    {key === 'postComment' && '게시물 댓글'}
                    {key === 'postLike' && '게시물 좋아요'}
                  </label>
                  <button
                    onClick={() => handleToggle('push', key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      value ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSaving ? <LoadingSpinner size="small" /> : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 