import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
@Index(['mainCategory', 'subCategory', 'detailCategory'])
export class StudyGroup {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    leader!: User;

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

    @Column({ default: 10 })
    maxMembers!: number;

    @ManyToMany(() => User)
    @JoinTable()
    members!: User[];
}
