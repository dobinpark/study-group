import { NextRequest, NextResponse } from 'next/server';

// 사용자 데이터 검증 함수
function validateUserData(data: { email: string; password: string }): string | null {
    if (!data.email.includes('@')) {
        return '유효한 이메일 주소를 입력하세요.';
    }
    if (data.password.length < 6) {
        return '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    return null;
}

// API 라우트 핸들러
export default async function handler(req: NextRequest) {
    if (req.method === 'POST') {
        const data = await req.json();
        const validationError = validateUserData(data);

        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        // 사용자 데이터가 유효한 경우, 추가 로직 수행 (예: 데이터베이스 저장)
        // ...

        return NextResponse.json({ message: '회원가입 성공' }, { status: 201 });
    }

    return NextResponse.json({ error: '지원하지 않는 메서드입니다.' }, { status: 405 });
}