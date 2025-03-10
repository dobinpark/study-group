import { IsString, IsInt, IsBoolean, IsNotEmpty, Min, Max, Length, ValidateNested, IsObject, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudyGroupDto {
    @ApiProperty({
        description: '스터디 그룹 이름',
        example: '알고리즘 스터디',
        minLength: 2,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty({ message: '스터디 그룹 이름은 필수입니다.' })
    @Length(2, 50, { message: '스터디 그룹 이름은 2-50자 사이여야 합니다.' })
    name!: string;

    @ApiProperty({
        description: '대분류',
        example: '지역별, 학습자별, 전공별'
    })
    @IsString()
    @IsNotEmpty()
    mainCategory!: string;

    @ApiProperty({
        description: '중분류',
        example: '서울, 고등, 공학계열'
    })
    @IsString()
    @IsNotEmpty()
    subCategory!: string;

    @ApiProperty({
        description: '소분류',
        example: '강남구, 3학년, 컴퓨터공학과'
    })
    @IsString()
    @IsNotEmpty()
    detailCategory!: string;

    @ApiProperty({
        description: '스터디 그룹 설명',
        example: '알고리즘 문제 풀이를 함께 공부하는 스터디입니다.',
        minLength: 10,
        maxLength: 1000
    })
    @IsString()
    @IsNotEmpty({ message: '스터디 그룹 설명은 필수입니다.' })
    @Length(10, 1000, { message: '스터디 그룹 설명은 10-1000자 사이여야 합니다.' })
    content!: string;

    @ApiProperty({
        description: '최대 인원 수',
        example: 10,
        minimum: 2,
        maximum: 100
    })
    @IsNumber()
    @Min(2, { message: '최소 2명 이상이어야 합니다.' })
    @Max(100, { message: '최대 100명까지 가능합니다.' })
    maxMembers!: number;

    @ApiProperty({
        description: '온라인 여부',
        example: true,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isOnline?: boolean;
}