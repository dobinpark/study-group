import { NextResponse } from 'next/server';

// 임시 데이터 예시
const mockNotifications = [
  {
    id: '1',
    title: '새로운 메시지',
    message: '새로운 메시지가 도착했습니다.',
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: '2',
    title: '시스템 알림',
    message: '시스템 점검이 예정되어 있습니다.',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
    isRead: true,
  },
];

export async function GET() {
  try {
    // TODO: 실제 데이터베이스에서 알림 데이터를 가져오는 로직 구현
    return NextResponse.json(mockNotifications);
  } catch (error) {
    return NextResponse.json(
      { error: '알림을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 