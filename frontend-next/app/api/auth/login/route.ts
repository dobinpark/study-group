import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: 실제 인증 로직 구현
    // 예시 코드입니다. 실제로는 백엔드 API를 호출하거나 데이터베이스를 확인해야 합니다.
    if (email === 'test@example.com' && password === 'password') {
      // 인증 성공 시 토큰 생성
      const token = 'example-token'; // 실제로는 JWT 등을 사용해야 합니다

      // 쿠키에 토큰 저장
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Set-Cookie': `auth-token=${token}; HttpOnly; Path=/; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
        }
      });
    }

    // 인증 실패
    return NextResponse.json(
      { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
