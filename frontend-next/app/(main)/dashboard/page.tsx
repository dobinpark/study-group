'use client';

import { useState, useEffect } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  recentActivities: {
    id: string;
    type: 'post' | 'comment' | 'like';
    content: string;
    createdAt: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('통계 데이터를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="대시보드"
        description="활동 통계와 최근 활동을 확인하세요"
      />

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">총 게시물</h3>
              <p className="text-3xl font-bold text-primary-600">
                {stats.totalPosts}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">총 댓글</h3>
              <p className="text-3xl font-bold text-primary-600">
                {stats.totalComments}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">받은 좋아요</h3>
              <p className="text-3xl font-bold text-primary-600">
                {stats.totalLikes}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                최근 활동
              </h3>
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 