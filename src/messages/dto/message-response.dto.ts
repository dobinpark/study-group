import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
    @ApiProperty({ description: '사용자 ID', example: 1 })
    id!: number;

    @ApiProperty({ description: '사용자 닉네임', example: '홍길동' })
    nickname!: string;
}

class StudyGroupInfo {
    @ApiProperty({ description: '스터디 그룹 ID', example: 1 })
    id!: number;

    @ApiProperty({ description: '스터디 그룹 이름', example: '자바 개발 스터디' })
    name!: string;
}

export class MessageResponseDto {
    @ApiProperty({ description: '쪽지 ID', example: 1 })
    id!: number;

    @ApiProperty({ description: '쪽지 제목', example: '스터디 참여 안내' })
    title!: string;

    @ApiProperty({ description: '쪽지 내용', example: '안녕하세요. 스터디 참여 안내 드립니다. 월요일에 첫 모임이 있을 예정입니다.' })
    content!: string;

    @ApiProperty({ description: '읽음 여부', example: false })
    isRead!: boolean;

    @ApiProperty({ description: '보낸 사람 정보', type: UserInfo })
    sender!: UserInfo;

    @ApiProperty({ description: '받는 사람 정보', type: UserInfo })
    receiver!: UserInfo;

    @ApiProperty({ description: '스터디 그룹 정보', type: StudyGroupInfo, required: false })
    studyGroup?: StudyGroupInfo;

    @ApiProperty({ description: '생성 시간', example: '2025-03-19T12:34:56.789Z' })
    createdAt!: Date;

    @ApiProperty({ description: '수정 시간', example: '2025-03-19T12:34:56.789Z' })
    updatedAt!: Date;
}
