import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Session } from './user/entities/session.entity';
import { Post } from './posts/entities/post.entity';
import { StudyGroup } from './study/entities/study-group.entity';

export const dataSource = new DataSource({
    type: 'mysql', // 사용 중인 데이터베이스 타입
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'ddgh930810',
    database: process.env.DB_DATABASE || 'study_group',
    entities: [User, Session, Post, StudyGroup], // 엔티티 목록에 Post와 StudyGroup 추가
    synchronize: true, // 개발 환경에서만 true로 설정 (프로덕션에서는 false 권장)
});
