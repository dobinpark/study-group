import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StudyGroupMembership } from './study-group-membership.entity';

@Entity()
export class StudyGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 30 })
  maxMembers: number;

  @Column()
  currentMembers: number;

  @Column()
  region: string;

  @Column()
  category: string;

  @Column()
  purpose: string;

  @ManyToOne(() => User, { eager: true })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StudyGroupMembership, (membership) => membership.studyGroup)
  memberships: StudyGroupMembership[];
}
