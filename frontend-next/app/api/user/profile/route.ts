import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = (await cookies()).get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // TODO: 실제 데이터베이스에서 프로필 데이터를 가져오는 로직 구현
    const mockProfile = {
      id: '1',
      name: '테스트 사용자',
      email: 'test@example.com',
      bio: '안녕하세요! 반갑습니다.',
      avatarUrl: null,
      joinedAt: '2024-01-01T00:00:00.000Z',
      stats: {
        posts: 42,
        followers: 100,
        following: 50,
      },
      recentPosts: [
        {
          id: '1',
          title: '첫 번째 게시물입니다.',
          createdAt: new Date().toISOString(),
          likes: 10,
          comments: 5,
        },
        {
          id: '2',
          title: '두 번째 게시물입니다.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          likes: 15,
          comments: 8,
        },
        {
          id: '3',
          title: '세 번째 게시물입니다.',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          likes: 20,
          comments: 12,
        },
      ],
    };

    return NextResponse.json(mockProfile);
  } catch (error) {
    return NextResponse.json(
      { error: '프로필 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 