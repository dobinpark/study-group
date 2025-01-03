'use client';

import SearchBar from '../../components/common/SearchBar';

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <SearchBar placeholder="검색어를 입력하세요" className="mb-4" />
      {/* 나머지 페이지 컨텐츠 */}
    </div>
  );
}
