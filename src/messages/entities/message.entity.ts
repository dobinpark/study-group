import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { StudyGroup } from '../../study/entities/study-group.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    title!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column({ default: false })
    isRead!: boolean;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'senderId' })
    sender!: User;

    @Column()
    senderId!: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'receiverId' })
    receiver!: User;

    @Column()
    receiverId!: number;

    @ManyToOne(() => StudyGroup, { nullable: true })
    @JoinColumn({ name: 'studyGroupId' })
    studyGroup!: StudyGroup;

    @Column({ nullable: true })
    studyGroupId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
