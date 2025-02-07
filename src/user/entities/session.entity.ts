import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ISession } from 'connect-typeorm';

@Entity()
export class Session implements ISession {
    @PrimaryColumn('varchar', { length: 255 })
    id!: string;

    @Column('bigint')
    expiredAt!: number;

    @Column('text')
    json!: string;
} 