import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Inquiry } from './inquiry.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @ManyToOne(() => Inquiry, (inquiry) => inquiry.attachments, {
    onDelete: 'CASCADE',
  })
  inquiry: Inquiry;

  @CreateDateColumn()
  createdAt: Date;
}
