import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StudyGroup } from './study-group.entity';

@Entity()
export class StudyGroupMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudyGroup, { eager: true })
  studyGroup: StudyGroup;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ default: 'member' })
  role: 'owner' | 'member';

  @CreateDateColumn()
  joinedAt: Date;
}
