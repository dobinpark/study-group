'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 에러 로깅 로직을 여기에 추가할 수 있습니다
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        문제가 발생했습니다
      </h2>
      <p className="text-gray-600 mb-4">
        죄송합니다. 페이지를 로드하는 중에 오류가 발생했습니다.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
