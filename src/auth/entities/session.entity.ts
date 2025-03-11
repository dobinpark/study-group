import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('sessions') // 테이블 이름을 'sessions'로 지정 (connect-typeorm 기본값)
export class Session {
    @PrimaryColumn('varchar', { length: 255 })
    id!: string;

    @Column('bigint')
    expiresAt!: number;

    @Column('text')
    json!: string;

    // 필요에 따라 추가적인 컬럼 정의 가능
} 