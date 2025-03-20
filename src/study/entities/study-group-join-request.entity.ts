import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { StudyGroup } from './study-group.entity';

export enum JoinRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity('study_group_join_requests')
export class StudyGroupJoinRequest {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    studyGroupId!: number;

    @Column('text')
    reason!: string;

    @Column('text')
    experience!: string;

    @Column({
        type: 'enum',
        enum: JoinRequestStatus,
        default: JoinRequestStatus.PENDING
    })
    status!: JoinRequestStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => StudyGroup)
    @JoinColumn({ name: 'studyGroupId' })
    studyGroup!: StudyGroup;
}
