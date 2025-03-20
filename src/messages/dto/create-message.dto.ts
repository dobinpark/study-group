import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateMessageDto {
    @ApiProperty({
        description: '쪽지 제목',
        example: '스터디 참여 안내',
        maxLength: 100
    })
    @IsNotEmpty({ message: '제목을 입력해주세요.' })
    @IsString({ message: '제목은 문자열이어야 합니다.' })
    @MaxLength(100, { message: '제목은 100자 이하여야 합니다.' })
    title!: string;

    @ApiProperty({
        description: '쪽지 내용',
        example: '안녕하세요. 스터디 참여 안내 드립니다. 월요일에 첫 모임이 있을 예정입니다.'
    })
    @IsNotEmpty({ message: '내용을 입력해주세요.' })
    @IsString({ message: '내용은 문자열이어야 합니다.' })
    content!: string;

    @ApiProperty({
        description: '받는 사람 ID',
        example: 2
    })
    @IsNotEmpty({ message: '받는 사람을 선택해주세요.' })
    @IsNumber({}, { message: '받는 사람 ID는 숫자여야 합니다.' })
    receiverId!: number;
    @ApiProperty({
        description: '스터디 그룹 ID (선택)',
        example: 1,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '스터디 그룹 ID는 숫자여야 합니다.' })
    studyGroupId?: number;
}
