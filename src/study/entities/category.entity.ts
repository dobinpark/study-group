import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    mainCategory!: string;

    @Column()
    subCategory!: string;

    @Column()
    detailCategory!: string;

    @Column({ default: 0 })
    count!: number;
} 