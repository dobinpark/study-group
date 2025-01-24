import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/users/entities/user.entity';
import { PostCategory } from '../types/post.enum';

@Entity('post')
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column('text')
    content!: string;

    @Column({
        type: 'enum',
        enum: PostCategory,
        default: PostCategory.FREE
    })
    category!: PostCategory;

    @Column({ default: 0 })
    views!: number;

    @Column({ default: 0 })
    likes!: number;

    @Column({ name: 'authorId' })
    authorId!: number;

    @ManyToOne(() => User, user => user.posts)
    author!: User;

    @CreateDateColumn({ name: 'createdAt' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt!: Date;
}
