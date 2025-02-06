import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from '@/src/posts/entities/post.entity';
import { StudyGroup } from '@/src/study/entities/study-group.entity';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    @Exclude()
    password!: string;

    @Column({ unique: true })
    nickname!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    phoneNumber!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];

    @OneToMany(() => StudyGroup, studyGroup => studyGroup.creator)
    studyGroups!: StudyGroup[];

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;
}
