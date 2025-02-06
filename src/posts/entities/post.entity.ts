import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number; // 게시물 ID

    @Column()
    title!: string; // 게시물 제목

    @Column('text')
    content!: string; // 게시물 내용

    @Column({
        type: 'enum',
        enum: PostCategory,
        default: PostCategory.FREE
    })
    category!: PostCategory; // 게시물 카테고리

    @ManyToOne(() => User, user => user.posts, { eager: false })
    author!: User; // 작성자

    @Column({ default: 0 })
    views!: number; // 조회수

    @Column({ default: 0 })
    likes!: number; // 좋아요 수

    @CreateDateColumn()
    createdAt!: Date; // 생성일

    @UpdateDateColumn()
    updatedAt!: Date; // 수정일

    @ManyToMany(() => User)
    @JoinTable({ name: 'post_likes' })
    likedBy!: User[]; // 좋아요한 사용자 목록
}

export { PostCategory };
