import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@Unique(['postId', 'userId']) // 한 사용자가 한 게시글에 한 번만 좋아요 가능
export class PostLike {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    postId!: number;

    @Column()
    userId!: number;

    @ManyToOne(() => Post, post => post.likes)
    @JoinColumn({ name: 'postId' })
    post!: Post;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
} 