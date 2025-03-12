import { ApiProperty } from '@nestjs/swagger';
import { StudyGroup } from '../entities/study-group.entity';

export class GetMyStudiesResponseDto {
    @ApiProperty({ type: [StudyGroup], description: '내가 생성한 스터디 그룹 목록' })
    created!: StudyGroup[];

    @ApiProperty({ type: [StudyGroup], description: '내가 참여한 스터디 그룹 목록' })
    joined!: StudyGroup[];
} 