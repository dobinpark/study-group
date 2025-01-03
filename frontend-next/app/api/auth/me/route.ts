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

    // TODO: 실제로는 토큰을 검증하고 사용자 정보를 가져와야 합니다
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: '테스트 사용자',
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    return NextResponse.json(
      { error: '사용자 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 