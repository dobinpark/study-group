import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class StudySchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: 'offline' })
  meetingType: 'online' | 'offline';

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  meetingLink: string;

  @ManyToOne(() => StudyGroup, { eager: true })
  studyGroup: StudyGroup;

  @ManyToOne(() => User, { eager: true })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
