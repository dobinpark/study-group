import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStudyGroupDto {
    @IsString()
    @IsNotEmpty({ message: '스터디 그룹 이름은 필수입니다.' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: '대분류는 필수입니다.' })
    mainCategory!: string;

    @IsString()
    @IsNotEmpty({ message: '중분류는 필수입니다.' })
    subCategory!: string;

    @IsString()
    @IsNotEmpty({ message: '소분류는 필수입니다.' })
    detailCategory!: string;

    @IsString()
    @IsNotEmpty({ message: '스터디 그룹 내용은 필수입니다.' })
    content!: string;
}
