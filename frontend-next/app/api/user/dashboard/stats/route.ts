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

    // TODO: 실제 데이터베이스에서 통계 데이터를 가져오는 로직 구현
    const mockStats = {
      totalPosts: 42,
      totalComments: 128,
      totalLikes: 256,
      recentActivities: [
        {
          id: '1',
          type: 'post',
          content: '새로운 게시물을 작성했습니다.',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'comment',
          content: '게시물에 댓글을 남겼습니다.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          type: 'like',
          content: '게시물에 좋아요를 눌렀습니다.',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ],
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    return NextResponse.json(
      { error: '통계 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 