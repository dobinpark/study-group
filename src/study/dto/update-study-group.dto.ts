import { IsString, IsOptional, IsNumber, Min, Max, Length, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudyGroupDto {
    @ApiPropertyOptional({
        description: '스터디 그룹 이름',
        example: '알고리즘 스터디'
    })
    @IsString()
    @IsOptional()
    @Length(2, 50, { message: '스터디 그룹 이름은 2-50자 사이여야 합니다.' })
    name?: string;

    @ApiPropertyOptional({
        description: '대분류',
        example: '지역별, 학습자별, 전공별'
    })
    @IsString()
    @IsOptional()
    mainCategory?: string;

    @ApiPropertyOptional({
        description: '중분류',
        example: '서울, 고등, 공학계열'
    })
    @IsString()
    @IsOptional()
    subCategory?: string;

    @ApiPropertyOptional({
        description: '소분류',
        example: '강남구, 3학년, 컴퓨터공학과'
    })
    @IsString()
    @IsOptional()
    detailCategory?: string;

    @ApiPropertyOptional({
        description: '스터디 그룹 설명',
        example: '알고리즘 문제를 함께 풀어보는 스터디입니다.'
    })
    @IsString()
    @IsOptional()
    @Length(10, 1000, { message: '스터디 그룹 설명은 10-1000자 사이여야 합니다.' })
    content?: string;

    @ApiPropertyOptional({
        description: '최대 인원 수',
        minimum: 2,
        maximum: 100,
        example: 10
    })
    @IsNumber()
    @IsOptional()
    @Min(2, { message: '최소 2명 이상이어야 합니다.' })
    @Max(100, { message: '최대 100명까지 가능합니다.' })
    maxMembers?: number;

    @ApiPropertyOptional({
        description: '온라인 여부',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isOnline?: boolean;
} 