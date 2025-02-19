import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from '@/src/posts/entities/post.entity';
import { StudyGroup } from '@/src/study/entities/study-group.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password!: string;

    @Column()
    nickname!: string;

    @Column()
    email!: string;

    @Column()
    phoneNumber!: string;

    @OneToMany(() => Post, post => post.author)
    posts!: Post[];

    @ApiProperty({
        description: '생성한 스터디 그룹',
        type: [StudyGroup]
    })
    @OneToMany(() => StudyGroup, studyGroup => studyGroup.creator)
    createdStudyGroups!: StudyGroup[];

    @ApiProperty({
        description: '참여한 스터디 그룹',
        type: [StudyGroup]
    })
    @ManyToMany(() => StudyGroup, studyGroup => studyGroup.members)
    joinedStudyGroups!: StudyGroup[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;
}
