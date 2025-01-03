import PageHeader from '../../../components/common/PageHeader';

export default function ExamplePage() {
  const breadcrumbs = [
    { label: '홈', href: '/' },
    { label: '예시', href: '/example' },
    { label: '상세' },
  ];

  const actions = (
    <button className="px-4 py-2 bg-primary-500 text-white rounded-lg">
      새로 만들기
    </button>
  );

  return (
    <div>
      <PageHeader
        title="예시 페이지"
        description="이것은 예시 페이지입니다."
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      {/* 페이지 컨텐츠 */}
    </div>
  );
} 