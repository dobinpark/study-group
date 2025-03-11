import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StudyGroup {
    @ApiProperty({ description: '스터디 그룹 ID' })
    @PrimaryGeneratedColumn()
    id!: number;

    @ApiProperty({ description: '스터디 그룹 이름' })
    @Column()
    name!: string;

    @ApiProperty({ description: '스터디 그룹 설명' })
    @Column('text')
    content!: string;

    @ApiProperty({ description: '대분류' })
    @Column()
    mainCategory!: string;

    @ApiProperty({ description: '중분류' })
    @Column()
    subCategory!: string;

    @ApiProperty({ description: '소분류' })
    @Column()
    detailCategory!: string;

    @ApiProperty({ description: '최대 인원 수' })
    @Column()
    maxMembers!: number;

    @ApiProperty({ description: '현재 인원 수' })
    @Column({ default: 1 })
    currentMembers!: number;

    @ApiProperty({ description: '생성자 ID' })
    @Column()
    creatorId!: number;

    @ApiProperty({
        description: '온라인 스터디 여부',
        example: true,
        default: true
    })
    @Column({ default: true })
    isOnline!: boolean;

    @ApiProperty({
        description: '스터디 그룹 생성자',
        type: () => User
    })
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'creatorId' })
    creator!: User;

    @ApiProperty({
        description: '스터디 그룹 멤버들',
        type: () => [User]
    })
    @ManyToMany(() => User, { eager: true })
    @JoinTable({
        name: 'study_group_members',
        joinColumn: { name: 'studyGroupId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
    })
    members!: User[];

    @ApiProperty({ description: '생성일' })
    @CreateDateColumn()
    createdAt!: Date;

    @ApiProperty({ description: '수정일' })
    @UpdateDateColumn()
    updatedAt!: Date;
    studyGroup: any;
}
