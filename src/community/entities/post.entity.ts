import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/users/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';

@Entity()
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

    @ManyToOne(() => User, user => user.posts, { eager: false })
    author!: User;

    @Column({ default: 0 })
    views!: number;

    @Column({ default: 0 })
    likes!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 