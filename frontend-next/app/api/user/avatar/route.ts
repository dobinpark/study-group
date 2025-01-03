import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const avatar = formData.get('avatar') as File;

    if (!avatar) {
      return NextResponse.json(
        { error: '이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 파일 업로드 로직 구현
    // 예: S3나 다른 스토리지에 업로드

    return NextResponse.json({
      success: true,
      avatarUrl: '/temp-avatar-url.jpg', // 실제 업로드된 URL로 대체해야 함
    });
  } catch (error) {
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 