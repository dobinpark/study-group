import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Attachment } from './attachment.entity';
import { Comment } from './comment.entity';

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isAnswered: boolean;

  @Column({ type: 'text', nullable: true })
  answer?: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Attachment, (attachment) => attachment.inquiry, {
    eager: true,
  })
  attachments: Attachment[];

  @OneToMany(() => Comment, (comment) => comment.inquiry, {
    eager: true,
  })
  comments: Comment[];
}
