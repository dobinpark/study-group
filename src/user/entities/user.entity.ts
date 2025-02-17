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
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
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
    @Exclude()
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
        type: () => [StudyGroup]  // 배열 타입으로 지정
    })
    @OneToMany(() => StudyGroup, studyGroup => studyGroup.creator, {
        cascade: true
    })
    createdStudyGroups!: StudyGroup[];

    @ApiProperty({ 
        description: '참여한 스터디 그룹',
        type: () => [StudyGroup]  // 배열 타입으로 지정
    })
    @ManyToMany(() => StudyGroup, studyGroup => studyGroup.members, {
        cascade: true
    })
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

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens?: RefreshToken[];
}
