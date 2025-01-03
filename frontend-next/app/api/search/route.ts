import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스에서 검색 로직 구현
    const mockResults = [
      {
        id: '1',
        type: 'user',
        title: '홍길동',
        description: '프로그래머 / 개발자',
        createdAt: new Date().toISOString(),
        url: '/profile/1',
      },
      {
        id: '2',
        type: 'post',
        title: 'Next.js 13 업데이트 소식',
        description: 'Next.js 13의 새로운 기능을 소개합니다.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        url: '/posts/2',
      },
      {
        id: '3',
        type: 'post',
        title: 'React 상태 관리 전략',
        description: 'React 애플리케이션의 효과적인 상태 관리 방법을 알아봅니다.',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        url: '/posts/3',
      },
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json(mockResults);
  } catch (error) {
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 