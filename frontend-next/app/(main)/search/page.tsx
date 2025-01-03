'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

interface SearchResult {
  id: string;
  type: 'user' | 'post';
  title: string;
  description: string;
  createdAt: string;
  url: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error('검색에 실패했습니다.');
      }
      const data = await response.json();
      setResults(data);
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

  return (
    <div>
      <PageHeader
        title="검색 결과"
        description={`"${query}"에 대한 검색 결과입니다`}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.url}
              className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {result.title}
                  </h3>
                  <p className="mt-1 text-gray-600">{result.description}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {result.type === 'user' ? '사용자' : '게시물'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(result.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
