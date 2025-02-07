import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
    @ApiProperty({ description: '메인 카테고리', example: '지역별' })
    mainCategory!: string;

    @ApiProperty({ description: '서브 카테고리', example: '서울' })
    subCategory!: string;

    @ApiProperty({ description: '세부 카테고리', example: '강남구' })
    detailCategory!: string;

    @ApiProperty({ description: '해당 카테고리의 스터디 그룹 수', example: 10 })
    count!: number;
}