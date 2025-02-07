import 'express-session';

declare module 'express-session' {
    interface SessionData {
        userId: number; // 또는 string, 실제 데이터 타입에 맞게 설정
        username?: string; // 추가적인 세션 데이터가 있다면 여기에 정의
        user?: import('../user/entities/user.entity').User; // User 엔티티 타입 추가
    }
}
