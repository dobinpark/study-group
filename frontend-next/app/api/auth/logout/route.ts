import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 인증 토큰 쿠키 삭제
    (await
      // 인증 토큰 쿠키 삭제
      cookies()).delete('auth-token');

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Set-Cookie': 'auth-token=; HttpOnly; Path=/; Max-Age=0'
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 