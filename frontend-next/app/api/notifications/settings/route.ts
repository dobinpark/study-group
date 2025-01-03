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

    // TODO: 실제 데이터베이스에서 알림 설정을 가져오는 로직 구현
    const mockSettings = {
      email: {
        newMessage: true,
        newFollower: true,
        postComment: true,
        postLike: false,
        newsletter: true,
      },
      push: {
        newMessage: true,
        newFollower: false,
        postComment: true,
        postLike: true,
      },
    };

    return NextResponse.json(mockSettings);
  } catch (error) {
    return NextResponse.json(
      { error: '알림 설정을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = (await cookies()).get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const settings = await request.json();

    // TODO: 실제 데이터베이스에 알림 설정을 저장하는 로직 구현

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '알림 설정 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 