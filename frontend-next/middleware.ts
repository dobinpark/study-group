import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호된 라우트 목록
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  // 추가 보호 경로...
];

export function middleware(request: NextRequest) {
  // 현재 경로가 보호된 라우트인지 확인
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // 세션/토큰 확인 (예: 쿠키에서 토큰 확인)
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/login', request.url);
      // 로그인 후 원래 페이지로 돌아오기 위해 returnUrl 추가
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 