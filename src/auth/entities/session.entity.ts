import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
    @PrimaryColumn('varchar', { length: 255 })
    id!: string;

    @Column('bigint')
    expiresAt!: number;

    @Column('text')
    json!: string;

    // 필요에 따라 추가적인 컬럼 정의 가능
}
