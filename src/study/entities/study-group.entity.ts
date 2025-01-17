import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from '../../user/users/entities/user.entity';

@Entity()
@Index(['mainCategory', 'subCategory', 'detailCategory'])
export class StudyGroup {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    @Index()
    mainCategory!: string;

    @Column()
    @Index()
    subCategory!: string;

    @Column()
    @Index()
    detailCategory!: string;

    @Column('text')
    content!: string;

    @ManyToOne(() => User, user => user.studyGroups)
    creator!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
