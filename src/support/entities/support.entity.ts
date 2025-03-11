import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SupportCategory } from '../enum/support-category.enum'; // PostCategory -> SupportCategory 로 Enum 변경

@Entity()
export class Support { // 클래스 이름 변경
    @PrimaryGeneratedColumn()
    id!: number; // 게시물 ID -> 고객센터 게시글 ID 로 변경

    @Column()
    title!: string; // 게시물 제목 -> 고객센터 게시글 제목 로 변경

    @Column('text')
    content!: string; // 게시물 내용 -> 고객센터 게시글 내용 로 변경

    @Column({
        type: 'enum',
        enum: SupportCategory // PostCategory -> SupportCategory 로 Enum 변경
    })
    category!: SupportCategory; // 게시물 카테고리 -> 고객센터 게시글 카테고리 로 변경

    @Column()
    authorId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'authorId' })
    author!: User; // 작성자

    @Column({ default: 0 })
    views!: number; // 조회수

    @CreateDateColumn()
    createdAt!: Date; // 생성일

    @UpdateDateColumn()
    updatedAt!: Date; // 수정일
}

export { SupportCategory }; // PostCategory -> SupportCategory 로 export 변경 